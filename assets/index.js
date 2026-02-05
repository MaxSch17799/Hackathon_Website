(() => {
  const target = new Date("2026-02-24T14:00:00+01:00");
  const countdownEls = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    mins: document.getElementById("cd-mins"),
    secs: document.getElementById("cd-secs"),
    message: document.getElementById("countdownMessage")
  };

  function updateCountdown() {
    if (!countdownEls.days) return;
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) {
      countdownEls.days.textContent = "00";
      countdownEls.hours.textContent = "00";
      countdownEls.mins.textContent = "00";
      countdownEls.secs.textContent = "00";
      countdownEls.message.textContent = "We are live! Hack time!";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    countdownEls.days.textContent = String(days).padStart(2, "0");
    countdownEls.hours.textContent = String(hours).padStart(2, "0");
    countdownEls.mins.textContent = String(mins).padStart(2, "0");
    countdownEls.secs.textContent = String(secs).padStart(2, "0");
    countdownEls.message.textContent = "Countdown to 24 Feb 2026, 14:00 (Europe/Stockholm)";
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  const icsBtn = document.getElementById("icsBtn");
  if (icsBtn) {
    const icsLines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//AI Hackathon//Invite//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:ai-hackathon-2026@invite",
      "DTSTAMP:20260201T120000Z",
      "DTSTART:20260224T130000Z",
      "DTEND:20260224T170000Z",
      "SUMMARY:AI Hackathon; Tips and tricks for AI working",
      "DESCRIPTION:Learn and share AI coding tips. Pizza at 17:00 and optional hacking afterwards.",
      "END:VEVENT",
      "END:VCALENDAR"
    ];
    const blob = new Blob([icsLines.join("\r\n")], { type: "text/calendar" });
    icsBtn.href = URL.createObjectURL(blob);
  }

  const ideaList = [
    "Clippy Psychic Hotline: AI that reads your TODOs and pretends it's destiny",
    "Dial-Up Dreamweaver: an agent that only answers after a 56k modem scream",
    "Win95 Wizard of Logs: turns stack traces into choose-your-own-adventures",
    "Floppy Disk Time Machine: rollback bot that insists you label your disks",
    "GeoCities KPI Shrine: neon dashboard that demands a sacrifice (a CSV)",
    "Tamagotchi Deploy Pet: feed it passing tests or it runs away",
    "AOL Build Buddy: 'You've got mail' every time CI blinks",
    "Netscape Navigator for APIs: RAG over Swagger with a spinning logo",
    "MS Paint UI Prophet: doodle buttons and it spawns React",
    "Y2K Stress Tester: agent swarm that thinks every date is 1999",
    "ICQ Incident Pager: sends 'uh oh!' pings until you fix the bug",
    "Winamp Workflow DJ: shuffles backlog into playlists",
    "Encarta Fact Fairy: pops trivia bubbles while you read docs",
    "CD-ROM Knowledge Vault: search with dramatic spin-up sounds",
    "Pixelated PM: turns requirements into 8-bit quests",
    "Laser Printer Linter: formats code so it looks good on paper",
    "Alt-Tab Oracle: predicts the next window you should open",
    "BBS Bug Bounty: nightly forum posts ranking today's weirdest bugs",
    "Receipt Printer Roadmap: tasks printed on infinite virtual paper",
    "Screensaver Standup: project status floats around the screen",
    "AskJeeves Jira: questions your tickets with passive-aggressive politeness",
    "Beige Box Bootcamp: setup assistant that only speaks in BIOS beeps",
    "Shareware Scope Police: disables features after 30 minutes unless you promise focus",
    "VRML Roadmap Rollercoaster: 3D backlog ride with AI narration",
    "Napster Knowledge Sync: peer-to-peer FAQ swapping with random emojis",
    "PalmPilot Pair Programmer: 160-char commit messages only",
    "Blockbuster Bug Rewind: AI that rewinds commits until the plot makes sense",
    "Hyperlink Hamster: runs in a wheel to power your build pipeline",
    "Y2K Risk Radar: beeps whenever someone writes a date",
    "MIDI Milestone Tracker: converts OKRs into tiny synth riffs",
    "Robo-Clip Art Generator: turns error logs into motivational posters",
    "GeoCities Guestbook QA: sorts feedback into neon priority lanes"
  ];

  const ideaBtn = document.getElementById("ideaBtn");
  const ideaBox = document.getElementById("ideaBox");
  let lastIdea = "";

  function pickIdea() {
    if (!ideaBox) return;
    let idea = ideaList[(Math.random() * ideaList.length) | 0];
    if (ideaList.length > 1) {
      while (idea === lastIdea) {
        idea = ideaList[(Math.random() * ideaList.length) | 0];
      }
    }
    lastIdea = idea;
    ideaBox.textContent = idea;
    ideaBox.classList.remove("idea-pop");
    void ideaBox.offsetWidth;
    ideaBox.classList.add("idea-pop");
  }

  if (ideaBtn) {
    ideaBtn.addEventListener("click", pickIdea);
  }

  const nameInput = document.getElementById("guestName");
  const messageInput = document.getElementById("guestMessage");
  const postBtn = document.getElementById("guestPost");
  const guestForm = document.getElementById("guestForm");
  const guestLog = document.getElementById("guestLog");
  const guestStatus = document.getElementById("guestStatus");
  const messageCount = document.getElementById("messageCount");
  const refreshBtn = document.getElementById("guestRefresh");

  const nameKey = "hackathon_guest_name";
  if (nameInput) {
    nameInput.value = localStorage.getItem(nameKey) || "";
  }

  function sanitizeInput(str) {
    return String(str || "")
      .replace(/[<>]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function setStatus(msg) {
    if (guestStatus) guestStatus.textContent = msg;
  }

  function updateCount() {
    if (!messageInput || !messageCount) return;
    messageCount.textContent = `${messageInput.value.length}/500`;
  }

  if (messageInput) {
    messageInput.addEventListener("input", updateCount);
    updateCount();
  }

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  function formatRelative(tsSeconds) {
    const nowSec = Math.floor(Date.now() / 1000);
    const diff = nowSec - tsSeconds;
    if (diff < 10) return "just now";
    if (diff < 60) return rtf.format(-diff, "second");
    const mins = Math.floor(diff / 60);
    if (mins < 60) return rtf.format(-mins, "minute");
    const hours = Math.floor(mins / 60);
    if (hours < 24) return rtf.format(-hours, "hour");
    const days = Math.floor(hours / 24);
    return rtf.format(-days, "day");
  }

  function renderPosts(posts) {
    if (!guestLog) return;
    guestLog.innerHTML = "";
    if (!posts || posts.length === 0) {
      const empty = document.createElement("div");
      empty.className = "chat-post";
      empty.textContent = "No posts yet. Be the first neon hero.";
      guestLog.appendChild(empty);
      return;
    }

    posts.forEach((post) => {
      const card = document.createElement("div");
      card.className = "chat-post";

      const meta = document.createElement("div");
      meta.className = "chat-meta";
      meta.textContent = `${post.name} • ${formatRelative(post.created_at)}`;

      const msg = document.createElement("div");
      msg.textContent = post.message;

      card.appendChild(meta);
      card.appendChild(msg);
      guestLog.appendChild(card);
    });
  }

  async function fetchPosts() {
    if (!guestLog) return;
    try {
      setStatus("Loading guestbook...");
      const res = await fetch("/api/guestbook?limit=50", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      renderPosts(data.posts || []);
      setStatus("Updated just now");
    } catch (err) {
      setStatus("Guestbook offline locally. It will work when deployed.");
    }
  }

  async function submitPost(ev) {
    ev.preventDefault();
    if (!nameInput || !messageInput) return;

    const name = sanitizeInput(nameInput.value);
    const message = sanitizeInput(messageInput.value);

    if (name.length < 1 || name.length > 32) {
      setStatus("Name must be 1-32 characters.");
      return;
    }
    if (message.length < 1 || message.length > 500) {
      setStatus("Message must be 1-500 characters.");
      return;
    }

    localStorage.setItem(nameKey, name);

    try {
      postBtn && (postBtn.disabled = true);
      setStatus("Posting...");
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to post");
      }

      messageInput.value = "";
      updateCount();
      setStatus("Posted! Refreshing...");
      await fetchPosts();
    } catch (err) {
      setStatus(err.message || "Guestbook error");
    } finally {
      postBtn && (postBtn.disabled = false);
    }
  }

  if (guestForm) {
    guestForm.addEventListener("submit", submitPost);
  }

  if (refreshBtn) {
    refreshBtn.addEventListener("click", fetchPosts);
  }

  fetchPosts();
  setInterval(fetchPosts, 15000);
})();
