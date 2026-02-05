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

  const goal = document.getElementById("pb-goal");
  const context = document.getElementById("pb-context");
  const constraints = document.getElementById("pb-constraints");
  const output = document.getElementById("pb-output");
  const result = document.getElementById("pb-result");
  const copyResult = document.getElementById("pb-copy");

  function buildPrompt() {
    const lines = [];
    if (goal && goal.value.trim()) lines.push(`Goal: ${goal.value.trim()}`);
    if (context && context.value.trim()) lines.push(`Context: ${context.value.trim()}`);
    if (constraints && constraints.value.trim()) lines.push(`Constraints: ${constraints.value.trim()}`);
    if (output && output.value.trim()) lines.push(`Output format: ${output.value.trim()}`);
    result.textContent = lines.join("\n");
  }

  [goal, context, constraints, output].forEach((el) => {
    if (el) el.addEventListener("input", buildPrompt);
  });
  buildPrompt();

  if (copyResult) {
    copyResult.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(result.textContent);
        const original = copyResult.textContent;
        copyResult.textContent = "Copied!";
        setTimeout(() => (copyResult.textContent = original), 1200);
      } catch {
        alert("Copy failed. You can manually copy the prompt.");
      }
    });
  }
})();
