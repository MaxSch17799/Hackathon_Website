(() => {
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
