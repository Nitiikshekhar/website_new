// Landing page script

// Mark the design the visitor opened most recently (each web_N/app.js records it)
try {
  const last = localStorage.getItem("still-last-design");
  const card = last && document.querySelector(`[data-design="${CSS.escape(last)}"]`);
  if (card) card.classList.add("is-last");
} catch (e) {
  // storage unavailable (private mode, blocked) — the page works fine without it
}

document.getElementById("year").textContent = new Date().getFullYear();
