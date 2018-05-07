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

// Returns the closest integer that is equal to or below x
function flr(x) {
  return Math.floor(x);
}

// Returns the closest integer that is equal to or above x
function ceil(x) {
  return Math.ceil(x);
}

// Returns the sign of x
function sgn(x) {
  return Math.sign(x);
}

// Returns a mod b
function mod(a, b) {
  return a - b * Math.floor(a / b);
}

// Returns the square root of x
function sqrt(x) {
  return Math.sqrt(x);
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
  if (dx == 0 && dy == 0) return 0.75;
  var a = Math.atan2(-dy, dx) / (2 * Math.PI);
  if (a < 0) a = 1 + a;
  return a;
}

//------------------------------------------------------------------------------

// Create a square canvas of the given size
function createCanvas(size) {
  var canvas = document.createElement('canvas');
  canvas.height = size;
  canvas.width = size;
  return canvas;
}

//------------------------------------------------------------------------------

class Pico8 {
  constructor() {

    // Size of a square frame in pixels
    this.size = 128;

    // Frames per second
    this.fps = 30;
    this.wait = 1000 / this.fps;

    // Time since startup
    this.start = performance.now();
    this.time = 0;
    window.setInterval(() => {
      this.time = (performance.now() - this.start) / 1000;
    }, 10)

    // Random number state 
    this.state = Math.random();

    // Whether to continue running the loop function
    // Allows early stopping rather than running continuously between draws
    this.continue = true;

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
    // TODO: Render to onscreen canvas then scale using CSS?
    this.offscreen = createCanvas(this.size);
    this.offscreenCtx = this.offscreen.getContext('2d');

    // Onscreen image
    this.onscreen = createCanvas(384);
    this.onscreenCtx = this.onscreen.getContext('2d');
    this.onscreenCtx.imageSmoothingEnabled = false;
    // this.onscreenCtx.filter = 'blur(0.5px)';
    document.body.appendChild(this.onscreen);

    // Make all methods global so we can access them as we would in PICO-8
    for (let method of Object.getOwnPropertyNames(Pico8.prototype)) {
      window[method] = this[method].bind(this);
    }
  }

  // Run the PICO-8 program
  run(f) {
    init();
    f();
    window.setInterval(() => {
      this.continue = true;
      this.loop();
      this.update();
      this.draw();
    }, this.wait);
  }

  // Called once on program startup
  init() {

  }

  // Called once per visible frame
  draw() {
    display();
  }

  // Called once per update at 30fps
  update() {

  }

  // Display the frame stored in `pixels` on the screen
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

  // Flip the back buffer to screen and wait for next frame (30fps)
  flip() {
    this.display();
    this.continue = false;
  }

  t() {
    return this.time;
  }

  // Returns a random number n, where 0 <= n < x
  // See https://en.wikipedia.org/wiki/Linear_congruential_generator
  rnd(x = 1) {
    var a = 1664525,
        c = 1013904223,
        modulus = 2**32;
    this.state = (a * this.state + c) % modulus;
    return this.state / modulus * x;
  }

  // Sets the random number seed
  srand(x) {
    this.state = x;
  }

  // Run a given function continuously between screen updates
  loop(f) {
    this.loop = () => {
      var start = performance.now();
      while (this.continue && performance.now() - start < this.wait) {
        f();
      }
    }
  }

  // Clear the screen and reset the clipping rectangle
  cls() {
    this.pixels.fill(0);
  }

  // Draw all instances of color c0 as c1 in subsequent draw calls
  pal(c0, c1) {
    var max = this.palette.length;
    if (c0 < 0 || c0 >= max || c1 < 0 || c1 >= max) return;
    this.map[c0] = c1;
  }

  // Draw a line from x0, y0 to x1, y1 with color c
  line(x0, y0, x1, y1, c) {
    var x0 = flr(x0),
        y0 = flr(y0),
        x1 = flr(x1),
        y1 = flr(y1),
        c = flr(c);
    
    var dx = x1 - x0;
    var dy = y1 - y0;
    pset(x0, y0, c);
    if (abs(dx) > abs(dy)) {
      var sx = sgn(dx);
      var m = dy / dx * sx;
      var x = x0,
          y = y0;
      while (x != x1) {
        x += sx;
        y += m;
        pset(x, y, c);
      }
    } else {
      var sy = sgn(dy);
      var m = dx / dy * sy;
      var x = x0,
          y = y0;
      while (y != y1) {
        y += sy;
        x += m;
        pset(x, y, c);
      }
    }
  }

  // Draw a circle at x, y with radius r and color c
  circ(x0, y0, r, c) {
    if (r < 0) return;
    var x0 = flr(x0),
        y0 = flr(y0),
        r = flr(r),
        c = flr(c);

    var x = 0;
    var y = r;
    var p = (5 - r*4)/4;

    while (x <= y) {
      if (x === 0) {
        // 0, 90, 180, 270 degrees
        this.pset(x0    , y0 + y, c);
        this.pset(x0    , y0 - y, c);
        this.pset(x0 + y, y0    , c);
        this.pset(x0 - y, y0    , c);
      } else if (x === y) {
        // 45, 135, etc.
        this.pset(x0 + x, y0 + y, c);
        this.pset(x0 - x, y0 + y, c);
        this.pset(x0 + x, y0 - y, c);
        this.pset(x0 - x, y0 - y, c);
      } else if (x < y) {
        this.pset(x0 + x, y0 + y, c);
        this.pset(x0 - x, y0 + y, c);
        this.pset(x0 + x, y0 - y, c);
        this.pset(x0 - x, y0 - y, c);
        this.pset(x0 + y, y0 + x, c);
        this.pset(x0 - y, y0 + x, c);
        this.pset(x0 + y, y0 - x, c);
        this.pset(x0 - y, y0 - x, c);
      }
      x++;
      if (p < 0) {
        p += 2*x + 1;
      } else {
        y--;
        p += 2*(x-y) + 1;
      }
    }
  }

  // Get the color of a pixel at x, y
  pget(x, y) {
    if (x < 0 || x >= this.size || y < 0 || y >= this.size) return 0;
    var x = flr(x),
        y = flr(y);
    return this.pixels[x + y * this.size];
  }

  // Set the color (c) of a pixel at x, y
  pset(x, y, c) {
    if (x < 0 || x >= this.size || y < 0 || y >= this.size) return;
    var x = flr(x),
        y = flr(y),
        c = flr(c);
    this.pixels[x + y * this.size] = c % this.palette.length;
  }
}

//------------------------------------------------------------------------------

function animation() {
  var p = new Pico8();

  // Algorithm by Sean S. LeBlanc
  // https://twitter.com/SeanSLeBlanc/status/982648532296503304
  var whirlwind = () => {
    for (var i = 1; i <= 16; i++) {
      pal(i-1, sub('029878920', i/2, i/2), 1);
    }
    cls();
    loop(() => {
      var x = rnd(128);
      var y = rnd(128);
      var a = 64 + 32*sin(t()/2) - x;
      var b = 64 + 32*cos(t()/3) - y;
      var z = atan2(a, b) + t()/4;
      line(x,y,x+cos(z)*4,y+sin(z)*4,
        (
          pget(x,y)+
          pget(x+1,y)+
          pget(x,y+1)+
          pget(x+1,y+1)
        )/4
        +1);
    });
  };

  // Algorithm by Eli Piilonen
  // https://twitter.com/2DArray/status/992601223491600386
  // In Lua, % is modulo, but in JS, % is remainder, so all % are now mod
  var leaves = () => {
    var r = rnd;
    loop(() => {
      cls();
      var s = t();
      srand(0);
      for (var i = 1; i <= 60; i++) {
        var x = mod(r(148)+sin(s/(3+r(3)))*5-s*(2+rnd(12))+10,147)-10;
        var y = mod(r(148)+s*(3+r(8))+10,147)-10;
        var u = sin(r()+s*r()/3);
        var v = cos(r()+s*r()/3);
        for (var j = -7; j <= 7; j++) {
          circ(x+u*j-v*abs(j/4),y+v*j+u*abs(j/4),abs(u*v)*(7-abs(j))/1.5,3+mod(j,2)*8);
        }
      }
      flip();
    });
  }

  // Algorithm by Joseph White
  // https://twitter.com/lexaloffle/status/844964963315703809
  var waves = () => {
    var r = 64;
    var t = 0;
    loop(() => {
      cls();
      for (var y = -r; y <= r; y += 3) {
        for (var x = -r; x <= r; x += 2) {
          var z = cos(sqrt(x*x+y*y*2)/40-t)*6;
          pset(r+x,r+y-z,6);
        }
      }
      flip();
      t += 2/r;
    });
  }

  run(leaves);
}