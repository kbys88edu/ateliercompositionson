/* ACS — 「光の網目」の窓。サイト背景 acs-quiet-lake.js の網目を、リールと同じスペクトル配色・分光・
   データモッシュで描く。ホームでは大見出しの背後を白くし、ポートレートを網点で重ねる。下層ページでは帯だけ。 */
(function () {
  var field = document.getElementById("field");
  if (!field) return;
  var cv = document.getElementById("lake");
  var mast = field.querySelector(".mast");
  var portrait = document.getElementById("portrait");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 大見出し：「Composition」の実際の幅を測り、窓の幅にぴったり合わせる
  function fitMast() {
    if (!mast) return;
    var line = mast.children[1]; mast.style.fontSize = "100px";
    var rg = document.createRange(); rg.selectNodeContents(line);
    var w = rg.getBoundingClientRect().width;
    if (w > 0) mast.style.fontSize = Math.min(232, 100 * mast.clientWidth / w * 0.985) + "px";
  }
  fitMast();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitMast);
  window.addEventListener("resize", fitMast);

  function fallback() { if (cv) cv.remove(); field.classList.add("nogl"); }
  var gl = cv && cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
  var hp = gl && gl.getShaderPrecisionFormat && gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
  if (!gl || !hp || hp.precision === 0) return fallback();

  var fs = [
    "precision highp float;",
    "uniform vec2 r;uniform float t;uniform float burst;uniform float frame;uniform float px;uniform float veil;",
    "uniform sampler2D ph;uniform vec4 rect;uniform vec4 uvm;uniform float hasPh;",
    "const float TAU=6.28318530718;",
    "float caustic(vec2 uv,float time){",
    "  vec2 p=mod(uv*TAU,TAU)-250.;vec2 i=p;float c=1.;float inten=.005;",
    "  for(int n=0;n<5;n++){float tt=time*(1.-(3.5/float(n+1)));",
    "    i=p+vec2(cos(tt-i.x)+sin(tt+i.y),sin(tt-i.y)+cos(tt+i.x));",
    "    c+=1./length(vec2(p.x/(sin(i.x+tt)/inten),p.y/(cos(i.y+tt)/inten)));}",
    "  c/=5.;c=1.17-pow(c,1.4);return clamp(pow(abs(c),8.),0.,1.);}",
    "float h(vec3 q){return fract(sin(dot(q,vec3(12.9898,78.233,37.719)))*43758.5453);}",
    "vec3 pal(float u){u=clamp(u,0.,1.);",
    "  vec3 c0=vec3(1.,1.,1.),c1=vec3(.98,.886,.235),c2=vec3(1.,.541,.11),c3=vec3(.941,.157,.196),",
    "       c4=vec3(.98,.392,.843),c5=vec3(.149,.259,.961),c6=vec3(.471,.839,.925);",
    "  if(u<.10)return mix(c0,c1,u/.10);if(u<.26)return mix(c1,c2,(u-.10)/.16);if(u<.40)return mix(c2,c3,(u-.26)/.14);",
    "  if(u<.54)return mix(c3,c4,(u-.40)/.14);if(u<.68)return mix(c4,c5,(u-.54)/.14);if(u<.80)return mix(c5,c6,(u-.68)/.12);",
    "  if(u<.92)return mix(c6,c0,(u-.80)/.12);return c0;}",
    "void main(){vec2 fc=gl_FragCoord.xy;",
    "  vec2 cell=floor(fc/(128.*px));float k=h(vec3(cell,frame));",
    "  float s=(k<.2?8.:k<.4?16.:k<.6?32.:k<.8?64.:128.)*px;vec2 b=floor(fc/s)*s;",
    "  if(h(vec3(b,frame+1.))<burst*.8){float m=h(vec3(b,frame+2.));",
    "    if(m<.34)fc+=(vec2(h(vec3(b,frame+3.)),h(vec3(b,frame+4.)))-.5)*vec2(260.,140.)*px;",
    "    else if(m<.67)fc=b+s*.5;else fc.x=b.x;}",
    "  vec2 uv=fc/(px*1000.)*.9;float tm=t*.2;",
    "  uv+=.12*vec2(sin(uv.y*1.7+tm*1.3)+.5*sin(uv.y*3.1-tm),cos(uv.x*1.5-tm*1.1)+.5*cos(uv.x*2.7+tm*.8));",
    "  float time=tm*1.6+23.;float d=.05;",
    "  float cr=caustic(uv+vec2(d,-d*.6),time),cg=caustic(uv,time),cb=caustic(uv-vec2(d,-d*.6),time);",
    "  vec3 col=pal(.88*smoothstep(.16,.78,cg))+vec3(clamp(cr-cg,-.35,.35),0.,clamp(cb-cg,-.35,.35))*.55;",
    "  float lum=dot(col,vec3(.3333));",
    "  vec3 film=pal(.12+.8*fract(lum*1.6+fc.y/r.y*.5+fc.x/r.x*.35+.06*t));",
    "  col=mix(col,film,.2*(.35+.65*lum));",
    "  vec2 q=vec2(fc.x/r.x,1.-fc.y/r.y);",
    "  col=mix(col,vec3(1.),veil*.62*(1.-smoothstep(.46,.74,q.y)));",
    "  if(hasPh>.5&&q.x>=rect.x&&q.x<=rect.z&&q.y>=rect.y&&q.y<=rect.w){",
    "    vec2 l=(q-rect.xy)/(rect.zw-rect.xy);float g=dot(texture2D(ph,uvm.xy+l*uvm.zw).rgb,vec3(.299,.587,.114));",
    "    g=smoothstep(.04,.96,g);float per=5.*px;vec2 ro=vec2(fc.x+fc.y,fc.x-fc.y)*.70710678;",
    "    float dd=length(mod(ro,per)-per*.5);float rr=per*.62*sqrt(1.-g);float dt=clamp((rr-dd)/(.9*px)+.5,0.,1.);",
    "    col*=g*.6+(1.-dt)*.4;}",
    "  gl_FragColor=vec4(clamp(col,0.,1.),1.);}"
  ].join("\n");
  var vs = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
  function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; }
  var v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return fallback();
  var pg = gl.createProgram(); gl.attachShader(pg, v); gl.attachShader(pg, f); gl.linkProgram(pg);
  if (!gl.getProgramParameter(pg, gl.LINK_STATUS)) return fallback();
  gl.useProgram(pg);
  var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(pg, "a"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var U = {}; ["r", "t", "burst", "frame", "px", "veil", "ph", "rect", "uvm", "hasPh"].forEach(function (n) { U[n] = gl.getUniformLocation(pg, n); });
  gl.uniform1f(U.hasPh, 0);
  gl.uniform1f(U.veil, mast ? 1 : 0);

  var PA = 646 / 1434;
  if (portrait) {
    var img = new Image();
    img.onload = function () {
      var tx = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tx);
      try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img); }
      catch (e) { field.classList.add("photo-css"); return; }   // file:// などで読めないときは CSS で重ねる
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(U.ph, 0); gl.uniform1f(U.hasPh, 1); draw(performance.now());
    };
    img.src = portrait.src;
  }
  function placePhoto(w, hgt) {
    if (!portrait) return;
    var narrow = field.clientWidth < 700;
    var R = narrow ? [0.40, 0.44, 1, 1] : [0.56, 0.30, 1, 1];
    var ar = (R[2] - R[0]) * w / ((R[3] - R[1]) * hgt), sx = 1, sy = 1, ox = 0, oy = 0;
    if (ar > PA) { sy = PA / ar; oy = (1 - sy) * 0.18; } else { sx = ar / PA; ox = (1 - sx) * 0.65; }
    gl.uniform4f(U.rect, R[0], R[1], R[2], R[3]); gl.uniform4f(U.uvm, ox, oy, sx, sy);
  }

  var scale = 0.6 * Math.min(window.devicePixelRatio || 1, 2);
  function size() {
    var w = Math.max(2, Math.round(field.clientWidth * scale)), hgt = Math.max(2, Math.round(field.clientHeight * scale));
    if (cv.width !== w || cv.height !== hgt) { cv.width = w; cv.height = hgt; gl.viewport(0, 0, w, hgt); }
    gl.uniform2f(U.r, w, hgt); gl.uniform1f(U.px, scale); placePhoto(w, hgt);
  }
  // 崩れの強さ：6 秒ごとに小さく、タップで大きく
  var tap = 0, t0 = performance.now();
  function g(x, c, w) { return Math.exp(-Math.pow((x - c) / w, 2)); }
  function burstAt(sec) { return Math.max(0.04 + 0.45 * g(sec % 6, 3.0, 0.22), tap); }
  function draw(ms) {
    var sec = (ms - t0) / 1000;
    size(); gl.uniform1f(U.t, sec + 4.0); gl.uniform1f(U.burst, burstAt(sec)); gl.uniform1f(U.frame, Math.floor(sec * 30));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    tap *= 0.9;
  }
  var visible = true, running = false;
  function loop(ms) { if (!visible) { running = false; return; } draw(ms); requestAnimationFrame(loop); }
  function start() { if (!running && !reduce) { running = true; requestAnimationFrame(loop); } }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) start(); }).observe(field);
  }
  field.addEventListener("pointerdown", function () { tap = 1; if (reduce) draw(performance.now()); });
  window.addEventListener("resize", function () { draw(performance.now()); });
  if (reduce) draw(t0); else start();
})();
