(() => {
  const musicEnabled = document.body?.dataset.music === "on";
  const audio = document.getElementById("bgMusic");
  const intro = document.getElementById("introOverlay");
  const introButton = document.getElementById("introEnter");
  const introEnvelope = document.querySelector(".intro-envelope");
  const introSeenKey = "introSeen_v1";
  const musicTimeKey = "bgMusicTime_v1";

  const startIntroAnimation = () => {
    if (!introEnvelope) return;
    const scene = document.querySelector(".intro-scene");
    if (!scene) return;
    const duration = 2400;
    const fadeIn = 0.08;
    const fadeOut = 0.08;
    let progress = 0;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min(now - last, 100);
      last = now;

      introEnvelope.style.offsetDistance = `${progress * 100}%`;

      const envRect = introEnvelope.getBoundingClientRect();
      const sceneRect = scene.getBoundingClientRect();
      const available = Math.max(sceneRect.height - envRect.height, 1);
      const yNorm = Math.min(
        Math.max((envRect.top - sceneRect.top) / available, 0),
        1
      );

      // Slower at the top (low y), faster at the bottom (high y).
      const speedFactor = 0.35 + 0.65 * yNorm;
      progress += (dt / duration) * speedFactor;
      if (progress >= 1) {
        progress -= 1;
      }

      let opacity = 1;
      if (progress < fadeIn) {
        opacity = progress / fadeIn;
      } else if (progress > 1 - fadeOut) {
        opacity = (1 - progress) / fadeOut;
      }
      introEnvelope.style.opacity = String(opacity);

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  startIntroAnimation();

  if (musicEnabled && audio) {
    const showIntro = intro && !sessionStorage.getItem(introSeenKey);
    const tryPlay = async () => {
      try {
        await audio.play();
      } catch {
        // Autoplay can be blocked; we'll retry on first user gesture.
      }
    };

    const restoreTime = () => {
      const saved = Number(sessionStorage.getItem(musicTimeKey));
      if (Number.isFinite(saved) && saved > 0) {
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
          audio.currentTime = Math.min(saved, Math.max(audio.duration - 0.5, 0));
        } else {
          audio.currentTime = saved;
        }
      }
    };

    const saveTime = () => {
      if (!Number.isFinite(audio.currentTime)) return;
      sessionStorage.setItem(musicTimeKey, String(audio.currentTime));
    };

    const handleLoaded = () => {
      if (showIntro) {
        audio.currentTime = 0;
      } else {
        restoreTime();
        tryPlay();
      }
    };
    audio.addEventListener("loadedmetadata", handleLoaded, { once: true });
    if (audio.readyState >= 1) {
      handleLoaded();
    }
    window.addEventListener("pagehide", saveTime);
    window.addEventListener("beforeunload", saveTime);

    if (intro) {
      if (showIntro) {
        document.body.classList.add("intro-active");
      } else {
        intro.classList.add("hidden");
      }
    }

    const enterSite = async () => {
      if (intro) {
        intro.classList.add("hidden");
      }
      document.body.classList.remove("intro-active");
      sessionStorage.setItem(introSeenKey, "1");
      sessionStorage.setItem(musicTimeKey, "0");
      audio.currentTime = 0;
      await tryPlay();
    };

    if (introButton) {
      introButton.addEventListener("click", enterSite);
    } else if (intro) {
      intro.addEventListener("click", enterSite);
    }

    if (!showIntro) {
      tryPlay();
      window.addEventListener("pointerdown", tryPlay, { once: true });
      window.addEventListener("keydown", tryPlay, { once: true });
    }
  }

  const trailSymbols = ["*", "+", "o", "x", "#", "@"]; 
  document.addEventListener("mousemove", (e) => {
    if (Math.random() < 0.4) return;
    const s = document.createElement("div");
    s.className = "trail";
    s.textContent = trailSymbols[(Math.random() * trailSymbols.length) | 0];
    s.style.left = (e.clientX + (Math.random() * 10 - 5)) + "px";
    s.style.top = (e.clientY + (Math.random() * 10 - 5)) + "px";
    s.style.color = ["#ff2bd6", "#33f6ff", "#fff600", "#39ff14"][
      (Math.random() * 4) | 0
    ];
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 900);
  });

  const navLinks = document.querySelectorAll(".nav-link");
  const currentPath = location.pathname.replace(/\/+$/, "");
  navLinks.forEach((link) => {
    if (link.tagName !== "A") return;
    const linkPath = new URL(link.href).pathname.replace(/\/+$/, "");
    if (linkPath === currentPath) {
      link.classList.add("active");
    }
  });

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
