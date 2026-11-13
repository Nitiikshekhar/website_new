/* still. — Swiss grid (web_4) storefront logic */

const PRODUCTS = [
  { id: "magnesium", name: "Magnesium", sub: "Evening powder", cat: "sleep", price: 32, type: "jar", body: "#9fae8f", cap: "#4a3527",
    desc: "Magnesium glycinate with a little tart cherry. Stir one scoop into water in the evening.", ingredients: "Magnesium glycinate, tart cherry powder, citric acid", size: "200 g · 40 servings" },
  { id: "ashwagandha", name: "Ashwagandha", sub: "Daily capsules", cat: "mind", price: 28, type: "bottle", body: "#a8601f", cap: "#3b2a1f",
    desc: "Organic root extract in a plant-based capsule. Take two with food.", ingredients: "Ashwagandha root extract, pullulan capsule", size: "60 capsules" },
  { id: "collagen", name: "Collagen", sub: "Unflavoured peptides", cat: "beauty", price: 44, type: "pouch", body: "#d9c7ad", cap: "#8a6446",
    desc: "Marine collagen peptides that dissolve into coffee, tea or smoothies without a trace.", ingredients: "Hydrolysed marine collagen", size: "300 g · 30 servings" },
  { id: "body-oil", name: "Body Oil", sub: "Lavender & jojoba", cat: "body", price: 36, type: "dropper", body: "#b8732e", cap: "#3b2a1f",
    desc: "A light, fast-absorbing oil for after the shower. Lavender at a gentle 1%.", ingredients: "Jojoba oil, sweet almond oil, lavender oil, vitamin E", size: "100 ml" },
  { id: "matcha", name: "Matcha", sub: "Ceremonial grade", cat: "mind", price: 30, type: "jar", body: "#4f5d47", cap: "#efe7d8",
    desc: "Single-origin, shade-grown matcha. Whisk one teaspoon into 80 ml of hot water.", ingredients: "Organic matcha green tea", size: "50 g · 30 servings" },
  { id: "turmeric", name: "Turmeric", sub: "Daily capsules", cat: "body", price: 24, type: "bottle", body: "#c98a3a", cap: "#3b2a1f",
    desc: "Turmeric root with black pepper for absorption. Take one capsule daily.", ingredients: "Turmeric root, black pepper extract, pullulan capsule", size: "60 capsules" },
  { id: "sleep-tea", name: "Sleep Tea", sub: "Chamomile & lemon balm", cat: "sleep", price: 18, type: "pouch", body: "#d6cdbb", cap: "#7d8f6e",
    desc: "A caffeine-free loose-leaf blend for the end of the day. Steep for five minutes.", ingredients: "Chamomile, lemon balm, lavender, oat straw", size: "60 g loose leaf" },
  { id: "face-oil", name: "Face Oil", sub: "Rosehip & squalane", cat: "beauty", price: 42, type: "dropper", body: "#94521c", cap: "#3b2a1f",
    desc: "Three ingredients, nothing else. Press two drops into damp skin, morning or night.", ingredients: "Rosehip seed oil, squalane, vitamin E", size: "30 ml" },
];

/* Optional per-design overrides: a page can set window.STORE_THEME = { colors: { id: [body, cap] }, ink: [light, dark] } */
/* This design's settings: product layout, product colours, label ink */
const THEME = {"layout": "table", "colors": {"magnesium": ["#e8e1d3", "#8a6446"], "ashwagandha": ["#b8691f", "#2a1d15"], "collagen": ["#cdbb9e", "#8a6446"], "body-oil": ["#a85c1c", "#1a1a1a"], "matcha": ["#8a9a7b", "#e8e1d3"], "turmeric": ["#e5a552", "#2a1d15"], "sleep-tea": ["#6f6a62", "#a9b79a"], "face-oil": ["#9c5418", "#1a1a1a"]}, "ink": ["#f3ece2", "#1a1a1a"]};
PRODUCTS.forEach((p) => { const c = THEME.colors && THEME.colors[p.id]; if (c) [p.body, p.cap] = c; });
const INK = THEME.ink || ["#f7f3ec", "#2e2119"];

const CATS = { all: "All", mind: "Mind", sleep: "Sleep", body: "Body", beauty: "Skin" };
const FREE_SHIP = 60;
const SHIPPING = 5;
const CART_KEY = "still-cart";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = (n) => "$" + n.toFixed(2);
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- Flat product art ---------- */
function art(p) {
  const b = p.body, c = p.cap;
  const n = parseInt(b.slice(1), 16);
  const lum = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  const ink = lum < 0.6 ? INK[0] : INK[1];
  const label = (y) => `
    <text x="100" y="${y}" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" font-weight="500" fill="${ink}">still.</text>
    <text x="100" y="${y + 12}" text-anchor="middle" font-family="Inter, sans-serif" font-size="6" letter-spacing=".8" fill="${ink}" opacity=".7">${esc(p.name.toUpperCase())}</text>`;
  let s = "";
  if (p.type === "bottle") s = `<rect x="74" y="40" width="52" height="30" fill="${c}"/><rect x="58" y="70" width="84" height="150" rx="10" fill="${b}"/>${label(150)}`;
  else if (p.type === "jar") s = `<rect x="50" y="96" width="100" height="22" fill="${c}"/><rect x="50" y="118" width="100" height="102" rx="6" fill="${b}"/>${label(170)}`;
  else if (p.type === "pouch") s = `<path d="M60 56 H140 L148 220 H52 Z" fill="${b}"/><rect x="60" y="56" width="80" height="10" fill="${c}"/>${label(150)}`;
  else s = `<rect x="88" y="30" width="24" height="26" rx="12" fill="${c}"/><rect x="84" y="52" width="32" height="22" fill="${c}"/><rect x="66" y="74" width="68" height="146" rx="8" fill="${b}"/>${label(152)}`;
  return `<svg viewBox="0 0 200 240" role="img" aria-label="${esc(p.name)}">${s}</svg>`;
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
const cartItems = () => Object.entries(cart).map(([id, q]) => ({ p: byId(id), q })).filter((i) => i.p);
const subtotal = () => cartItems().reduce((s, i) => s + i.p.price * i.q, 0);

function addToCart(id, qty = 1) {
  cart[id] = Math.min((cart[id] || 0) + qty, 20);
  saveCart(); renderCart();
  toast(`Added ${byId(id).name}`);
}
function setQty(id, q) {
  if (q <= 0) delete cart[id]; else cart[id] = Math.min(q, 20);
  saveCart(); renderCart();
}

/* ---------- Grid + filters ---------- */
let filter = "all";
const grid = $("#grid"), filters = $("#filters");
filters.innerHTML = Object.entries(CATS).map(([k, v]) =>
  `<button class="filter${k === "all" ? " is-active" : ""}" role="tab" aria-selected="${k === "all"}" data-cat="${k}">${v}</button>`).join("");
filters.addEventListener("click", (e) => {
  const f = e.target.closest(".filter"); if (!f) return;
  filter = f.dataset.cat;
  $$(".filter", filters).forEach((b) => { const on = b === f; b.classList.toggle("is-active", on); b.setAttribute("aria-selected", on); });
  renderGrid();
});

/* Product markup — designs can pick a layout via STORE_THEME.layout: "grid" (default), "list" or "table" */
function cardHTML(p, i) {
  const num = String(i + 1).padStart(2, "0");
  if (THEME.layout === "list") return `
    <article class="card row" data-id="${p.id}">
      <span class="row__num">No. ${num}</span>
      <button class="row__name" data-action="view">${esc(p.name)}<em>${esc(p.sub)}</em></button>
      <span class="row__price">${fmt(p.price)}</span>
      <button class="row__add" data-action="add">Add to bag</button>
      <div class="row__img" aria-hidden="true">${art(p)}</div>
    </article>`;
  if (THEME.layout === "table") return `
    <article class="card cell" data-id="${p.id}">
      <div class="cell__top"><span>${num}</span><span>${CATS[p.cat]}</span></div>
      <button class="cell__media" data-action="view" aria-label="View ${esc(p.name)}">${art(p)}</button>
      <div class="cell__foot"><button class="cell__name" data-action="view">${esc(p.name)}<small>${esc(p.sub)}</small></button><span class="cell__price">${fmt(p.price)}</span></div>
      <button class="cell__add" data-action="add">+ Add to bag</button>
    </article>`;
  return `
    <article class="card" data-id="${p.id}">
      <div class="card__media">
        <button class="card__view" data-action="view" aria-label="View ${esc(p.name)}" style="display:grid;place-items:center;height:100%">${art(p)}</button>
        <button class="card__add" data-action="add">Add to bag</button>
      </div>
      <button class="card__view" data-action="view" tabindex="-1">
        <div class="card__info">
          <div><h3>${esc(p.name)}</h3><p>${esc(p.sub)}</p></div>
          <span class="card__price">${fmt(p.price)}</span>
        </div>
      </button>
    </article>`;
}
function renderGrid() {
  grid.innerHTML = PRODUCTS.filter((p) => filter === "all" || p.cat === filter).map(cardHTML).join("");
}
grid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]"); if (!btn) return;
  const id = btn.closest(".card").dataset.id;
  if (btn.dataset.action === "add") addToCart(id); else openProduct(id);
});

/* ---------- Hero ---------- */
$("#heroArt").innerHTML = (THEME.hero || ["ashwagandha", "magnesium", "face-oil"]).map((id) => art(byId(id))).join("");

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
  $("[data-close-drawer]").focus();
}
function closeDrawer() {
  overlay.classList.remove("is-open"); drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  setTimeout(() => { if (!drawer.classList.contains("is-open")) overlay.hidden = true; }, 350);
  if (!modal.classList.contains("is-open")) document.body.classList.remove("lock");
  lastFocus?.focus?.();
}
$$("[data-open-cart]").forEach((b) => b.addEventListener("click", openDrawer));
$("[data-close-drawer]").addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);

function renderCart() {
  const items = cartItems(), sub = subtotal();
  $$("[data-cart-count]").forEach((el) => (el.textContent = items.reduce((s, i) => s + i.q, 0)));
  $("#subtotal").textContent = fmt(sub);
  $("#checkoutBtn").disabled = !items.length;
  const left = FREE_SHIP - sub;
  $("#shipText").textContent = !items.length ? `Free shipping over ${fmt(FREE_SHIP)}.`
    : left > 0 ? `${fmt(left)} until free shipping.` : "Free shipping applied.";
  $("#cartBody").innerHTML = items.length ? items.map(({ p, q }) => `
    <div class="line" data-id="${p.id}">
      <div class="line__img">${art(p)}</div>
      <div><h3>${esc(p.name)}</h3><p>${esc(p.sub)}</p>
        <div class="qty"><button data-qty="-1" aria-label="Decrease quantity">−</button><span>${q}</span><button data-qty="1" aria-label="Increase quantity">+</button></div>
      </div>
      <div class="line__end"><span>${fmt(p.price * q)}</span><button class="text-btn" data-remove>Remove</button></div>
    </div>`).join("") : `<p class="empty">Your bag is empty.</p>`;
}
$("#cartBody").addEventListener("click", (e) => {
  const line = e.target.closest(".line"); if (!line) return;
  const id = line.dataset.id, q = e.target.closest("[data-qty]");
  if (q) setQty(id, (cart[id] || 0) + Number(q.dataset.qty));
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
  $(".modal__close").focus();
}
function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  if (!drawer.classList.contains("is-open")) document.body.classList.remove("lock");
  lastFocus?.focus?.();
}
$(".modal__close").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (modal.classList.contains("is-open")) closeModal();
  else if (drawer.classList.contains("is-open")) closeDrawer();
});

function openProduct(id) {
  const p = byId(id);
  let qty = 1;
  openModal(`
    <div class="pdp">
      <div class="pdp__media">${art(p)}</div>
      <div class="pdp__info">
        <h2>${esc(p.name)}</h2>
        <p class="pdp__sub">${esc(p.sub)}</p>
        <p class="pdp__price">${fmt(p.price)}</p>
        <p class="pdp__desc">${esc(p.desc)}</p>
        <dl><dt>Ingredients</dt><dd>${esc(p.ingredients)}</dd><dt>Size</dt><dd>${esc(p.size)}</dd><dt>Category</dt><dd>${CATS[p.cat]}</dd></dl>
        <div class="pdp__buy">
          <div class="qty"><button data-q="-1" aria-label="Decrease quantity">−</button><span id="pdpQty">1</span><button data-q="1" aria-label="Increase quantity">+</button></div>
          <button class="btn" id="pdpAdd">Add to bag</button>
        </div>
      </div>
    </div>`);
  $$("[data-q]", modalContent).forEach((b) => b.addEventListener("click", () => {
    qty = Math.max(1, Math.min(20, qty + Number(b.dataset.q)));
    $("#pdpQty").textContent = qty;
  }));
  $("#pdpAdd").addEventListener("click", () => { addToCart(p.id, qty); closeModal(); });
}

function openCheckout() {
  const items = cartItems(); if (!items.length) return;
  const sub = subtotal(), ship = sub >= FREE_SHIP ? 0 : SHIPPING;
  openModal(`
    <div class="checkout">
      <form id="coForm" novalidate>
        <h2>Checkout</h2>
        <p class="checkout__note">Demo store — no payment is taken and nothing ships.</p>
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
        <button class="btn" type="submit">Place demo order</button>
      </form>
      <aside class="summary">
        <h3>Summary</h3>
        ${items.map(({ p, q }) => `<div class="summary__line"><span>${esc(p.name)} × ${q}</span><span>${fmt(p.price * q)}</span></div>`).join("")}
        <div class="summary__line"><span>Shipping</span><span>${ship ? fmt(ship) : "Free"}</span></div>
        <div class="summary__line summary__total"><span>Total</span><span>${fmt(sub + ship)}</span></div>
      </aside>
    </div>`);
  $("#coForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    let ok = true;
    $$("input", form).forEach((i) => { const v = i.checkValidity() && i.value.trim(); i.classList.toggle("invalid", !v); if (!v) ok = false; });
    if (!ok) { $("#coError").textContent = "Please complete every field."; return; }
    const order = "ST-" + Math.floor(10000 + Math.random() * 90000);
    const name = form.first.value.trim();
    cart = {}; saveCart(); renderCart();
    modalContent.innerHTML = `<div class="confirm"><h2>Thank you, ${esc(name)}.</h2><p>Demo order ${order} received.</p><p>No payment was taken and nothing will ship.</p><button class="btn" id="confirmDone">Continue</button></div>`;
    $("#confirmDone").addEventListener("click", closeModal);
  });
}

/* ---------- Toast, nav, newsletter ---------- */
let toastTimer;
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}
const nav = $("#nav");
/* Smooth scrolling: update at most once per frame, and pause hover effects while the page is moving
   (otherwise every product passing under the cursor re-paints its glow mid-scroll). */
let scrolled = null, ticking = false, scrollTimer = 0;
const updateNav = () => {
  const s = window.scrollY > 8;
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

$("#newsForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const i = $("#newsEmail"), s = $("#newsStatus");
  if (!i.checkValidity() || !i.value.trim()) { s.textContent = "Enter a valid email."; return; }
  s.textContent = "Subscribed. (Demo — nothing is stored.)"; i.value = "";
});

$("#year").textContent = new Date().getFullYear();
renderGrid();
renderCart();

/* Remember the last design viewed, for the landing page */
try { localStorage.setItem("still-last-design", "web_4"); } catch (e) {}
