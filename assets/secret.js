(() => {
  const gifFiles = [
    "195f06fd7941802cd1f5307dd3697186.gif",
    "200 (1).gif",
    "200.gif",
    "200w (1).gif",
    "200w (2).gif",
    "200w (3).gif",
    "200w (4).gif",
    "200w.gif",
    "cat-smile.gif",
    "cool-fun.gif",
    "da4a3de40fb6636a14cc6816e2b63471.gif",
    "f77cfc736e0d32df1b686898c4d4e04c.gif",
    "giphy (1).gif",
    "giphy (2).gif",
    "giphy (3).gif",
    "giphy (4).gif",
    "giphy.gif",
    "j5wZW0.gif",
    "jkevosmydghf1.gif",
    "source (1).gif",
    "source.gif"
  ];

  const hackLog = document.getElementById("hackLog");
  const hackBtn = document.getElementById("hackBtn");
  const results = document.getElementById("secretResults");
  const grid = document.getElementById("gifGrid");
  let running = false;

  function pickRandom(list, count) {
    const copy = [...list];
    const picks = [];
    while (copy.length && picks.length < count) {
      const idx = Math.floor(Math.random() * copy.length);
      picks.push(copy.splice(idx, 1)[0]);
    }
    return picks;
  }

  function writeLine(text) {
    hackLog.textContent += `${text}\n`;
    hackLog.scrollTop = hackLog.scrollHeight;
  }

  function runHack() {
    if (running) return;
    running = true;
    hackBtn.disabled = true;
    hackLog.textContent = "";
    results.style.display = "none";
    grid.innerHTML = "";

    const steps = [
      "Initializing totally legitimate connection...",
      "Bypassing triple-password firewall...",
      "Decrypting classified snack protocols...",
      "Downloading files at 56k maximum speed...",
      "Extracting files... stand by..."
    ];

    steps.forEach((step, index) => {
      setTimeout(() => writeLine(step), index * 700);
    });

    setTimeout(() => {
      writeLine("Success. Classified files recovered.");
      const picks = pickRandom(gifFiles, 4);
      picks.forEach((file) => {
        const img = document.createElement("img");
        img.src = encodeURI(file);
        img.alt = "Top secret file";
        img.loading = "lazy";
        grid.appendChild(img);
      });
      results.style.display = "block";
      hackBtn.disabled = false;
      hackBtn.textContent = "Hack again for more files";
      running = false;
    }, steps.length * 700 + 600);
  }

  if (hackBtn) {
    hackBtn.addEventListener("click", runHack);
  }
})();
