interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  spin: number;
  size: number;
  color: string;
  round: boolean;
  life: number;
}

export interface ConfettiEngine {
  burst: (x: number, y: number, count?: number) => void;
  rain: (count?: number) => void;
  destroy: () => void;
}

const colors = [
  "#7c3aed",
  "#ffc83d",
  "#43d9a0",
  "#6cc7ff",
  "#ff7a59",
  "#ff9fcf",
];

const pick = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)];

export function createConfetti(canvas: HTMLCanvasElement): ConfettiEngine {
  const context = canvas.getContext("2d");
  let particles: Particle[] = [];
  let frame = 0;

  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    context?.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const tick = () => {
    if (!context) return;
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles = particles.filter(
      (particle) => particle.life > 0 && particle.y < window.innerHeight + 40,
    );

    for (const particle of particles) {
      particle.vy += 0.28;
      particle.vx *= 0.985;
      particle.vy *= 0.985;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.rotation += particle.spin;
      particle.life -= 1;

      context.save();
      context.globalAlpha = Math.min(1, particle.life / 30);
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);
      // Squashing the y axis makes paper flutter as it spins.
      context.scale(1, Math.cos(particle.rotation * 2));
      context.fillStyle = particle.color;
      if (particle.round) {
        context.beginPath();
        context.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
        context.fill();
      } else {
        context.fillRect(
          -particle.size / 2,
          -particle.size / 4,
          particle.size,
          particle.size / 2,
        );
      }
      context.restore();
    }

    frame = particles.length ? requestAnimationFrame(tick) : 0;
  };

  const start = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const create = (particle: Partial<Particle>): Particle => ({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.4,
    size: 7 + Math.random() * 7,
    color: pick(colors),
    round: Math.random() < 0.3,
    life: 160 + Math.random() * 60,
    ...particle,
  });

  resize();
  window.addEventListener("resize", resize);

  return {
    burst(x, y, count = 70) {
      for (let index = 0; index < count; index++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 9;
        particles.push(
          create({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 5,
          }),
        );
      }
      start();
    },
    rain(count = 220) {
      for (let index = 0; index < count; index++) {
        particles.push(
          create({
            x: Math.random() * window.innerWidth,
            y: -20 - Math.random() * window.innerHeight * 0.6,
            vx: (Math.random() - 0.5) * 2,
            vy: 2 + Math.random() * 3,
            life: 320,
          }),
        );
      }
      start();
    },
    destroy() {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    },
  };
}
