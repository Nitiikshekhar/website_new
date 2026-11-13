// ---------- Theme toggle ----------
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

function currentTheme() {
  if (root.dataset.theme) return root.dataset.theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

themeToggle.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// ---------- Nav: scrolled state + mobile menu ----------
const nav = document.getElementById("nav");
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");

const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

function setMenu(open) {
  navLinks.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
burger.addEventListener("click", () => setMenu(!navLinks.classList.contains("is-open")));
navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// ---------- Active nav link on scroll ----------
const sections = [...document.querySelectorAll("main section[id]")];
const linkFor = (id) => navLinks.querySelector(`a[href="#${id}"]`);
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const link = linkFor(entry.target.id);
      if (link && entry.isIntersecting) {
        navLinks.querySelectorAll("a").forEach((a) => a.classList.remove("is-active"));
        link.classList.add("is-active");
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => sectionObserver.observe(s));

// ---------- Reveal on scroll ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
  revealObserver.observe(el);
});

// ---------- Typing effect ----------
const typedEl = document.getElementById("typed");
const words = ["web apps", "cloud infrastructure", "clean interfaces", "things that scale"];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  let w = 0, c = words[0].length, deleting = true;
  const tick = () => {
    const word = words[w];
    typedEl.textContent = word.slice(0, c);
    let delay = deleting ? 45 : 90;
    if (deleting) {
      c--;
      if (c < 0) { deleting = false; w = (w + 1) % words.length; c = 0; delay = 300; }
    } else {
      c++;
      if (c > words[w].length) { deleting = true; c = words[w].length; delay = 1800; }
    }
    setTimeout(tick, delay);
  };
  setTimeout(tick, 2000);
}

// ---------- Count-up stats ----------
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      };
      reduceMotion ? (el.textContent = target.toLocaleString()) : requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

// ---------- Project filters ----------
const chips = document.querySelectorAll(".chip");
const cards = document.querySelectorAll("#projectGrid .card");
chips.forEach((chip) =>
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    const f = chip.dataset.filter;
    cards.forEach((card) => {
      const show = f === "all" || card.dataset.tags.split(" ").includes(f);
      card.classList.toggle("is-hidden", !show);
      if (show) card.classList.add("is-visible");
    });
  })
);

// ---------- Contact form (client-side validation; opens email client) ----------
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;
  [...form.elements].forEach((el) => {
    if (!el.name) return;
    const ok = el.checkValidity() && el.value.trim() !== "";
    el.classList.toggle("is-invalid", !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    statusEl.textContent = "Please fill in all fields with a valid email.";
    statusEl.className = "form__status err";
    return;
  }

  // No backend yet: hand off to the visitor's email app.
  // Replace with Formspree / Netlify Forms / your own API to receive messages directly.
  const data = new FormData(form);
  const subject = encodeURIComponent(`Website message from ${data.get("name")}`);
  const body = encodeURIComponent(`${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;

  statusEl.textContent = "Thanks! Your email app should open to send the message.";
  statusEl.className = "form__status ok";
  form.reset();
});

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
