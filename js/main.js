// js/main.js
document.addEventListener("DOMContentLoaded", () => {
  const rand = (min, max) => Math.random() * (max - min) + min;

  // ----- ELEMENTS -----
  const catHead   = document.querySelector("#cat_head");
  const backTail  = document.querySelector("#backandtail");
  const frontLegs = document.querySelector("#Front_legs");
  const backLeg1  = document.querySelector("#back_leg1");
  const backLeg2  = document.querySelector("#back_leg_2");
  const poop      = document.querySelector("#poop");
  const smell     = document.querySelector("#poop_smell");

  const litter = [
    ...document.querySelectorAll('#Litter_1 path, #Litter_2 path, #Litter_3 path')
  ];

  // Make sure groups rotate around their middles
  gsap.set([backTail, frontLegs, backLeg1, backLeg2, catHead], { transformOrigin: "50% 50%" });

  // ===== CONFIG KNOBS =====
  const kickDur = 0.55;      // total rhythm
  const KICK_1_MAX = 48;     // back leg 1 max rotation (bigger = more kick)
  const KICK_2_MAX = 54;     // back leg 2 max rotation
  const KICK_BIAS_X = -3;    // slight pull-back on kicks (px)
  const LITTER_ANCHOR = {    // where litter appears (relative to SVG space)
    x: 5,
    y: 1
  };
  const LITTER_JITTER = { x: 4, y: 3 }; // small random spread around anchor
  const LITTER_INTERVAL = 0.18;         // seconds between litter pulses (continuous stream)

  // ===== TAIL + IDLE =====
  gsap.to(backTail, { rotation: 6, duration: 0.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
  gsap.to(catHead,  { y: -0.8, duration: 1.2, yoyo: true, repeat: -1, ease: "sine.inOut" });

  // ===== BIGGER BACK-LEG KICKS =====
  // Stronger arc + tiny pull-back
  gsap.to(backLeg1, {
    rotation: KICK_1_MAX,
    x: KICK_BIAS_X,
    duration: kickDur * 0.45,
    yoyo: true,
    repeat: -1,
    ease: "power2.inOut",
    transformOrigin: "15% 50%"
  });

  gsap.to(backLeg2, {
    rotation: KICK_2_MAX,
    x: KICK_BIAS_X,
    duration: kickDur * 0.45,
    yoyo: true,
    repeat: -1,
    ease: "power2.inOut",
    transformOrigin: "15% 50%",
    delay: 0.1
  });

  // Front legs: tiny motion only
  gsap.to(frontLegs, {
    rotation: -3,
    duration: 0.7,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
    transformOrigin: "60% 50%"
  });

  // ===== LITTER: APPEAR (NO FLYING) =====
  function litterPulse() {
    litter.forEach(p => {
      // prevent overlapping tweens so pulses stay smooth
      gsap.killTweensOf(p);

      // teleport each piece near the hind legs with small jitter, then fade/scale in place
      const x = LITTER_ANCHOR.x + rand(-LITTER_JITTER.x, LITTER_JITTER.x);
      const y = LITTER_ANCHOR.y + rand(-LITTER_JITTER.y, LITTER_JITTER.y);

      gsap.set(p, { x, y, opacity: 0, scale: 0.6, rotation: 0 });

      gsap.timeline()
        .to(p, {
          opacity: 1,
          scale: rand(0.95, 1.2),
          duration: 0.14,
          ease: "power1.out"
        })
        .to(p, {
          // hold briefly, barely wiggle (so it feels alive but doesn't move away)
          rotation: rand(-6, 6),
          duration: 0.35, // slightly longer so the stream feels fuller
          ease: "sine.inOut"
        })
        .to(p, {
          opacity: 0,
          scale: 0.8,
          duration: 0.28,
          ease: "power1.in"
        });
    });
  }

  // ===== CONTINUOUS LITTER LOOP =====
  function startLitterLoop() {
    function loop() {
      litterPulse();
      gsap.delayedCall(LITTER_INTERVAL, loop);
    }
    loop();
  }
  startLitterLoop();

  // ===== POOP POP-IN + SMELL =====
  gsap.set(poop, { scale: 0.6, opacity: 0, y: 8, transformOrigin: "50% 100%" });
  gsap.to(poop, { scale: 1, opacity: 1, y: 0, duration: 0.6, delay: 1.1, ease: "back.out(1.7)" });

  const smellPaths = [...smell.querySelectorAll("path")];
  smellPaths.forEach((w, i) => {
    const d = 2 + Math.random() * 0.6;
    const delay = i * 0.35;
    const float = () => {
      gsap.fromTo(w, { opacity: 0, y: 8 }, {
        opacity: 1, y: -24, duration: d, delay, ease: "sine.inOut",
        onComplete: () => gsap.to(w, {
          opacity: 0, y: -36, duration: 0.8, ease: "power1.in", onComplete: float
        })
      });
    };
    float();
  });

  // ===== MEOW POP-UP =====
const meow = document.querySelector("#meow");

if (meow) {
  gsap.set(meow, {
    scale: 0,
    opacity: 0,
    transformBox: "fill-box",
    transformOrigin: "50% 50%"
  });

  // Pop it in after the poop appears
  gsap.to(meow, {
    scale: 1.2,
    opacity: 1,
    duration: 0.5,
    delay: 1.4,
    ease: "back.out(1.7)",
    onComplete: () => {
      // gentle float / pulse loop so it stays visible but alive
      gsap.to(meow, {
        y: -2,
        scale: 1,
        duration: 1.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
    }
  });
}


  // Pause animation when tab is hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) gsap.globalTimeline.pause();
    else gsap.globalTimeline.resume();
  });
});

