(() => {
  const accItems = document.querySelectorAll(".acc-item");
  accItems.forEach((item) => {
    const header = item.querySelector(".acc-header");
    if (!header) return;
    header.addEventListener("click", () => {
      item.classList.toggle("open");
    });
  });

  const workflowToggle = document.getElementById("workflowToggle");
  if (workflowToggle) {
    const items = Array.from(document.querySelectorAll(".acc-item"));
    const updateLabel = (allOpen) => {
      workflowToggle.textContent = allOpen
        ? "Workflow (click to collapse)"
        : "Workflow (click to expand)";
    };
    const toggleAll = () => {
      const allOpen = items.every((item) => item.classList.contains("open"));
      items.forEach((item) => item.classList.toggle("open", !allOpen));
      updateLabel(!allOpen);
    };

    updateLabel(items.every((item) => item.classList.contains("open")));
    workflowToggle.addEventListener("click", toggleAll);
    workflowToggle.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleAll();
      }
    });
  }

  document.querySelectorAll("[data-copy]").forEach((btn) => {
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
