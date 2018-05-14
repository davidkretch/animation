// Grab substrings
// s = "the quick brown fox"
// print(sub(s,5,9))  --> "quick"
// print(sub(s,5))  --> "quick brown fox"
function sub(s, start, end) {
  if (start >= 1) {
    start -= 1;
  } else if (start < 0) {
    start = s.length + start
}
  if (end === undefined) {
    return s.substring(start);
  } else {
    return s.substring(start, end);
  }
}

// Returns the minimum of parameters
function min(...values) {
  return Math.min(...values);
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
  if (dx === 0 && dy === 0) return 0.75;
  var a = Math.atan2(-dy, dx) / (2 * Math.PI);
  if (a < 0) a = 1 + a;
  return a;
}

// Add value v to the end of table t
function add(t, v) {
  return t.push(v);
}

// Delete the first instance of value v in table t
function del(t, v) {
  for (var i = 0; i < t.length; i++) {
    if (t[i] === v) {
      t.splice(i, 1);
      break;
    }
  }
}

// Returns the length of table t
function len(t) {
  return t.length;
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
    this.loop = () => {};

    // PICO-8 colors
    this.colors = [
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

    // Draw and screen palettes
    this.drawPalette = new Uint8ClampedArray(this.colors.length);
    this.screenPalette = new Uint8ClampedArray(this.colors.length);
    this.pal();

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
    this.onscreenCtx.filter = 'blur(0.5px)';
    document.body.appendChild(this.onscreen);

    // Make all methods global so we can access them as we would in PICO-8
    for (let method of Object.getOwnPropertyNames(Pico8.prototype)) {
      window[method] = this[method].bind(this);
    }
  }

  // Run the PICO-8 program
  run(cart) {
    init();
    cart.code();
    window.setInterval(() => {
      this.continue = true;
      this.loop();
      this.update();
      this.draw();
      this.flip();
    }, this.wait);
  }

  // Called once on program startup
  init() {

  }

  // Called once per visible frame
  draw() {

  }

  // Called once per update at 30fps
  update() {

  }

  // Display the frame stored in `pixels` on the screen
  // TODO: Refactor
  display() {
    var size = this.size;

    // Update the frame based on the screen palette
    for (var i = 0; i < size * size; i++) {
      var pixel = this.pixels[i];
      this.pixels[i] = this.screenPalette[pixel];
    }

    // Push the frame to the screen
    var imageArray = new Uint8ClampedArray(size * size * 4);
    for (var i = 0; i < size * size; i++) {
      var pixel = this.pixels[i];
      var [r, g, b] = this.colors[pixel];
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
  srand(x = 0) {
    this.state = x;
  }

  // Run a given function continuously between screen updates
  _(f) {
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
  // pal() to reset to system defaults (including transparency values and fill pattern)
	// Two types of palette (p; defaults to 0)
  // 0 draw palette   : colours are remapped on draw    // e.g. to re-colour sprites
  // 1 screen palette : colours are remapped on display // e.g. for fades
  pal(c0, c1, p = 0) {
    var max = this.colors.length;
    if (c0 < 0 || c0 >= max || c1 < 0 || c1 >= max) return;

    if (c0 === undefined && c1 === undefined) {
      for (var i = 0; i < max; i++) {
        this.drawPalette[i] = i;
        this.screenPalette[i] = i;
      }
    }

    if (p === 0) {
      this.drawPalette[c0] = c1;
    } else if (p === 1) {
      this.screenPalette[c0] = c1;
    }
  }

  // Draw a line from x0, y0 to x1, y1 with color c
  line(x0, y0, x1, y1, c) {
    if (isNaN(x0) || isNaN(y0) || isNaN(x1) || isNaN(y1)) return;

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
    if (isNaN(x0) || isNaN(y0) || isNaN(r)) return;
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
    this.pixels[x + y * this.size] = c % this.colors.length;
  }
}

//------------------------------------------------------------------------------

class Cart {
  constructor(author, source, code) {
    this.author = author;
    this.source = source;
    this.code = code;
  }
}
