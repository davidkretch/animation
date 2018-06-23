
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

// TODO
var waterfall = new Cart(
  author = "@voxeledphoton",
  source = "https://twitter.com/voxeledphoton/status/1002044993920491520",
  () => {
    s,t,r,m,u,v=sin,0,8,rectfill,.32,1/32
    ::_::t+=.01cls(1)
    m(33,0,94,127,12)
    for i=0,32 do
    for j=0,r do
    y,z=-t+1/r*j,i+1
    m(64-i*.2+s(v*i*u+y)*32,(i*u)^2,64+i*.2+s(v*z*u+y)*32,(z*u)^2,7)end
    a=s(t*8+i*.03)*4
    m(i*4,109+a,z*4,127,7)
    m(i*4,116+a,z*4,127,12)end
    flip()
    goto _
  }
);

// TODO
var rollercoaster = new Cart(
  author = "@2DArray",
  source = "https://twitter.com/2DArray/status/1002273371160305667",
  () => {
    e=.009p=0::_::cls(2)p=p%1-e
    for j=0,5 do
    for i=0,1,e do
    r=j%2*4g=64+cos(i)*(35+r)z=sin(i)*(17+r)y=64+cos(i*3)*12*(sin(i)/2+.5)
    if(j<2)line(g,y-z,g,80-z,1+j%2*3)
    if(j<4)line(g,y-z,u,v,6)
    if(p-i>.5)i+=1
    if(i<p+.05 and i>p)circfill(g,y-z-2,2,1)
    u,v=g,y-z
    end
    end
    flip()goto _
  }
);

// TODO
var ferriswheel = new Cart(
  author = "@2DArray",
  source = "https://twitter.com/2DArray/status/1001889783323549696",
  () => {
    u=95
    v=63
    ::_::
    cls()
    for j=-2,2 do
    for i=0,1,.05 do
    a=i+t()/8
    x=cos(a)*30+64+j
    y=sin(a)*30+64+j
    if(j*j>0)line(x,y,u,v,8+i*3)
    rectfill(x-1,y+2,x+1,y+4,1+i*15)line(64,64,x,y,2)u,v=x,y
    end
    for i=-1,1,2 do
    if(j!=0)line(64+j,64+j,64+j*3+i*16,99+j*3,8+j)
    end
    end
    flip()goto _
  }
);

// TODO
var fractal = new Cart(
  author = "@voxeledphoton",
  source = "https://twitter.com/voxeledphoton/status/1000101827801645056",
  () => {
    s,c,l,t=sin,cos,line,0
    ::_::t+=.005cls()
    function p(n,x,y,r,a,co)
    for i=1,n do
    b=i-1
    j=b/n+a
    k=i/n+a
    d=x+c(j)*r
    e=y+s(j)*r
    f=x+c(k)*r
    g=y+s(k)*r
    local co+=1
    l(d,e,f,g,co)
    if co<12 then
    p(n,d,e,r*.5,-a,co)
    end end end
    p(4,64,64,32,t,7)
    flip()goto _
  }
);

// TODO
var cat = new Cart(
  author = "@2DArray",
  source = "https://twitter.com/2DArray/status/999011624114708481",
  () => {
    r=rnd
    ::_::
    cls()
    srand(27)
    p=pset
    for i=-1,1,2 do
    for x=1,10 do
    circ(64+x*i,64+x/3,4+x/5+i,1)
    p(58+x,70+r(3)+x/10,1)
    p(50+i*3+r(3),65+r(3)-i,12+r(2))
    if(i==-1)x+=10
    circ(80+sin(x/20-t()/2)*x/5,70+x/1.5,1,1)
    end
    end
    for i=-2,2 do
    if(i!=0)p(52+i,70-i/4,6)
    end
    flip()goto _
  }
);

// TODO
var outrun = new Cart(
  author = "Grégory Béal",
  source = "https://twitter.com/GregosEl/status/947510365587374080",
  () => {
    r=64 t=0
    ::a::
    cls(14)
    circfill(64,35,20,8)
    rectfill(0,44,128,128,0)
    z=sin(t/24)/2
    for n=0,20 do
    f=(n+t%1)^2.7/16
    y=f+43
    line(-1,y,r-f*(z+.8),y,2)
    line(r+f*(-z+.8),y,128,y)
    end
    ?"2018",57,33,14
    w=t%1<.5 and"m"or"w"
    ?":/+-\\:\n"..w.."<\152>"..w,53,90,8
    t+=.25
    flip()goto a
  }
);

var metallic = new Cart(
  author = "Tero Lindeman",
  source = "https://twitter.com/kometbomb/status/962657366062829570",
  () => {
    t,r,z,q=0,rect,{7,10,9,4,1,0,1,2,13,14,15,7,7},64
    fillp(23130)::_::cls(5)t+=.01
    for x=-1,127 do
    p=y or 1
    y=cos(x/99+sin(t+x/q)*.2)*8
    c=max(1,min(12,(y-p)*8+4))
    r(x,q,x,-y+92,1*16+5)
    r(x,q,x,-y+90,1)
    r(x,q,x,-y+88,0)
    r(x,y+46,x,y+76,z[flr(c)]+z[flr(c+.5)]*16)
    end
    flip()goto _
  }
);

var ocean = new Cart(
  author = "@2DArray",
  source = "https://twitter.com/2DArray/status/987552418203422721",
  () => {
    c={0,1,13,12,12,7}
    ::_::
    cls()
    fillp(0b1010010110100101.1)
    rectfill(0,64,127,127,1)
    fillp()
    for y=64,127 do
    w=sqrt((y-64)/64)
    for x=y%2,127,2+3*w do
    a=(x+y)/40-t()/4
    u=cos(a)*w
    v=sin(a)*w
    circfill(x+u*5,y+v*5,3*w,c[flr((-u/2+.5)*#c*(x%1))+2])
    end
    end
    flip()goto _
  }
);

var fireflies = new Cart(
  author = "@TedAjax",
  source = "https://twitter.com/TedAjax/status/1004865330831712256",
  () => {
    l={10,9,8,2,1}
    ::_::
    cls()srand()for m=0,99 do
    x=rnd(8)-4
    z=rnd(8)-4
    y=rnd(14)-7
    for n=4,0,-1 do
    a=t()/4+n*.01
    b=t()/4+(n+1)*.01
    c=cos(a)*x-sin(a)*z
    d=sin(a)*x+cos(a)*z+7
    g=64+(c*64)/d
    h=64+(y*64)/d
    circfill(g,h,max((7-d)+n/2,0),l[4-n+1])
    end
    end
    flip()goto _
  }
);

var cone = new Cart(
  author = "@lexaloffle",
  source = "https://twitter.com/lexaloffle/status/1003303393572425731",
  () => {
    r=rnd::_::srand()f=t()/9
    cls()n=650+60*sin(f/3)for i=1,n do
    a=f+r(1)d=.3+r(9)y=-3
    if i>400 then j=i-400 y=j*2/n-1
    a=j*40/n+f+j/3 d=j*3/n end
    x=d*cos(a)z=2+cos(f)+d*sin(a)x=64+x*64/z
    y=64+y*64/z c=6+i%5 e=5/z
    if(z>.1)circfill(x,y,e,c)circfill(x,128-y,e,c/4)
    end flip()goto _
  }
);

var cube = new Cart(
  author = "@lexaloffle",
  source = "https://twitter.com/lexaloffle/status/1004070761030606848",
  () => {
    function _init()
    -- make some points
    -- 7x7x7 cube
    
    pt={}
    for z=-1,1,1/3 do
      for y=-1,1,1/3 do
      for x=-1,1,1/3 do
        p={}
        p.x, p.y, p.z=x,y,-z
        p.col=8+(x*2+y*3)%8
        add(pt,p)
      end
      end
    end
    
    end

    --rotate x,y by angle a
    function rot(x,y,a)
    local x0=x
    x=cos(a)*x-sin(a)*y
    y=cos(a)*y+sin(a)*x0
    return x,y
    end

    function _draw()
    cls()
    for p in all(pt) do
      -->camera space
      
      p.cx,p.cz=rot(p.x,p.z,t()/8)
      p.cy,p.cz=rot(p.y,p.cz,t()/7)
      
      
      p.cz+=2 + cos(t()/6)
      
    end
    
    --sort by distance from camera
    --because they go out of order
    --slowly, doing a bubble sort
    --up and down 3 times is good
    --enough

    for pass=1,3 do
    for i=1,#pt-1 do
      if pt[i].cz<pt[i+1].cz then
      pt[i],pt[i+1]=
      pt[i+1],pt[i]
      end
    end
    for i=#pt-1,1,-1 do
      if pt[i].cz<pt[i+1].cz then
      pt[i],pt[i+1]=
        pt[i+1],pt[i]
      end
    end
    end
    
    rad1 = 5+cos(t()/4)*4

    for p in all(pt) do
      --> screen space
      sx = 64 + p.cx*64/p.cz
      sy = 64 + p.cy*64/p.cz
      rad=rad1/p.cz
      
      if (p.cz > 0.1) then -- clip
      circfill(sx, sy, rad, p.col)
      circfill(sx+rad/3, sy-rad/3,
        rad/3, 7)
      
      end
    end
    
    print([[
    ████▒ pico-8.com ▒████
    ]])
    end
  }
);