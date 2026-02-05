(() => {
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
    const linkPath = new URL(link.href).pathname.replace(/\/+$/, "");
    if (linkPath === currentPath) {
      link.classList.add("active");
    }
  });

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
