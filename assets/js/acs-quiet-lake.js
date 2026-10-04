/* 固定背景：水面の光の網目（コースティクス）。モノクロ・高コントラスト。WebGL非対応なら黒地のみ。 */
(function () {
  var cv = document.querySelector(".qlake");
  if (!cv) {
    cv = document.createElement("canvas");
    cv.className = "qlake";
    cv.setAttribute("aria-hidden", "true");
    document.body.insertBefore(cv, document.body.firstChild);
  }
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
  if (!gl) return;
  // 光の網目の計算には高精度の浮動小数点が必要。使えない端末（古いAndroidなど）では、
  // 模様がブロック状に崩れるため、描画せず白地のままにする。
  var hp = gl.getShaderPrecisionFormat && gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
  if (!hp || hp.precision === 0) return;

  var vs = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
  var fs = [
    "precision highp float;",
    "uniform vec2 r;uniform float t;",
    "const float TAU=6.28318530718;",
    "float caustic(vec2 uv,float time){",
    "  vec2 p=mod(uv*TAU,TAU)-250.;vec2 i=p;float c=1.;float inten=.005;",
    "  for(int n=0;n<5;n++){",
    "    float tt=time*(1.-(3.5/float(n+1)));",
    "    i=p+vec2(cos(tt-i.x)+sin(tt+i.y),sin(tt-i.y)+cos(tt+i.x));",
    "    c+=1./length(vec2(p.x/(sin(i.x+tt)/inten),p.y/(cos(i.y+tt)/inten)));",
    "  }",
    "  c/=5.;c=1.17-pow(c,1.4);",
    "  return pow(abs(c),8.);",
    "}",
    "float shade(float c){",
    "  c=clamp(c,0.,1.);",
    "  float band=smoothstep(.02,.10,c)*(1.-smoothstep(.10,.34,c));",   // 光の筋の縁にできる、ごく淡い影
    "  float core=smoothstep(.20,.62,c);",                              // 光の芯（白）
    "  return mix(.985-.09*band,1.,core);",                             // 地は白に近く、縁だけ淡い灰色、芯は白（ノイズ成分は控えめ）
    "}",
    "void main(){",
    "  vec2 q=gl_FragCoord.xy/r;",
    "  float tm=t*.07;",                                       // ゆっくり、たゆたう
    "  vec2 uv=gl_FragCoord.xy/r.y*.50;",                      // 網目をさらに大きく
    "  uv+=.30*vec2(sin(uv.y*1.7+tm*1.3)+.5*sin(uv.y*3.1-tm),cos(uv.x*1.5-tm*1.1)+.5*cos(uv.x*2.7+tm*.8));", // 大きな揺れ
    "  float patch=smoothstep(.52,.88,.5+.5*sin(q.x*5.2+tm*.8+1.3)*sin(q.y*4.2-tm*.6)+.18*sin(q.x*2.3-q.y*3.1+tm*.5));",  // 虹色が出る場所：画面に常に数か所あり、ゆっくり移ろう
    "  float d=.032*patch;",                                   // 色ごとのずれ（分光）＝虹色のにじみの距離
    "  float time=tm*1.6+23.;",
    "  float cr=caustic(uv+vec2(d,-d*.6),time);",
    "  float cg=caustic(uv,time);",
    "  float cb=caustic(uv-vec2(d,-d*.6),time);",
    "  vec3 raw=vec3(shade(cr),shade(cg),shade(cb));",
    "  vec3 chroma=raw-raw.g;",                                 // 色ごとのずれだけを取り出す（虹色の元）
    "  vec3 col=vec3(raw.g);",
    "  col=mix(col,col*col*(3.-2.*col),.12);",                 // 全体のコントラストをやや強める（S字カーブ）
    "  col+=chroma*patch*1.0;",                                  // 場所によって虹色を足す
    "  col*=.95+.05*q.y;",                                     // 上から差す光
    "  col*=1.-.10*pow(length(q-.5)*1.25,2.);",                // 周辺をわずかに沈める
    "  gl_FragColor=vec4(clamp(col,0.,1.),1.);",
    "}"
  ].join("\n");

  function sh(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  }
  var v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return;
  var pg = gl.createProgram();
  gl.attachShader(pg, v); gl.attachShader(pg, f); gl.linkProgram(pg);
  if (!gl.getProgramParameter(pg, gl.LINK_STATUS)) return;
  gl.useProgram(pg);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(pg, "a");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var ur = gl.getUniformLocation(pg, "r"), ut = gl.getUniformLocation(pg, "t");

  var scale = 0.6; // 描画解像度を下げて軽くする
  function size() {
    var w = Math.max(2, Math.round(window.innerWidth * scale)), h = Math.max(2, Math.round(window.innerHeight * scale));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); }
    gl.uniform2f(ur, w, h);
  }
  function draw(ms) { size(); gl.uniform1f(ut, ms * 0.001); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); }

  window.addEventListener("resize", function () { draw(performance.now()); });
  if (reduce) { draw(4000); return; }
  (function loop(ms) { draw(ms); window.requestAnimationFrame(loop); })(performance.now());
})();
