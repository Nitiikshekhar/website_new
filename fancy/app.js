/* Aurum & Sage — demo storefront logic */

/* material: glass (amber apothecary glass), ceramic (matte sage), paper (kraft / linen pouch) */
const PRODUCTS = [
  { id: "calm", name: "Calm Ritual", short: "CALM", sub: "Ashwagandha & L-theanine", cat: "mind", price: 38, type: "bottle", material: "glass", body: "#b8691f", tint: "#c98a3a", rating: 4.9, reviews: 412, badge: "Bestseller",
    desc: "A grounding daily capsule pairing organic ashwagandha root with L-theanine from green tea — for unhurried afternoons and a steadier sense of calm.", notes: ["60 vegan capsules", "Organic ashwagandha root", "Third-party tested for purity"] },
  { id: "sleep", name: "Deep Rest", short: "REST", sub: "Magnesium & chamomile", cat: "sleep", price: 42, type: "jar", material: "ceramic", body: "#7d8f6e", tint: "#8a9a7b", rating: 4.8, reviews: 368, badge: "New harvest",
    desc: "A softly sweet evening powder of magnesium glycinate, wild chamomile and tart cherry. Stir into warm water or tea as you wind down.", notes: ["30 servings", "No added sugar", "Naturally caffeine free"] },
  { id: "glow", name: "Glow Elixir", short: "GLOW", sub: "Marine collagen & acerola", cat: "beauty", price: 56, type: "pouch", material: "paper", body: "#d2b48f", tint: "#c9a27a", rating: 4.7, reviews: 251,
    desc: "Wild-caught marine collagen peptides with acerola cherry vitamin C, in a delicate natural peach and rose flavour.", notes: ["20 sachets", "Wild-caught, traceable", "Compostable pouch"] },
  { id: "oil", name: "Lavender Body Oil", short: "LAVANDE", sub: "Jojoba & French lavender", cat: "body", price: 48, type: "dropper", material: "glass", body: "#a85c1c", tint: "#b97a2e", rating: 4.9, reviews: 190,
    desc: "Cold-pressed jojoba and sweet almond oils infused with steam-distilled Provençal lavender. Press into warm skin after bathing.", notes: ["100 ml amber glass", "Cold-pressed oils", "Cruelty free"] },
  { id: "matcha", name: "Morning Matcha", short: "MATCHA", sub: "Ceremonial matcha & lion's mane", cat: "mind", price: 34, type: "jar", material: "ceramic", body: "#a9b79a", tint: "#9aab89", rating: 4.8, reviews: 527, badge: "Bestseller",
    desc: "Shade-grown ceremonial matcha, stone-ground and blended with organic lion's mane mushroom for a smooth, focused start.", notes: ["30 servings", "Organic, single origin", "Stone-ground"] },
  { id: "golden", name: "Golden Balance", short: "GOLDEN", sub: "Turmeric & black pepper", cat: "body", price: 29, type: "bottle", material: "glass", body: "#c4782a", tint: "#e5a552", rating: 4.6, reviews: 302,
    desc: "Gentle gummies of organic turmeric, ginger and black pepper, lightly sweetened with apple and coloured only by the spice itself.", notes: ["60 pectin gummies", "Vegan", "No artificial colours"] },
  { id: "tea", name: "Evening Tea", short: "TISANE", sub: "Tulsi, rose & lemon balm", cat: "sleep", price: 24, type: "pouch", material: "paper", body: "#8a9a7b", tint: "#7d8f6e", rating: 4.7, reviews: 143,
    desc: "A floral, caffeine-free loose-leaf tisane of holy basil, Damask rose petals and lemon balm. Steep for five slow minutes.", notes: ["80 g loose leaf", "Organic botanicals", "Compostable pouch"] },
  { id: "serum", name: "Rose Face Serum", short: "ROSE", sub: "Rosehip & plant squalane", cat: "beauty", price: 64, type: "dropper", material: "glass", body: "#9c5418", tint: "#c98f6f", rating: 4.9, reviews: 288, badge: "Signature",
    desc: "A weightless facial oil of cold-pressed Patagonian rosehip, olive-derived squalane and Bulgarian rose otto for a dewy, luminous finish.", notes: ["30 ml amber glass dropper", "Three natural ingredients", "Scented by rose alone"] },
];

const CATS = { all: "All", mind: "Mind", sleep: "Sleep", body: "Body", beauty: "Beauty" };
const FREE_SHIP = 75;
const SHIPPING = 6;
const CART_KEY = "aurum-sage-cart";

const REVIEWS = [
  { text: "“Deep Rest has become the most sacred ten minutes of my evening. The whole night feels slower, softer.”", by: "Amara L. — London" },
  { text: "“The amber glass, the wooden lids, the scent when you open it — it feels like an heirloom, not a supplement.”", by: "Daniel K. — Toronto" },
  { text: "“The rose serum smells like a garden after rain. My skin has never looked so quietly luminous.”", by: "Priya S. — Mumbai" },
];

/* ---------- Helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = (n) => "$" + n.toFixed(2);
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function shade(hex, pct) {
  const n = parseInt(hex.slice(1), 16);
  const f = (c) => Math.max(0, Math.min(255, Math.round(c + (pct < 0 ? c : 255 - c) * (pct / 100))));
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

/* ---------- Product art: amber glass, sage ceramic, kraft paper, walnut wood ---------- */
let artSeq = 0;
function art(p) {
  const id = "a" + artSeq++;
  const b = p.body;
  const bodyStops = {
    glass: [[0, -60], [0.14, -25], [0.36, 26], [0.55, 0], [0.82, -32], [1, -62]],
    ceramic: [[0, -32], [0.3, 6], [0.5, 14], [0.75, -6], [1, -38]],
    paper: [[0, -22], [0.35, 8], [0.6, 2], [1, -26]],
  }[p.material];
  const defs = `<defs>
    <linearGradient id="${id}b" x1="0" x2="1">${bodyStops.map(([o, s]) => `<stop offset="${o}" stop-color="${shade(b, s)}"/>`).join("")}</linearGradient>
    <linearGradient id="${id}w" x1="0" x2="1"><stop offset="0" stop-color="#21140c"/><stop offset=".28" stop-color="#5e3f2a"/><stop offset=".5" stop-color="#8a6446"/><stop offset=".74" stop-color="#583925"/><stop offset="1" stop-color="#1f130b"/></linearGradient>
    <linearGradient id="${id}h" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity="${p.material === "glass" ? 0.5 : 0.16}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <radialGradient id="${id}r" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#ffd9a0" stop-opacity=".35"/><stop offset="1" stop-color="#ffd9a0" stop-opacity="0"/></radialGradient>
  </defs>`;

  // walnut wood piece with vertical grain
  const wood = (x, y, w, h, rx = 4) => {
    let grain = "";
    for (let i = 1; i < 7; i++) {
      const gx = x + (w * i) / 7;
      grain += `<path d="M${gx} ${y + 1} Q ${gx + (i % 2 ? 1.6 : -1.6)} ${y + h / 2} ${gx} ${y + h - 1}" stroke="#1a0f08" stroke-opacity=".28" stroke-width=".6" fill="none"/>`;
    }
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="url(#${id}w)"/>${grain}
      <rect x="${x}" y="${y}" width="${w}" height="1.6" rx=".8" fill="#c79b72" opacity=".55"/>`;
  };

  const label = (x, y, w, h) => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" fill="#f4ede1"/>
    <rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" fill="none" stroke="#b97a2e" stroke-width=".55"/>
    <rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${h - 10}" fill="none" stroke="#b97a2e" stroke-width=".3" opacity=".7"/>
    <text x="100" y="${y + h * 0.36}" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="11.5" font-style="italic" fill="#2b1e16">A&amp;S</text>
    <line x1="${100 - w * 0.18}" x2="${100 + w * 0.18}" y1="${y + h * 0.47}" y2="${y + h * 0.47}" stroke="#b97a2e" stroke-width=".4"/>
    <text x="100" y="${y + h * 0.64}" text-anchor="middle" font-family="Jost, sans-serif" font-size="6" letter-spacing="1.8" fill="#2b1e16">${p.short}</text>
    <text x="100" y="${y + h * 0.8}" text-anchor="middle" font-family="Jost, sans-serif" font-size="3.4" letter-spacing="1.2" fill="#6b4c38">NATURAL ORIGIN</text>`;

  let shape = "";
  if (p.type === "bottle") {
    shape = `${wood(70, 34, 60, 34, 5)}
      <rect x="80" y="66" width="40" height="10" fill="${shade(b, -55)}"/>
      <rect x="54" y="74" width="92" height="148" rx="26" fill="url(#${id}b)"/>
      <rect x="54" y="74" width="92" height="148" rx="26" fill="url(#${id}r)"/>
      <rect x="64" y="84" width="9" height="128" rx="4.5" fill="url(#${id}h)"/>
      <rect x="128" y="96" width="3" height="96" rx="1.5" fill="#fff" opacity=".12"/>
      ${label(64, 118, 72, 66)}`;
  } else if (p.type === "jar") {
    shape = `${wood(44, 82, 112, 32, 7)}
      <rect x="48" y="110" width="104" height="112" rx="22" fill="url(#${id}b)"/>
      <rect x="48" y="110" width="104" height="5" fill="#000" opacity=".12"/>
      <rect x="58" y="120" width="10" height="94" rx="5" fill="url(#${id}h)"/>
      ${label(62, 136, 76, 62)}`;
  } else if (p.type === "pouch") {
    shape = `<path d="M58 58 H142 L153 212 Q153 222 143 222 H57 Q47 222 47 212 Z" fill="url(#${id}b)"/>
      ${wood(54, 46, 92, 18, 3)}
      <path d="M60 70 L52 212" stroke="#fff" stroke-opacity=".12" stroke-width="7"/>
      <path d="M58 200 L142 200" stroke="#000" stroke-opacity=".08" stroke-width="1"/>
      <path d="M86 56 Q100 40 114 56" fill="none" stroke="#c79b72" stroke-width="1.6"/>
      ${label(64, 112, 72, 70)}`;
  } else {
    shape = `<ellipse cx="100" cy="34" rx="14" ry="19" fill="#2a1a10"/>
      <ellipse cx="96" cy="28" rx="4" ry="7" fill="#fff" opacity=".1"/>
      ${wood(80, 50, 40, 28, 4)}
      <rect x="62" y="76" width="76" height="146" rx="22" fill="url(#${id}b)"/>
      <rect x="62" y="76" width="76" height="146" rx="22" fill="url(#${id}r)"/>
      <rect x="71" y="86" width="8" height="126" rx="4" fill="url(#${id}h)"/>
      <rect x="122" y="98" width="2.6" height="92" rx="1.3" fill="#fff" opacity=".12"/>
      ${label(68, 122, 64, 62)}`;
  }
  return `<svg viewBox="0 0 200 240" role="img" aria-label="${esc(p.name)}">${defs}<ellipse cx="100" cy="226" rx="66" ry="7" fill="#000" opacity=".24"/>${shape}</svg>`;
}

/* ---------- Cart state ---------- */
let cart = loadCart();
function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY)) || {};
    return Object.fromEntries(Object.entries(raw).filter(([id, q]) => byId(id) && Number.isInteger(q) && q > 0));
  } catch (e) { return {}; }
}
function saveCart() { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {} }
function cartItems() { return Object.entries(cart).map(([id, q]) => ({ p: byId(id), q })).filter((i) => i.p); }
function subtotal() { return cartItems().reduce((s, i) => s + i.p.price * i.q, 0); }

function addToCart(id, qty = 1) {
  cart[id] = Math.min((cart[id] || 0) + qty, 20);
  saveCart(); renderCart();
  $$(".bag-count").forEach((el) => { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); });
  toast(`${byId(id).name} has been added to your bag`);
}
function setQty(id, q) {
  if (q <= 0) delete cart[id]; else cart[id] = Math.min(q, 20);
  saveCart(); renderCart();
}

/* ---------- Shop grid ---------- */
let filter = "all", sort = "featured";
const grid = $("#grid");
const tabs = $("#tabs");

tabs.innerHTML = Object.entries(CATS).map(([k, v]) =>
  `<button class="tab${k === "all" ? " is-active" : ""}" role="tab" aria-selected="${k === "all"}" data-cat="${k}">${v}</button>`).join("");

function setFilter(cat) {
  filter = cat;
  $$(".tab", tabs).forEach((t) => { const on = t.dataset.cat === cat; t.classList.toggle("is-active", on); t.setAttribute("aria-selected", on); });
  renderGrid();
}
tabs.addEventListener("click", (e) => { const t = e.target.closest(".tab"); if (t) setFilter(t.dataset.cat); });
$("#sort").addEventListener("change", (e) => { sort = e.target.value; renderGrid(); });

function renderGrid() {
  let list = PRODUCTS.filter((p) => filter === "all" || p.cat === filter);
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
  grid.innerHTML = list.map((p, i) => `
    <article class="card" data-id="${p.id}" style="animation-delay:${i * 80}ms">
      <button class="card__media" data-action="view" style="--tint:${p.tint}" aria-label="View ${esc(p.name)}">
        ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}
        ${art(p)}
        <span class="card__quick">Discover</span>
      </button>
      <div class="card__body">
        <p class="card__sub">${esc(p.sub)}</p>
        <h3 class="card__name">${esc(p.name)}</h3>
        <div class="card__meta"><span class="stars">★★★★★</span><span>${p.rating} · ${p.reviews}</span></div>
        <div class="card__foot">
          <span class="price">${fmt(p.price)}</span>
          <button class="btn-add" data-action="add">Add to bag</button>
        </div>
      </div>
    </article>`).join("");
}
grid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const id = btn.closest(".card").dataset.id;
  if (btn.dataset.action === "view") return openProduct(id);
  addToCart(id);
  btn.classList.add("added"); btn.textContent = "Added ✓";
  setTimeout(() => { btn.classList.remove("added"); btn.textContent = "Add to bag"; }, 1500);
});

/* Collection tiles, footer links, ritual + signature buttons */
$$("[data-jump]").forEach((el) => el.addEventListener("click", () => {
  setFilter(el.dataset.jump);
  $("#shop").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
}));
$$("[data-footer-filter]").forEach((el) => el.addEventListener("click", () => setFilter(el.dataset.footerFilter)));
$$("[data-view]").forEach((el) => el.addEventListener("click", () => openProduct(el.dataset.view)));
$$("[data-add]").forEach((el) => el.addEventListener("click", () => addToCart(el.dataset.add)));

/* ---------- Hero + signature art ---------- */
const heroLayers = [];
(() => {
  const hero = $("#heroArt");
  [["sleep", "b", 14], ["serum", "c", 18], ["calm", "a", 26]].forEach(([id, pos, depth]) => {
    const d = document.createElement("div");
    d.className = `hero__product hero__product--${pos}`;
    d.innerHTML = art(byId(id));
    hero.appendChild(d);
    heroLayers.push([d, depth]);
  });
  const sig = document.createElement("div");
  sig.className = "sig__product";
  sig.innerHTML = art(byId("serum"));
  $("#sigArt").appendChild(sig);
})();

/* Amber spotlight + gentle parallax following the cursor */
(() => {
  const hero = $("#hero");
  if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
  let raf = 0, tx = 0, ty = 0;
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    hero.style.setProperty("--mx", px * 100 + "%");
    hero.style.setProperty("--my", py * 100 + "%");
    tx = px - 0.5; ty = py - 0.5;
    if (!raf) raf = requestAnimationFrame(() => {
      heroLayers.forEach(([el, d]) => (el.style.transform = `translate3d(${tx * d}px, ${ty * d * 0.6}px, 0)`));
      raf = 0;
    });
  });
  hero.addEventListener("pointerleave", () => heroLayers.forEach(([el]) => (el.style.transform = "")));
})();

/* ---------- Drawer ---------- */
const drawer = $("#drawer"), overlay = $("#overlay");
const modal = $("#modal"), modalContent = $("#modalContent");
let lastFocus = null;

function openDrawer() {
  lastFocus = document.activeElement;
  overlay.hidden = false;
  requestAnimationFrame(() => { overlay.classList.add("is-open"); drawer.classList.add("is-open"); });
  drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("lock");
  $(".icon-x", drawer).focus();
}
function closeDrawer() {
  overlay.classList.remove("is-open"); drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  setTimeout(() => { if (!drawer.classList.contains("is-open")) overlay.hidden = true; }, 500);
  if (!modal.classList.contains("is-open")) document.body.classList.remove("lock");
  lastFocus?.focus?.();
}
$$("[data-open-cart]").forEach((b) => b.addEventListener("click", openDrawer));
$("[data-close]", drawer).addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);

function renderCart() {
  const items = cartItems();
  const count = items.reduce((s, i) => s + i.q, 0);
  const sub = subtotal();
  $$("[data-cart-count]").forEach((el) => (el.textContent = count));
  $("#subtotal").textContent = fmt(sub);
  $("#checkoutBtn").disabled = !items.length;

  const remaining = FREE_SHIP - sub;
  $("#shipText").innerHTML = remaining > 0
    ? `You are <strong>${fmt(remaining)}</strong> away from complimentary shipping.`
    : `✦ Complimentary shipping has been <strong>unlocked</strong>.`;
  $("#shipBar").style.width = Math.min(100, (sub / FREE_SHIP) * 100) + "%";

  $("#cartBody").innerHTML = items.length ? items.map(({ p, q }) => `
    <div class="line" data-id="${p.id}">
      <div class="line__img" style="--tint:${p.tint}">${art(p)}</div>
      <div>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.sub)}</p>
        <div class="qty"><button data-qty="-1" aria-label="Decrease quantity">−</button><span>${q}</span><button data-qty="1" aria-label="Increase quantity">+</button></div>
      </div>
      <div class="line__price">${fmt(p.price * q)}<button class="line__remove" data-remove>Remove</button></div>
    </div>`).join("")
    : `<div class="empty"><h3>Your bag awaits</h3><p>Begin with a ritual that speaks to you.</p><button class="btn btn--dark" data-shop-now>Explore the collection</button></div>`;
}
$("#cartBody").addEventListener("click", (e) => {
  if (e.target.closest("[data-shop-now]")) { closeDrawer(); $("#shop").scrollIntoView({ behavior: "smooth" }); return; }
  const line = e.target.closest(".line"); if (!line) return;
  const id = line.dataset.id;
  const qBtn = e.target.closest("[data-qty]");
  if (qBtn) setQty(id, (cart[id] || 0) + Number(qBtn.dataset.qty));
  if (e.target.closest("[data-remove]")) setQty(id, 0);
});
$("#checkoutBtn").addEventListener("click", () => { closeDrawer(); openCheckout(); });

/* ---------- Modal ---------- */
function openModal(html) {
  if (!modal.classList.contains("is-open")) lastFocus = document.activeElement;
  modalContent.innerHTML = html;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("lock");
  $(".modal__close", modal).focus();
}
function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  if (!drawer.classList.contains("is-open")) document.body.classList.remove("lock");
  lastFocus?.focus?.();
}
$(".modal__close", modal).addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (modal.classList.contains("is-open")) closeModal();
  else if (drawer.classList.contains("is-open")) closeDrawer();
  else setMenu(false);
});

function openProduct(id) {
  const p = byId(id);
  let qty = 1;
  openModal(`
    <div class="pdp">
      <div class="pdp__media" style="--tint:${p.tint}">${art(p)}</div>
      <div class="pdp__info">
        <p class="card__sub">${CATS[p.cat]} collection · ${esc(p.sub)}</p>
        <h2>${esc(p.name)}</h2>
        <div class="card__meta"><span class="stars">★★★★★</span><span>${p.rating} · ${p.reviews} reviews</span></div>
        <p class="pdp__price">${fmt(p.price)}</p>
        <p class="pdp__desc">${esc(p.desc)}</p>
        <ul class="pdp__notes">${p.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>
        <div class="pdp__buy">
          <div class="qty"><button data-q="-1" aria-label="Decrease quantity">−</button><span id="pdpQty">1</span><button data-q="1" aria-label="Increase quantity">+</button></div>
          <button class="btn btn--amber" id="pdpAdd">Add to bag — <span id="pdpTotal">${fmt(p.price)}</span></button>
        </div>
      </div>
    </div>`);
  const update = () => { $("#pdpQty").textContent = qty; $("#pdpTotal").textContent = fmt(p.price * qty); };
  $$("[data-q]", modalContent).forEach((b) => b.addEventListener("click", () => { qty = Math.max(1, Math.min(20, qty + Number(b.dataset.q))); update(); }));
  $("#pdpAdd").addEventListener("click", () => { addToCart(p.id, qty); closeModal(); });
}

function openCheckout() {
  const items = cartItems();
  if (!items.length) return;
  const sub = subtotal();
  const ship = sub >= FREE_SHIP ? 0 : SHIPPING;
  openModal(`
    <div class="checkout">
      <h2>Checkout</h2>
      <p class="checkout__note">This is a demo store. No payment is collected and nothing will ship.</p>
      <div class="checkout__grid">
        <form id="coForm" novalidate>
          <div class="field-row">
            <label class="field">First name<input name="first" required autocomplete="given-name" /></label>
            <label class="field">Last name<input name="last" required autocomplete="family-name" /></label>
          </div>
          <label class="field">Email<input name="email" type="email" required autocomplete="email" /></label>
          <label class="field">Address<input name="address" required autocomplete="street-address" /></label>
          <div class="field-row">
            <label class="field">City<input name="city" required autocomplete="address-level2" /></label>
            <label class="field">Postal code<input name="zip" required autocomplete="postal-code" /></label>
          </div>
          <p class="form-error" id="coError" role="alert"></p>
          <button class="btn btn--amber btn--block" type="submit">Place demo order — ${fmt(sub + ship)}</button>
        </form>
        <aside class="summary">
          <h3>Order summary</h3>
          ${items.map(({ p, q }) => `<div class="summary__line"><span>${esc(p.name)} × ${q}</span><span>${fmt(p.price * q)}</span></div>`).join("")}
          <div class="summary__line"><span>Shipping</span><span>${ship ? fmt(ship) : "Complimentary"}</span></div>
          <div class="summary__line"><span>Gift wrapping</span><span>Linen, complimentary</span></div>
          <div class="summary__line summary__total"><span>Total</span><span>${fmt(sub + ship)}</span></div>
        </aside>
      </div>
    </div>`);
  $("#coForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    let ok = true;
    $$("input", form).forEach((i) => { const v = i.checkValidity() && i.value.trim(); i.classList.toggle("invalid", !v); if (!v) ok = false; });
    if (!ok) { $("#coError").textContent = "Please complete all fields with a valid email."; return; }
    const name = form.first.value.trim();
    const order = "AS-" + Math.floor(100000 + Math.random() * 900000);
    cart = {}; saveCart(); renderCart();
    modalContent.innerHTML = `
      <div class="confirm">
        <div class="confirm__seal">✦</div>
        <h2>Thank you, ${esc(name)}.</h2>
        <p>Your demo order <strong>${order}</strong> has been received with gratitude.</p>
        <p class="small">No payment was taken and nothing will ship — this is a demonstration store.</p>
        <button class="btn btn--dark" id="confirmDone">Continue browsing</button>
      </div>`;
    $("#confirmDone").addEventListener("click", closeModal);
  });
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
}

/* ---------- Nav ---------- */
const nav = $("#nav"), burger = $("#burger"), navLinks = $("#navLinks");
let scrolled = null, ticking = false, scrollTimer = 0;
const updateNav = () => {
  const s = window.scrollY > 40;
  if (s !== scrolled) { scrolled = s; nav.classList.toggle("is-scrolled", s); }
  ticking = false;
};
window.addEventListener("scroll", () => {
  if (!ticking) { ticking = true; requestAnimationFrame(updateNav); }
  if (!scrollTimer) document.body.classList.add("is-scrolling");
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => { document.body.classList.remove("is-scrolling"); scrollTimer = 0; }, 150);
}, { passive: true });
updateNav();
function setMenu(open) {
  navLinks.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
burger.addEventListener("click", () => setMenu(!navLinks.classList.contains("is-open")));
$$("a", navLinks).forEach((a) => a.addEventListener("click", () => setMenu(false)));

/* ---------- Testimonials ---------- */
(() => {
  const dots = $("#dots"), q = $("#quote");
  let i = 0, timer;
  dots.innerHTML = REVIEWS.map((_, n) => `<button class="dot" role="tab" aria-label="Review ${n + 1}"></button>`).join("");
  const show = (n) => {
    i = n;
    q.classList.add("fade");
    setTimeout(() => {
      $("#quoteText").textContent = REVIEWS[i].text;
      $("#quoteBy").textContent = REVIEWS[i].by;
      q.classList.remove("fade");
    }, 450);
    $$(".dot", dots).forEach((d, k) => { d.classList.toggle("is-active", k === i); d.setAttribute("aria-selected", k === i); });
  };
  const start = () => { clearInterval(timer); if (!reduceMotion) timer = setInterval(() => show((i + 1) % REVIEWS.length), 6500); };
  $$(".dot", dots).forEach((d, k) => d.addEventListener("click", () => { show(k); start(); }));
  $("#quoteText").textContent = REVIEWS[0].text; $("#quoteBy").textContent = REVIEWS[0].by;
  $$(".dot", dots)[0].classList.add("is-active");
  start();
})();

/* ---------- Newsletter ---------- */
$("#newsForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("#newsEmail"), status = $("#newsStatus");
  if (!input.checkValidity() || !input.value.trim()) { status.textContent = "Please enter a valid email address."; return; }
  status.textContent = "✦ Welcome to the circle. (Demo — no email is stored or sent.)";
  input.value = "";
});

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver((entries) => entries.forEach((en) => {
  if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
}), { threshold: 0.12 });

/* ---------- Intro curtain, then start reveals ---------- */
function startPage() {
  $("#loader").classList.add("done");
  document.body.classList.remove("is-loading");
  document.body.classList.add("is-ready");
  $$(".reveal").forEach((el, n) => { el.style.transitionDelay = (n % 4) * 110 + "ms"; io.observe(el); });
}
if (reduceMotion) startPage();
else {
  let started = false;
  const go = () => { if (!started) { started = true; setTimeout(startPage, 900); } };
  window.addEventListener("load", go);
  setTimeout(go, 1800); // don't wait forever on slow font loads
}

$("#year").textContent = new Date().getFullYear();
renderGrid();
renderCart();
