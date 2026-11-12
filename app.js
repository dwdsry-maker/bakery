const WHATSAPP_NUMBER = "972538262380";

const TAG_LABELS = {
  "kosher": "כשר ✡️",
  "vegan": "טבעוני 🌱",
  "gluten-free": "ללא גלוטן 🌾"
};

const PRODUCTS_DATA = [
  {
    id: 1,
    name: "קרואסון חמאה צרפתי קלאסי",
    description: "27 שכבות של בצק עלים אוורירי ופריך מחמאה צרפתית עשירה בהתפחה של 48 שעות.",
    price: 18,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=700&q=80",
    tags: ["kosher"]
  },
  {
    id: 2,
    name: "קרואסון פיסטוק וקרם פטיסייר",
    description: "ממולא בקרם פיסטוק סיציליאני קטיפתי, מצופה בגלייז עדין ושברי פיסטוק קלוי.",
    price: 26,
    image: "https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=700&q=80",
    tags: ["kosher"]
  },
  {
    id: 3,
    name: "פאן או שוקולה ולרונה",
    description: "מאפה בצק קרואסון פריך עם שני מטילי שוקולד מריר 70% איכותי שנמס בפה.",
    price: 21,
    image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=700&q=80",
    tags: ["kosher"]
  },
  {
    id: 4,
    name: "סינבון קינמון והל טבעוני",
    description: "בצק בריוש רך על בסיס חלב שקדים, סוכר חום כהה, קינמון ציילוני וזיגוג וניל.",
    price: 22,
    image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=700&q=80",
    tags: ["kosher", "vegan"]
  },
  {
    id: 5,
    name: "בראוניז פאדג׳ שוקולד (ללא גלוטן)",
    description: "עשיר במיוחד, מרקם נימוח של שוקולד בלגי מריר ואגוזי לוז קלויים. 100% ללא גלוטן.",
    price: 24,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80",
    tags: ["kosher", "gluten-free"]
  },
  {
    id: 6,
    name: "טארט פירות יער ושקדים טבעוני",
    description: "קלתית בצק פריך שקדים, קרם וניל קוקוס ומיקס פירות יער טריים.",
    price: 29,
    image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=700&q=80",
    tags: ["kosher", "vegan", "gluten-free"]
  },
  {
    id: 7,
    name: "לחם מחמצת כפרי ואגוזים",
    description: "כיכר מחמצת שאור בת 36 שעות התפחה עם קראסט פציח ואגוזי מלך קלויים.",
    price: 28,
    image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=700&q=80",
    tags: ["kosher", "vegan"]
  },
  {
    id: 8,
    name: "עוגיות שוקולד צ׳יפס ומלח ים",
    description: "פריכות מבחוץ ורכות מבפנים, עם שוקולד מריר קצוץ גס וקורט מלח ים אטלנטי.",
    price: 16,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=700&q=80",
    tags: ["kosher"]
  }
];

let cart = JSON.parse(localStorage.getItem("anna_bakery_cart")) || [];
let activeFilter = "all";
let searchQuery = "";

const productsGrid = document.getElementById("products-grid");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("search-input");
const cartDrawer = document.getElementById("cart-drawer");
const cartBackdrop = document.getElementById("cart-backdrop");
const openCartBtn = document.getElementById("open-cart-btn");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartItemsContainer = document.getElementById("cart-items");
const cartCountBadge = document.getElementById("cart-count");
const cartTotalPriceEl = document.getElementById("cart-total-price");
const whatsappCheckoutBtn = document.getElementById("whatsapp-checkout-btn");
const deliveryRadios = document.querySelectorAll('input[name="deliveryType"]');
const addressInput = document.getElementById("customer-address");
const toastEl = document.getElementById("toast");

function renderProducts() {
  const filteredProducts = PRODUCTS_DATA.filter((product) => {
    const matchesTag = activeFilter === "all" || product.tags.includes(activeFilter);
    const matchesSearch = product.name.includes(searchQuery) || product.description.includes(searchQuery);
    return matchesTag && matchesSearch;
  });

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">לא נמצאו מאפים התואמים לחיפוש שלך.</p>`;
    return;
  }

  productsGrid.innerHTML = filteredProducts.map((product) => {
    const tagsHtml = product.tags.map((tag) => `<span class="tag-badge">${TAG_LABELS[tag] || tag}</span>`).join("");
    return `
      <article class="product-card">
        <div class="product-img-wrapper">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
          <div class="product-tags">${tagsHtml}</div>
        </div>
        <div class="product-body">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <div class="product-footer">
            <span class="product-price">₪${product.price}</span>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
              <i class="fa-solid fa-plus"></i>
              הוסף להזמנה
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    renderProducts();
  });
});

searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.trim();
  renderProducts();
});

function saveCart() {
  localStorage.setItem("anna_bakery_cart", JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId) {
  const product = PRODUCTS_DATA.find((p) => p.id === productId);
  if (!product) return;
  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  showToast(`"${product.name}" נוסף להזמנה`);
}

function changeQty(productId, delta) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== productId);
  }
  saveCart();
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartCountBadge.textContent = totalCount;
  cartTotalPriceEl.textContent = `₪${totalPrice}`;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-cart-msg">העגלה שלך ריקה כרגע.<br>בחר מאפים טריים מהתפריט כדי להתחיל!</p>`;
    return;
  }

  cartItemsContainer.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span>₪${item.price * item.qty} (₪${item.price} ליח׳)</span>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    </div>
  `).join("");
}

function toggleCart(open) {
  if (open) {
    cartDrawer.classList.add("open");
    cartBackdrop.classList.add("open");
  } else {
    cartDrawer.classList.remove("open");
    cartBackdrop.classList.remove("open");
  }
}

openCartBtn.addEventListener("click", () => toggleCart(true));
closeCartBtn.addEventListener("click", () => toggleCart(false));
cartBackdrop.addEventListener("click", () => toggleCart(false));

deliveryRadios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    if (e.target.value === "משלוח") {
      addressInput.classList.remove("hidden");
    } else {
      addressInput.classList.add("hidden");
    }
  });
});

whatsappCheckoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("העגלה ריקה! הוסף לפחות מאפה אחד לפני שליחת ההזמנה.");
    return;
  }

  const customerName = document.getElementById("customer-name").value.trim();
  const deliveryType = document.querySelector('input[name="deliveryType"]:checked').value;
  const address = addressInput.value.trim();
  const notes = document.getElementById("customer-notes").value.trim();

  if (!customerName) {
    alert("אנא הזן את שמך כדי שנדע על שם מי לרשום את ההזמנה.");
    document.getElementById("customer-name").focus();
    return;
  }

  if (deliveryType === "משלוח" && !address) {
    alert("אנא הזן כתובת מלאה למשלוח.");
    addressInput.focus();
    return;
  }

  let message = `היי *ANNA-BAKERY*! 👋\nאשמח לבצע הזמנה חדשה מהאתר:\n\n`;
  message += `*פרטי המזמין:* ${customerName}\n`;
  message += `*אופן קבלה:* ${deliveryType}\n`;
  if (deliveryType === "משלוח") message += `*כתובת למשלוח:* ${address}\n`;
  if (notes) message += `*הערות:* ${notes}\n`;

  message += `\n*פירוט ההזמנה:*\n`;
  let total = 0;

  cart.forEach((item) => {
    const lineTotal = item.price * item.qty;
    total += lineTotal;
    message += `• ${item.name} × ${item.qty} — ₪${lineTotal}\n`;
  });

  message += `\n*סה״כ לתשלום: ₪${total}*`;

  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, "_blank", "noopener,noreferrer");
});

const rotatingItem = document.getElementById("scroll-rotating-item");
let ticking = false;

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const rotation = scrollY * 0.28;
      const translateY = Math.sin(scrollY * 0.003) * 35;
      const scale = 1 + Math.min(scrollY / 4000, 0.25);

      if (rotatingItem) {
        rotatingItem.style.transform = `translateY(${translateY}px) rotate(${rotation}deg) scale(${scale})`;
      }
      ticking = false;
    });
    ticking = true;
  }
});

const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const navLinks = document.getElementById("nav-links");

mobileMenuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2400);
}

renderProducts();
updateCartUI();
