(() => {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const mark = hero.querySelector(".lockup") || hero;
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const canvas = document.createElement("canvas");
  canvas.className = "ripple";
  canvas.setAttribute("aria-hidden", "true");
  const gl = canvas.getContext("webgl", {
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!gl) return;

  const MAX_PIXELS = 4e6;

  const VERT = `
    attribute vec2 aPos;
    void main() {
      gl_Position = vec4(aPos, 0.0, 1.0);
    }
  `;

  // Redraws the .hero::before/::after stripes (same 101deg gradient stops and
  // masks as styles.css) and runs Dormammu-style ripples outward from uCenter.
  const FRAG = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif

    uniform vec2 uRes;
    uniform float uDpr;
    uniform float uTime;
    uniform float uUnit;
    uniform vec2 uCenter;
    uniform vec4 uLeft;
    uniform vec4 uRight;
    uniform vec2 uOpacity;

    const float TAU = 6.28318;
    const vec2 AXIS = vec2(0.98163, 0.19081);
    const vec3 STRIPE = vec3(0.008, 0.078, 0.008);
    const vec3 GREEN = vec3(0.059, 0.6, 0.055);
    const vec3 HOT = vec3(0.6, 1.0, 0.55);

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 s = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), s.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), s.x),
        s.y
      );
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p = p * 2.03 + vec2(17.1, 9.2);
        a *= 0.5;
      }
      return v;
    }

    float stripes(vec2 p, vec4 f) {
      float len = f.z * AXIS.x + f.w * AXIS.y;
      float t = dot(p - f.xy - 0.5 * f.zw, AXIS) / len + 0.5;
      float d = max(0.08 - t, t - 0.1);
      d = min(d, max(0.22 - t, t - 0.3));
      d = min(d, max(0.41 - t, t - 0.425));
      d = min(d, max(0.58 - t, t - 0.63));
      d = min(d, max(0.74 - t, t - 0.755));
      d = min(d, max(0.86 - t, t - 0.92));
      return d * len;
    }

    vec3 shade(float sd, float lit, float band, float grain) {
      float fill = clamp(0.5 - sd * uDpr, 0.0, 1.0);
      float outside = max(sd, 0.0) / uUnit;
      float rim = exp(-abs(sd) * 0.7);
      float bloom = 0.55 * exp(-outside * 0.22) + 0.45 * exp(-outside * 0.04);
      vec3 c = STRIPE * fill * (0.7 + 0.6 * grain + 0.8 * band);
      c += GREEN * fill * (lit * (0.06 + 0.3 * grain) + band * 0.07);
      c += mix(GREEN, HOT, lit * lit * lit) * rim * (0.06 + 0.6 * lit + 0.2 * band);
      c += GREEN * bloom * (0.015 + 0.12 * lit);
      return c;
    }

    vec3 field(vec2 p, vec2 ca, vec4 f, float lit, float band, float grain) {
      return vec3(
        shade(stripes(p + ca, f), lit, band, grain).r,
        shade(stripes(p, f), lit, band, grain).g,
        shade(stripes(p - ca, f), lit, band, grain).b
      );
    }

    void main() {
      vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
      vec2 opacity = sqrt(uOpacity);
      float fadeL = clamp((uLeft.x + uLeft.z - p.x) / (0.6 * uLeft.z), 0.0, 1.0) * opacity.x;
      float fadeR = clamp((p.x - uRight.x) / (0.5 * uRight.z), 0.0, 1.0) * opacity.y;
      if (fadeL + fadeR <= 0.0) {
        gl_FragColor = vec4(0.0);
        return;
      }

      float t = uTime;
      vec2 q = (p - uCenter) / uUnit;

      float warp = fbm(q * 0.0035 + vec2(t * 0.03, -t * 0.05)) - 0.5;
      float r = length(q * vec2(1.0, 0.6)) + warp * 110.0;
      vec2 dir = normalize(vec2(q.x, q.y * 0.36) + vec2(0.0001, 0.0));

      float k1 = TAU / 260.0;
      float k2 = TAU / 105.0;
      float k3 = TAU / 42.0;
      float p1 = r * k1 - t * 1.7;
      float p2 = r * k2 - t * 3.4 + warp * 3.0;
      float p3 = r * k3 - t * 5.6 + warp * 7.0;
      float swell = smoothstep(0.0, 140.0, abs(q.x)) * (0.75 + 0.25 * sin(r * 0.006 - t * 0.8));
      float h = (10.0 * sin(p1) + 4.0 * sin(p2) + 1.2 * sin(p3)) * swell;
      float slope = (10.0 * k1 * cos(p1) + 4.0 * k2 * cos(p2) + 1.2 * k3 * cos(p3)) * swell;
      float light = slope / 0.66;
      float lit = max(light, 0.0);
      float band = (pow(0.5 + 0.5 * sin(p2), 8.0) + 0.5 * pow(0.5 + 0.5 * sin(p3), 14.0)) * swell;

      vec2 pd = p - dir * h * uUnit;
      vec2 along = vec2(dot(pd, AXIS), dot(pd, vec2(-AXIS.y, AXIS.x))) / uUnit;
      float grain = fbm(along * vec2(0.05, 0.01) + vec2(0.0, t * 0.08));
      vec2 ca = dir * (0.4 + 1.6 * abs(light)) * min(uUnit, 1.5);

      vec3 col = vec3(0.0);
      if (fadeL > 0.0) col += field(pd, ca, uLeft, lit, band, grain) * fadeL;
      if (fadeR > 0.0) col += field(pd, ca, uRight, lit, band, grain) * fadeR;
      col += (hash(gl_FragCoord.xy + fract(t) * 91.0) - 0.5) / 255.0 * step(0.002, col.g);
      col = max(col, 0.0);
      gl_FragColor = vec4(col, max(col.g, max(col.r, col.b)));
    }
  `;

  const UNIFORMS = ["uRes", "uDpr", "uTime", "uUnit", "uCenter", "uLeft", "uRight", "uOpacity"];

  let u = {};
  let raf = 0;
  let visible = false;
  let lost = false;

  function init() {
    const program = gl.createProgram();
    for (const [type, source] of [
      [gl.VERTEX_SHADER, VERT],
      [gl.FRAGMENT_SHADER, FRAG],
    ]) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      gl.attachShader(program, shader);
    }
    gl.bindAttribLocation(program, 0, "aPos");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    u = {};
    for (const name of UNIFORMS) u[name] = gl.getUniformLocation(program, name);
    return true;
  }

  // Opacity comes from --stripe-opacity, not s.opacity: the intro fade-in
  // animates opacity, and this runs while it's still at 0.
  function field(pseudo) {
    const s = getComputedStyle(hero, pseudo);
    const opacity = parseFloat(s.getPropertyValue("--stripe-opacity"));
    return [...[s.left, s.top, s.width, s.height].map(parseFloat), Number.isNaN(opacity) ? 1 : opacity];
  }

  function layout() {
    const box = hero.getBoundingClientRect();
    if (!box.width || !box.height) return;

    const dpr = Math.min(devicePixelRatio || 1, 2, Math.sqrt(MAX_PIXELS / (box.width * box.height)));
    const w = Math.round(box.width * dpr);
    const h = Math.round(box.height * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }

    let cx = mark.offsetWidth / 2;
    let cy = mark.offsetHeight / 2;
    for (let n = mark; n && n !== hero; n = n.offsetParent) {
      cx += n.offsetLeft;
      cy += n.offsetTop;
    }
    const [lx, ly, lw, lh, lo] = field("::before");
    const [rx, ry, rw, rh, ro] = field("::after");
    gl.uniform2f(u.uRes, w, h);
    gl.uniform1f(u.uDpr, w / box.width);
    gl.uniform1f(u.uUnit, Math.max(Math.hypot(box.width, box.height) / 1600, 0.75));
    gl.uniform2f(u.uCenter, cx, cy);
    gl.uniform4f(u.uLeft, lx, ly, lw, lh);
    gl.uniform4f(u.uRight, rx, ry, rw, rh);
    gl.uniform2f(u.uOpacity, lo, ro);
    if (raf) draw(performance.now());
  }

  function draw(now) {
    gl.uniform1f(u.uTime, now / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    draw(now);
    hero.classList.add("rippling");
  }

  function update() {
    const on = !still.matches && !lost;
    if (!on) hero.classList.remove("rippling");
    if (on && visible) {
      if (!raf) raf = requestAnimationFrame(frame);
    } else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }

  if (!init()) return;
  hero.prepend(canvas);
  layout();

  const resize = new ResizeObserver(layout);
  resize.observe(hero);
  resize.observe(mark);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    update();
  }).observe(hero);
  still.addEventListener("change", update);

  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    lost = true;
    update();
  });
  canvas.addEventListener("webglcontextrestored", () => {
    lost = !init();
    layout();
    update();
  });
})();
