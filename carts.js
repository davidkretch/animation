
var whirlwind = new Cart(
  author = "Sean S. LeBlanc",
  source = "https://twitter.com/SeanSLeBlanc/status/982648532296503304",
  () => {
    for (var i=1; i<=16; i++) {
      pal(i-1,sub('029878920',i/2,i/2),1);
    }
    cls();
    _(() => {
      var x=rnd(128),
          y=rnd(128),
          a=64+32*sin(t()/2)-x,
          b=64+32*cos(t()/3)-y,
          z=atan2(a,b)+t()/4;
      line(x,y,x+cos(z)*4,y+sin(z)*4,
        (
          pget(x,y)+
          pget(x+1,y)+
          pget(x,y+1)+
          pget(x+1,y+1)
        )/4
        +1);
    });
  }
);

var leaves = new Cart(
  author = "Eli Piilonen",
  source = "https://twitter.com/2DArray/status/992601223491600386",
  () => {
    var r = rnd;
    _(() => {
      cls();
      var s = t();
      srand(0);
      for (var i=1; i<=60; i++) {
        var x=mod(r(148)+sin(s/(3+r(3)))*5-s*(2+rnd(12))+10,147)-10,
            y=mod(r(148)+s*(3+r(8))+10,147)-10,
            u=sin(r()+s*r()/3),
            v=cos(r()+s*r()/3);
        for (var j=-7; j<=7; j++) {
          circ(x+u*j-v*abs(j/4),y+v*j+u*abs(j/4),abs(u*v)*(7-abs(j))/1.5,3+mod(j,2)*8);
        }
      }
      flip();
    });
  }
);

var waves = new Cart(
  author = "Joseph White",
  source = "https://twitter.com/lexaloffle/status/844964963315703809",
  () => {
    var r=64;
    var t=0;
    _(() => {
      cls();
      for (var y=-r; y<=r; y+=3) {
        for (var x=-r; x<=r; x+=2) {
          var z=cos(sqrt(x*x+y*y*2)/40-t)*6;
          pset(r+x,r+y-z,6);
        }
      }
      flip();
      t += 2/r;
    });
  }
);

var tree = new Cart(
  author = "Eli Piilonen",
  source = "https://twitter.com/2DArray/status/993594055849164800",
  () => {
    _(() => {
      cls()
      for (var i=-1; i<=1; i++) {
        srand();
        var x=64, y=128, m=x*y, f=[], l=10, r=0;
        while (1) {
          l-=1, u=x, v=y, r+=.02;
          x+=sin(r+t()/8)*7;
          y-=rnd(9)+7;
          line(u+i,v,x+i,y,4-min(i,0)*5);
          if (l<1) {
            if (len(f)==0) break;
            circ(x,y,rnd(9)+i,2+i);
            n=f[len(f)-1];
            del(f,n);
            x=n[0], y=n[1], l=n[2];
          } else {
            add(f,[x,y,l-1]);
          }
        }
      }
      flip();  
    })
  }
);