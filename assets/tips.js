(() => {
  const accItems = document.querySelectorAll(".acc-item");
  accItems.forEach((item) => {
    const header = item.querySelector(".acc-header");
    if (!header) return;
    header.addEventListener("click", () => {
      item.classList.toggle("open");
    });
  });

  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy") || "";
      try {
        await navigator.clipboard.writeText(text);
        const original = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = original), 1200);
      } catch {
        alert("Copy failed. You can manually copy the text.");
      }
    });
  });
})();
