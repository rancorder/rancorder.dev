// ============================
// Canvas Particle System
// ============================
(function () {
  const canvas = document.createElement("canvas");
  canvas.id = "bg-canvas";
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  let width = window.innerWidth;
  let height = window.innerHeight;
  let particles = [];
  const PARTICLE_COUNT = Math.min(140, Math.floor((width * height) / 12000));

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  window.addEventListener("resize", resize);
  resize();

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 1.2 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.8 + 0.6,
        hue: 180 + Math.random() * 120,
        alpha: 0.25 + Math.random() * 0.5,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    for (const p of particles) {
      p.x += p.vx * p.z;
      p.y += p.vy * p.z;

      if (p.x < -50) p.x = width + 50;
      if (p.x > width + 50) p.x = -50;
      if (p.y < -50) p.y = height + 50;
      if (p.y > height + 50) p.y = -50;

      const grad = ctx.createRadialGradient(
        p.x,
        p.y,
        0,
        p.x,
        p.y,
        p.radius * 6
      );
      grad.addColorStop(0, `hsla(${p.hue}, 90%, 70%, ${p.alpha})`);
      grad.addColorStop(1, "transparent");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * p.z, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  createParticles();
  draw();
})();

// ============================
// Scroll Fade-in
// ============================
(function () {
  const sections = document.querySelectorAll(".fade-section");
  if (!("IntersectionObserver" in window) || sections.length === 0) {
    sections.forEach((s) => s.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
})();
