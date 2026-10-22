
const products = [
  {id:1,name:"Hydrating Face Serum",category:"Skincare",price:12.50,rating:4.9,tag:"BEST SELLER",stock:20,image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80",description:"A lightweight serum for a fresh, hydrated skincare routine."},
  {id:2,name:"Velvet Matte Lipstick",category:"Lip Care",price:8.50,rating:4.8,tag:"POPULAR",stock:30,image:"https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",description:"A stylish lipstick for a beautiful everyday makeup look."},
  {id:3,name:"Daily Moisturizer",category:"Skincare",price:15.00,rating:4.7,tag:"DAILY CARE",stock:15,image:"https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=600&q=80",description:"A daily moisturizer to help keep skin feeling soft."},
  {id:4,name:"Glow Foundation",category:"Makeup",price:18.00,rating:4.8,tag:"NEW",stock:12,image:"https://images.unsplash.com/photo-1631730359585-38a4935cbec4?auto=format&fit=crop&w=600&q=80",description:"Foundation for a smooth-looking makeup finish."},
  {id:5,name:"Gentle Facial Cleanser",category:"Skincare",price:9.90,rating:4.6,tag:"GENTLE",stock:25,image:"https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",description:"A gentle cleanser for your everyday skincare routine."},
  {id:6,name:"Soft Pink Blush",category:"Makeup",price:7.50,rating:4.7,tag:"FAVORITE",stock:18,image:"https://images.unsplash.com/photo-1599733589046-833d7e1f4b3b?auto=format&fit=crop&w=600&q=80",description:"A soft blush to complement your makeup style."},
  {id:7,name:"Daily Sunscreen SPF",category:"Sun Care",price:13.00,rating:4.9,tag:"MUST HAVE",stock:22,image:"https://images.unsplash.com/photo-1556229010-aa3f7ff66b24?auto=format&fit=crop&w=600&q=80",description:"A sunscreen product for your daily sun-care routine. Check the package for SPF and directions."},
  {id:8,name:"Lip Gloss Shine",category:"Lip Care",price:6.50,rating:4.5,tag:"GLOSSY",stock:35,image:"https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=600&q=80",description:"A glossy lip product to complete your look."},
  {id:9,name:"Vitamin C Serum",category:"Skincare",price:16.50,rating:4.8,tag:"GLOW",stock:14,image:"https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=600&q=80",description:"A serum to add to your skincare routine. Check the ingredients before use."},
  {id:10,name:"Makeup Brush Set",category:"Makeup",price:11.00,rating:4.6,tag:"VALUE SET",stock:16,image:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",description:"A brush set for applying and blending makeup."},
  {id:11,name:"Refreshing Face Mist",category:"Skincare",price:8.90,rating:4.5,tag:"REFRESH",stock:20,image:"https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80",description:"A refreshing mist for your beauty routine."},
  {id:12,name:"Nourishing Lip Balm",category:"Lip Care",price:4.50,rating:4.7,tag:"DAILY CARE",stock:40,image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80",description:"A simple lip-care product for everyday use."}
];

const $ = id => document.getElementById(id);
const money = amount => "$" + amount.toFixed(2);

let cart = JSON.parse(localStorage.getItem("cosmictik_cart") || "[]");
let currentUser = JSON.parse(localStorage.getItem("cosmictik_user") || "null");
let accountMode = "register";
let selectedProduct = null;

function saveCart() {
  localStorage.setItem("cosmictik_cart", JSON.stringify(cart));
  updateCartCount();
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2500);
}

function openModal(id) {
  $(id).classList.add("show");
}

function closeModal(id) {
  $(id).classList.remove("show");
}

function safeText(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[char]);
}

function renderProducts() {
  const search = $("search").value.trim().toLowerCase();
  const category = $("category").value;
  const sort = $("sort").value;

  let list = products.filter(product =>
    product.name.toLowerCase().includes(search) &&
    (category === "All" || product.category === category)
  );

  if (sort === "low") list.sort((a,b) => a.price-b.price);
  if (sort === "high") list.sort((a,b) => b.price-a.price);
  if (sort === "rating") list.sort((a,b) => b.rating-a.rating);

  $("productGrid").innerHTML = list.length ? list.map(product => `
    <article class="product-card">
      <div class="product-photo">
        <img src="${product.image}" alt="${safeText(product.name)}"
          loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/500x500/fff0f7/17151d?text=Beauty+Product'">
        <span class="tag">${safeText(product.tag)}</span>
      </div>
      <div class="product-info">
        <span class="category-text">${safeText(product.category)}</span>
        <h3>${safeText(product.name)}</h3>
        <div class="rating">★ ${product.rating} <small>(${product.stock} in demo stock)</small></div>
        <div class="price-row">
          <span class="price">${money(product.price)}</span>
          <button class="add-btn" aria-label="Add ${safeText(product.name)} to cart" onclick="addToCart(${product.id})">+</button>
        </div>
        <button class="details-btn" onclick="showDetails(${product.id})">VIEW DETAILS ↗</button>
      </div>
    </article>
  `).join("") : `<div class="empty">No products found. Try another search. 💗</div>`;
}

function showDetails(id) {
  selectedProduct = products.find(product => product.id === id);
  if (!selectedProduct) return;
  const p = selectedProduct;

  $("productDetails").innerHTML = `
    <div class="detail-layout">
      <img src="${p.image}" alt="${safeText(p.name)}"
        onerror="this.onerror=null;this.src='https://placehold.co/500x500/fff0f7/17151d?text=Beauty+Product'">
      <div>
        <span class="category-text">${safeText(p.category)}</span>
        <h2>${safeText(p.name)}</h2>
        <div class="rating">★ ${p.rating} / 5</div>
        <h2>${money(p.price)}</h2>
        <p>${safeText(p.description)}</p>
        <p>Availability: ${p.stock > 0 ? "In stock" : "Out of stock"}</p>
        <label for="detailQty">Quantity</label>
        <input id="detailQty" type="number" min="1" max="${p.stock}" value="1">
        <button class="btn primary full" onclick="addDetailToCart()">ADD TO BAG 🛍</button>
      </div>
    </div>`;
  openModal("productModal");
}

function addDetailToCart() {
  if (!selectedProduct) return;
  const qty = Number($("detailQty").value);
  if (!Number.isInteger(qty) || qty < 1 || qty > selectedProduct.stock) {
    showToast("Please enter a valid quantity.");
    return;
  }
  addToCart(selectedProduct.id, qty);
  closeModal("productModal");
}

function addToCart(id, quantity = 1) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  const nextQuantity = (existing ? existing.qty : 0) + quantity;

  if (nextQuantity > product.stock) {
    showToast("Sorry, demo stock is limited.");
    return;
  }

  if (existing) existing.qty = nextQuantity;
  else cart.push({id, qty:quantity});

  saveCart();
  showToast(product.name + " added to your bag 💗");
}

function updateCartCount() {
  $("cartCount").textContent = cart.reduce((sum,item) => sum+item.qty, 0);
}

function cartTotal() {
  return cart.reduce((sum,item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price*item.qty : 0);
  }, 0);
}

function openCart() {
  renderCart();
  openModal("cartModal");
}

function renderCart() {
  cart = cart.filter(item => products.some(p => p.id === item.id));
  saveCart();

  if (!cart.length) {
    $("cartItems").innerHTML = `<div class="empty">Your bag is empty. Explore our beauty collection! 💗</div>`;
  } else {
    $("cartItems").innerHTML = cart.map(item => {
      const p = products.find(product => product.id === item.id);
      return `
        <div class="cart-row">
          <img src="${p.image}" alt="${safeText(p.name)}"
            onerror="this.onerror=null;this.src='https://placehold.co/100x100/fff0f7/17151d?text=Beauty'">
          <div>
            <h4>${safeText(p.name)}</h4>
            <p>${money(p.price)} each</p>
            <div class="qty-controls">
              <button onclick="changeQty(${p.id},-1)" aria-label="Decrease quantity">−</button>
              <span>${item.qty}</span>
              <button onclick="changeQty(${p.id},1)" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div>
            <b>${money(p.price*item.qty)}</b><br>
            <button class="remove-btn" onclick="removeItem(${p.id})">Remove</button>
          </div>
        </div>`;
    }).join("");
  }
  $("cartTotal").textContent = money(cartTotal());
}

function changeQty(id, delta) {
  const item = cart.find(entry => entry.id === id);
  const product = products.find(entry => entry.id === id);
  if (!item || !product) return;
  if (item.qty + delta < 1) return removeItem(id);
  if (item.qty + delta > product.stock) return showToast("Demo stock limit reached.");
  item.qty += delta;
  saveCart();
  renderCart();
}

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
  showToast("Product removed from your bag.");
}

function accountAction() {
  if (currentUser) {
    if (confirm("Do you want to log out?")) {
      currentUser = null;
      localStorage.removeItem("cosmictik_user");
      updateAccountButton();
      showToast("You have logged out.");
    }
    return;
  }
  setAccountMode("register");
  openModal("accountModal");
}

function setAccountMode(mode) {
  accountMode = mode;
  const isRegister = mode === "register";
  $("accountTitle").textContent = isRegister ? "Create Account" : "Welcome Back";
  $("accountSubtitle").textContent = isRegister
    ? "Join us for your beauty journey."
    : "Login to continue shopping.";
  $("nameLabel").style.display = isRegister ? "block" : "none";
  $("fullName").style.display = isRegister ? "block" : "none";
  $("fullName").required = isRegister;
  $("accountSubmit").textContent = isRegister ? "CREATE ACCOUNT" : "LOGIN";
  $("accountSwitch").innerHTML = isRegister
    ? 'Already have an account? <button type="button" onclick="switchAccountMode()">Login</button>'
    : 'New to COSMICTIK? <button type="button" onclick="switchAccountMode()">Create account</button>';
}

function switchAccountMode() {
  setAccountMode(accountMode === "register" ? "login" : "register");
}

$("accountForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = $("fullName").value.trim();
  const email = $("email").value.trim().toLowerCase();
  const password = $("password").value;

  // DEMO ONLY: do not use localStorage password storage in production.
  const accounts = JSON.parse(localStorage.getItem("cosmictik_accounts") || "[]");

  if (accountMode === "register") {
    if (accounts.some(account => account.email === email)) {
      showToast("This email is already registered. Please login.");
      return;
    }
    accounts.push({name, email, password});
    localStorage.setItem("cosmictik_accounts", JSON.stringify(accounts));
    currentUser = {name, email};
  } else {
    const account = accounts.find(item => item.email === email && item.password === password);
    if (!account) {
      showToast("Email or password is incorrect.");
      return;
    }
    currentUser = {name:account.name, email:account.email};
  }

  localStorage.setItem("cosmictik_user", JSON.stringify(currentUser));
  updateAccountButton();
  closeModal("accountModal");
  $("accountForm").reset();
  showToast("Welcome, " + currentUser.name + "!");
});

function updateAccountButton() {
  $("accountBtn").textContent = currentUser
    ? currentUser.name.split(" ")[0]
    : "Login";
}

function startCheckout() {
  if (!cart.length) {
    showToast("Your bag is empty.");
    return;
  }
  if (!currentUser) {
    closeModal("cartModal");
    setAccountMode("register");
    openModal("accountModal");
    showToast("Please register or login before checkout.");
    return;
  }

  $("buyerName").value = currentUser.name || "";
  $("buyerEmail").value = currentUser.email || "";
  renderCheckoutSummary();
  closeModal("cartModal");
  openModal("checkoutModal");
}

function renderCheckoutSummary() {
  $("checkoutSummary").innerHTML = `
    <b>Order summary</b><br>
    ${cart.map(item => {
      const p = products.find(product => product.id === item.id);
      return `${safeText(p.name)} × ${item.qty} — ${money(p.price*item.qty)}`;
    }).join("<br>")}
    <hr>
    <b>Total: ${money(cartTotal())}</b><br>
    <small>Delivery fee is not included in this demo.</small>`;
}

$("checkoutForm").addEventListener("submit", event => {
  event.preventDefault();

  if (!currentUser || !cart.length) {
    showToast("Please login and add products first.");
    closeModal("checkoutModal");
    return;
  }

  const order = {
    orderNumber: "CSM-" + Date.now().toString().slice(-8),
    customer: {
      name: $("buyerName").value.trim(),
      phone: $("buyerPhone").value.trim(),
      email: $("buyerEmail").value.trim(),
      city: $("buyerCity").value.trim(),
      address: $("buyerAddress").value.trim()
    },
    payment: $("payment").value,
    items: cart.map(item => {
      const p = products.find(product => product.id === item.id);
      return {id:p.id, name:p.name, price:p.price, quantity:item.qty};
    }),
    total: cartTotal(),
    status: "Order received — awaiting confirmation",
    createdAt: new Date().toLocaleString()
  };

  // Demo order saved only in this browser.
  const orders = JSON.parse(localStorage.getItem("cosmictik_orders") || "[]");
  orders.push(order);
  localStorage.setItem("cosmictik_orders", JSON.stringify(orders));

  $("orderConfirmation").innerHTML = `
    <b>Order number:</b> ${safeText(order.orderNumber)}<br>
    <b>Name:</b> ${safeText(order.customer.name)}<br>
    <b>Phone:</b> ${safeText(order.customer.phone)}<br>
    <b>Delivery:</b> ${safeText(order.customer.city)}, ${safeText(order.customer.address)}<br>
    <b>Payment:</b> ${safeText(order.payment)}<br>
    <b>Total:</b> ${money(order.total)}<br>
    <b>Status:</b> ${safeText(order.status)}<br>
    <b>Date:</b> ${safeText(order.createdAt)}`;

  cart = [];
  saveCart();
  $("checkoutForm").reset();
  closeModal("checkoutModal");
  openModal("successModal");
});

function finishOrder() {
  closeModal("successModal");
  renderProducts();
  window.location.hash = "products";
}

$("search").addEventListener("input", renderProducts);
$("category").addEventListener("change", renderProducts);
$("sort").addEventListener("change", renderProducts);

document.querySelectorAll(".overlay").forEach(overlay => {
  overlay.addEventListener("click", event => {
    if (event.target === overlay) overlay.classList.remove("show");
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    document.querySelectorAll(".overlay.show").forEach(modal => modal.classList.remove("show"));
  }
});

renderProducts();
updateCartCount();
updateAccountButton();

