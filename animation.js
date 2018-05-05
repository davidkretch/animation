// Grab substrings
// s = "the quick brown fox"
// print(sub(s,5,9))  --> "quick"
// print(sub(s,5))  --> "quick brown fox"
function sub(s, start, end) {
  return s.substring(start, end + 1);
}

// Returns the absolute (positive) value of x
function abs(x) {
  return Math.abs(x);
}

// Returns a random number n, where 0 <= n < x
function rnd(x) {
  return Math.random() * x;
}

// Returns the sine of x, where 1.0 indicates a full circle
// sin is inverted to suit screenspace
// e.g. sin(0.25) returns -1
function sin(x) {
  return Math.sin(-x * 2 * Math.PI);
}

// Returns the cosine of x, where 1.0 indicates a full circle
function cos(x) {
  return Math.cos(x * 2 * Math.PI);
}

// Converts dx, dy into an angle from 0..1
// As with cos/sin, angle is taken to run anticlockwise in screenspace
// e.g. atan(1, -1) returns 0.125
function atan2(dx, dy) {
  return Math.atan2(-dy, dx) / (2 * Math.PI);
}

// Returns the time in seconds, to millisecond precision
function t() {
  return Date.now() / 1000;
}

//------------------------------------------------------------------------------

// Create a square canvas of the given size
function createCanvas(size) {
  var canvas = document.createElement('canvas');
  canvas.height = size;
  canvas.width = size;
  return canvas;
}

// Swap a and b
function swap(a, b) {
  var tmp = a;
  a = b;
  b = tmp;
  return [a, b];
}

//------------------------------------------------------------------------------

class Pico8 {
  constructor() {

    // Size of a square frame in pixels
    this.size = 128;

    // Frames per second
    this.fps = 30;
    this.wait = 1000 / this.fps;

    // PICO-8 color palette
    this.palette = [
      [  0,   0,   0],  //  0 black
      [ 29,  43,  83],  //  1 dark-blue
      [126,  37,  83],  //  2 dark-purple
      [  0, 135,  81],  //  3 dark-green
      [171,  82,  54],  //  4 brown
      [ 95,  87,  79],  //  5 dark-gray
      [194, 195, 199],  //  6 light-gray
      [255, 241, 232],  //  7 white
      [255,   0,  77],  //  8 red
      [255, 163,   0],  //  9 orange
      [255, 236,  39],  // 10 yellow
      [  0, 228,  54],  // 11 green
      [ 41, 173, 255],  // 12 blue
      [131, 118, 156],  // 13 indigo
      [255, 119, 168],  // 14 pink
      [255, 204, 170]   // 15 peach
    ];

    // Color mapping
    this.map = new Uint8ClampedArray(this.palette.length);
    for (var i = 0; i < this.map.length; i++) {
      this.map[i] = i;
    }

    // Pixel array
    this.pixels = new Uint8ClampedArray(this.size * this.size);

    // Offscreen image
    this.offscreen = createCanvas(this.size);
    this.offscreenCtx = this.offscreen.getContext('2d');

    // Onscreen image
    this.onscreen = createCanvas(512);
    this.onscreenCtx = this.onscreen.getContext('2d');
    this.onscreenCtx.imageSmoothingEnabled = false;
    document.body.appendChild(this.onscreen);

    // Make all methods global so we can access them as we would in PICO-8
    for (let method of Object.getOwnPropertyNames(Pico8.prototype)) {
      window[method] = this[method].bind(this);
    }
  }

  // Run the PICO-8 program
  run() {
    window.setInterval(() => {
      this.draw();
      this.display();
    }, this.wait);
  }

  // Called once per visible frame
  draw() {

  }

  // Render pixel data to the offscreen canvas, then scale it to the onscreen
  display() {
    var size = this.size;
    var imageArray = new Uint8ClampedArray(size * size * 4);
    for (var i = 0; i < size * size; i++) {
      var pixel = this.pixels[i];
      var [r, g, b] = this.palette[this.map[pixel]];
      var a = 255; // TODO
      var index = i * 4;
      imageArray[index + 0] = r;
      imageArray[index + 1] = g;
      imageArray[index + 2] = b;
      imageArray[index + 3] = a;
    }
    var imageData = new ImageData(imageArray, size, size);
    this.offscreenCtx.putImageData(imageData, 0, 0);
    var height = this.onscreen.height,
      width = this.onscreen.width;
    this.onscreenCtx.drawImage(this.offscreen, 0, 0, height, width);
  }

  loop(f) {
    var start = performance.now();
    while (performance.now() - start < this.wait) {
      f();
    }
  }

  // Clear the screen and reset the clipping rectangle
  cls() {
    this.pixels.fill(0);
  }

  // Draw all instances of color c0 as c1 in subsequent draw calls
  //
  // Two types of palette (p; defaults to 0)
  // 0 draw palette   : colors are remapped on draw    // e.g. to re-color sprites
  // 1 screen palette : colors are remapped on display // e.g. for fades
  pal(c0, c1) {
    this.map[c0] = c1;
  }

  // Draw a line
  line(x0, y0, x1, y1, c) {
    if (x1 < x0) {
      [x0, x1] = swap(x0, x1);
      [y0, y1] = swap(y0, y1);
    }
    var dx = x1 - x0;
    var dy = y1 - y0;
    var m = dy / dx;
    if (m <= 1) {
      var y = y0;
      for (var x = x0; x <= x1; x++) {
        pset(Math.round(x), Math.round(y), c);
        y += m;
      }
    } else {
      var x = x0;
      m = dx / dy;
      for (var y = y0; y <= y1; y++) {
        pset(Math.round(x), Math.round(y), c);
        x += m;
      }

    }
  }

  // Get the color of a pixel at x, y
  pget(x, y) {
    var x = Math.floor(x),
        y = Math.floor(y);
    return this.pixels[x + y * this.size];
  }

  // Set the color (c) of a pixel at x, y
  pset(x, y, c) {
    var x = Math.floor(x),
        y = Math.floor(y),
        c = Math.floor(c);
    var max = this.palette.length;
    this.pixels[x + y * this.size] = c < max ? c : 0 ;
  }
}

//------------------------------------------------------------------------------

function animation() {
  p = new Pico8();

  // Algorithm by Sean S. LeBlanc
  // https://twitter.com/SeanSLeBlanc/status/982648532296503304
  p.draw = () => {
    for (var i = 1; i <= 16; i++) {
      pal(i-1, sub('029878920', i/2, i/2), 1);
    }
    // cls();
    loop(() => {
      var x = rnd(128);
      var y = rnd(128);
      var a = 64 + 32*sin(t()/2) - x;
      var b = 64 + 32*cos(t()/3) - y;
      var z = atan2(a, b) + t()/4;
      var c = (
        pget(x  , y  )+
        pget(x+1, y  )+
        pget(x  , y+1)+
        pget(x+1, y+1)
        )/4
        +1;
      line(x, y, x+cos(z)*4, y+sin(z)*4, c);
    });
  };

  run();
}