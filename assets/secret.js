(() => {
  const canvas = document.createElement("canvas");
  canvas.className = "matrix-canvas";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let drops = [];
  const chars = "01";
  const fontSize = 16;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const columns = Math.floor(width / fontSize);
    drops = Array.from({ length: columns }, () => Math.floor(Math.random() * height / fontSize));
  }

  function drawRain() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#00ff66";
    ctx.font = `${fontSize}px Courier New, monospace`;
    for (let i = 0; i < drops.length; i += 1) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctx.fillText(text, x, y);
      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
      } else {
        drops[i] += 1;
      }
    }
    requestAnimationFrame(drawRain);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(drawRain);

  const gifFiles = [
  "195f06fd7941802cd1f5307dd3697186.gif",
  "1_0iQlhQQUroM4_A1zAW6n3w.gif",
  "200 (1).gif",
  "200.gif",
  "200w (1).gif",
  "200w (2).gif",
  "200w (3).gif",
  "200w (4).gif",
  "200w (5).gif",
  "200w (6).gif",
  "200w (7).gif",
  "200w (8).gif",
  "200w (9).gif",
  "200w.gif",
  "64914e277d0577267c596ce43d04b114.gif",
  "7002b133b4cdbf415f6cc8d2171e5988.gif",
  "JsKZ.gif",
  "cat-smile.gif",
  "cool-fun.gif",
  "d07330fa88f241af249a43bb32555b6e.gif",
  "da4a3de40fb6636a14cc6816e2b63471.gif",
  "eed92600513bb65fc151bbb43373b741.gif",
  "f404bfec6643c68bb9dd6676af4c1663.gif",
  "f77cfc736e0d32df1b686898c4d4e04c.gif",
  "gaming-lag.gif",
  "gif-baby-animal-hippo-in-a-shallow-pool-smelling-the-air.gif",
  "giphy (1).gif",
  "giphy (2).gif",
  "giphy (3).gif",
  "giphy (4).gif",
  "giphy (5).gif",
  "giphy (6).gif",
  "giphy (7).gif",
  "giphy.gif",
  "j5wZW0.gif",
  "jkevosmydghf1.gif",
  "meme-gif-pfp-1.gif",
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
    hackLog.textContent += `${text}
`;
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
      "Initializing secure uplink...",
      "Routing through shadow nodes...",
      "Bypassing biometric lock...",
      "Decrypting classified archives...",
      "Exfiltration in progress... stand by..."
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
