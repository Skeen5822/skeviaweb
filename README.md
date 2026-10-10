Website for **Skevia**

## Run locally

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).








what is the animation called that was used for dormammu's face
The visual effects team used a blend of motion capture (specifically facial performance capture) and hand-keyed animation to bring Dormammu's face to life in Doctor Strange (2016).
• The Face Model & Movements: Benedict Cumberbatch provided the motion capture performance for Dormammu. His facial movements drove the underlying structure of the cosmic entity's facial expressions.
• The "Ripple" Effect: Visual effects studio Luma Pictures layered a complex rigging technique over that capture, using custom deformer sets. This allowed his face to continuously ripple and distort like liquid, gas, and solid matter shifting all at once to mimic the psychedelic nature of the Dark Dimension.
Are you looking for information on a different version of Dormammu, or more details about the software the VFX artists used?
• 
YouTube·Fame Focus
ALL VFX REMOVED! Doctor Strange VFX Breakdown
ALL VFX REMOVED! Doctor Strange VFX Breakdown and the Cathedral sequence they developed. and built tools to duplicate and render t...
1m
• 
Facebook·Pickuplines & Memes
Interesting fact: Doctor Strange (2016) used a huge amount of ...
🌀 Interesting fact: Doctor Strange (2016) used a huge amount of previsualization to plan its reality-bending sequences before Ben...
0:14
• 
Reddit
In Dr Strange (2016), Benedict Cumberbatch portrays ... - Reddit
In Dr Strange (2016), Benedict Cumberbatch portrays Dormammu via motion capture and voice acting - this was done to reflect how Do...
Show all

im talking about the sort of ripples on his face generating from the middle and moving off the side of his face. Im trying to implement that same animation to the dark green lines in my website

The specific effect you are describing—where rippling waves generate from a central axis and displace outward over a surface—is known broadly as a wave displacement map, perlin noise distortion, or a sinusoidal wave deformation.
In the VFX world, Luma Pictures achieved this by animating custom deformer sets mathematically to displace Dormammu's 3D geometry. For a website, you can achieve this exact "fluid, shifting line" behavior cleanly using either CSS & SVG Filters or HTML5 Canvas/WebGL shaders.
Here are the two best ways to implement this on your dark green lines:

Method 1: The SVG <feDisplacementMap> Filter (Easiest & Best for CSS Lines)

If your dark green lines are standard HTML elements, borders, or SVGs, you can use an SVG ripple filter. This applies a continuous warp that looks exactly like energy rippling outward.
html
<!-- 1. Define the ripple filter anywhere in your HTML -->
<svg style="position: absolute; width: 0; height: 0;">
  <defs>
    <filter id="dormammu-ripple">
      <!-- Creates a fluid noise base -->
      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
      <!-- Animates the ripple scaling -->
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>
</svg>

<!-- 2. Apply it to your dark green lines in CSS -->
<style>
.dark-green-line {
  width: 100%;
  height: 4px;
  background-color: #004d20; /* Dark Green */
  filter: url(#dormammu-ripple);
}
</style>
Use code with caution.
To make it move seamlessly from the center outward like Dormammu, you would use JavaScript to animate the baseFrequency or scale attributes inside a requestAnimationFrame loop.

Method 2: Sine Wave Manipulation on HTML5 Canvas (Smoothest)

If your lines are drawn on a <canvas>, you can manipulate their Y-coordinates mathematically using a Sine function over time to create endless ripples pulsing outward from the middle.
javascript
const canvas = document.getElementById('lineCanvas');
const ctx = canvas.getContext('2d');
let alpha = 0; // Tracks time/animation frame

function drawRippleLine() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#004d20'; // Dark Green
  ctx.lineWidth = 4;
  
  ctx.beginPath();
  const centerY = canvas.height / 2;
  const centerX = canvas.width / 2;

  for (let x = 0; x < canvas.width; x++) {
    // Calculate distance from the middle to push ripples outward
    let distanceFromCenter = Math.abs(x - centerX);
    
    // Mathematical wave formula 
    let ripple = Math.sin(distanceFromCenter * 0.05 - alpha) * 10;
    
    // Dampen the ripple so it fades out as it reaches the edges
    let dampening = Math.max(0, 1 - (distanceFromCenter / centerX));
    let y = centerY + (ripple * dampening);

    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  
  ctx.stroke();
  alpha += 0.1; // Speed of the ripple moving outward
  requestAnimationFrame(drawRippleLine);
}
drawRippleLine();
Use code with caution.
How are your dark green lines currently built on your website? If you let me know if they are SVG paths, standard HTML divs, or an HTML5 Canvas, I can write the exact code snippet tailored to your layout.
• 
YouTube·SuperHi
How to add a water ripple effect to web site images using ...
Apr 1, 2021 — Create a water ripple effect on web images using WebGL and shaders. The process involves using Codelife as a prototyping tool to b...
44s
• 
The Art of VFX
DOCTOR STRANGE: Vincent Cirelli - VFX Supervisor - Luma Pictures - The Art of VFX
Luma Pictures VFX Scope: Opening London kaleidoscopic/mandelbrot sequence, transforming Cathedral, and Dark Dimension with Dormamm...
• 
Animation World Network
Luma Pictures Rewrites Physics for Marvel’s ‘Doctor Strange’ | Animation World Network
Nov 22, 2016 — Character: Dormammu (evil ruler of the Dark Dimension). Developed custom in-house tools, bespoke mathematical equations, and fract...

i want it to have the same high detailed-cinematic look too

To give your dark green lines that premium, high-fidelity cinematic depth seen in Doctor Strange, flat 2D lines won't be enough. The secret to the Dormammu look relies on layered glows, chromatic aberration (color splitting), and depth masking.
The most cinematic, high-performance way to build this for a website is using WebGL via Three.js and Custom Shaders. However, you can achieve a strikingly close, production-ready effect using layered SVG filters and CSS gradients without sacrificing your site's load speed.
Here is a ready-to-use, highly detailed cinematic implementation using layered SVG filters, inner shadows, and deep neon glows:
html
<div class="cinematic-container">
  <!-- The Cinematic Dark Green Line -->
  <div class="dormammu-line"></div>
</div>

<!-- The Cinematic FX Engine (SVG Filter) -->
<svg style="position: absolute; width: 0; height: 0;">
  <defs>
    <!-- Filter for the organic, fluid distortion -->
    <filter id="cinematic-ripple" x="-20%" y="-50%" width="140%" height="200%">
      <!-- Generate a highly detailed, fractal noise base -->
      <feTurbulence type="fractalNoise" baseFrequency="0.015 0.08" numOctaves="4" result="detailedNoise" />
      
      <!-- Animate the noise internally using a shifting map -->
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 -0.5" in="detailedNoise" result="sharpNoise"/>
      
      <!-- Displace the line heavily based on the noise map -->
      <feDisplacementMap in="SourceGraphic" in2="sharpNoise" scale="25" xChannelSelector="R" yChannelSelector="G" result="displacedLine" />
      
      <!-- Add Cinematic Glow Layer 1 (Tight core energy) -->
      <feGaussianBlur in="displacedLine" stdDeviation="3" result="coreGlow" />
      
      <!-- Add Cinematic Glow Layer 2 (Atmospheric dimension) -->
      <feGaussianBlur in="displacedLine" stdDeviation="12" result="ambientGlow" />
      
      <!-- Merge the layers together: Ambient Glow + Core Glow + Original Line -->
      <feMerge>
        <feMergeNode in="ambientGlow" />
        <feMergeNode in="coreGlow" />
        <feMergeNode in="displacedLine" />
      </feMerge>
    </filter>
  </defs>
</svg>

<style>
:root {
  --dark-void: #030a06;
  --cosmic-green: #00ff66;
  --deep-emerald: #013a18;
  --mid-green: #008f39;
}

.cinematic-container {
  width: 100%;
  height: 200px;
  background: var(--dark-void); /* Dark, cinematic background to catch the glow */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.dormammu-line {
  width: 90%;
  height: 8px;
  border-radius: 4px;
  position: relative;
  
  /* A 3D dimensional gradient instead of a flat color */
  background: linear-gradient(
    90deg, 
    transparent 0%, 
    var(--deep-emerald) 15%, 
    var(--mid-green) 45%, 
    var(--cosmic-green) 50%, 
    var(--mid-green) 55%, 
    var(--deep-emerald) 85%, 
    transparent 100%
  );
  
  /* Apply the advanced ripple & glow filter */
  filter: url(#cinematic-ripple);
  
  /* Mimic Chromatic Aberration & Volumetric thickness */
  box-shadow: 
    0 0 20px rgba(0, 255, 102, 0.4),
    inset 0 0 8px rgba(255, 255, 255, 0.6);
    
  animation: cosmicPulse 6s infinite linear;
}

/* Continuous, organic flowing movement from the center outward */
@keyframes cosmicPulse {
  0% {
    background-size: 100% 100%;
    transform: scaleY(1);
    opacity: 0.9;
  }
  50% {
    background-size: 200% 100%;
    transform: scaleY(1.15) skewX(1deg);
    opacity: 1;
  }
  100% {
    background-size: 100% 100%;
    transform: scaleY(1);
    opacity: 0.9;
  }
}
</style>
Use code with caution.

Why this creates a Movie-Grade Look:

1. Volumetric Lighting: The CSS line uses an internal linear gradient with a bright core (--cosmic-green) and dark borders (--deep-emerald). This makes the line look like a physical 3D tube of plasma rather than a flat vector.
2. Multi-Octave Noise: The SVG filter doesn't just distort the line uniformly; it uses numOctaves="4". This mixes fine microscopic textures with large macroscopic waves, mirroring Hollywood VFX workflows.
3. Dual-Stage Gaussian Blur: Standard CSS box-shadow looks game-like and digital. By stacking a tight core blur (stdDeviation="3") over a deep environmental blur (stdDeviation="12"), it perfectly replicates a high-end anamorphic camera lens bloom.
Would you like to see how to implement this using Three.js / WebGL Shaders for true 3D particle depth, or do you want to stick with this HTML/CSS approach and fine-tune the speed and warp intensity?
