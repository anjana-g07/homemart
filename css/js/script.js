const productGrid = document.getElementById("productGrid");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const materialFilter = document.getElementById("materialFilter");
const priceFilter = document.getElementById("priceFilter");


function displayProducts(productList) {

    productGrid.innerHTML = "";

    if (productList.length === 0) {
        productGrid.innerHTML = `
            <p class="no-products">
                No products found.
            </p>
        `;
        return;
    }

    productList.forEach(product => {

        productGrid.innerHTML += `
            <div class="shop-card">

                <img src="${product.image}"
                     alt="${product.name}">

                <div class="shop-card-content">

                    <span class="product-category">
                        ${product.category}
                    </span>

                    <h3>${product.name}</h3>

                    <p class="rating">
                        ⭐ ${product.rating}
                    </p>

                    <p class="material">
                        Material: ${product.material}
                    </p>

                    <h4>₹${product.price.toLocaleString("en-IN")}</h4>

                    <div class="card-buttons">

                        <a
                            href="product-details.html?id=${product.id}"
                            class="view-btn">
                            View Details
                        </a>

                        <button
                            onclick="addToCart(${product.id})"
                            class="cart-btn">
                            🛒 Add
                        </button>

                    </div>

                </div>

            </div>
        `;
    });
}


function filterProducts() {

    const search =
        searchInput.value.toLowerCase();

    const category =
        categoryFilter.value;

    const material =
        materialFilter.value;

    const price =
        priceFilter.value;


    const filteredProducts = products.filter(product => {

        const matchesSearch =
            product.name
                .toLowerCase()
                .includes(search);

        const matchesCategory =
            category === "all" ||
            product.category === category;

        const matchesMaterial =
            material === "all" ||
            product.material === material;

        const matchesPrice =
            price === "all" ||
            product.price <= Number(price);

        return (
            matchesSearch &&
            matchesCategory &&
            matchesMaterial &&
            matchesPrice
        );
    });

    displayProducts(filteredProducts);
}


searchInput.addEventListener(
    "input",
    filterProducts
);

categoryFilter.addEventListener(
    "change",
    filterProducts
);

materialFilter.addEventListener(
    "change",
    filterProducts
);

priceFilter.addEventListener(
    "change",
    filterProducts
);


// Temporary cart function
function addToCart(productId) {

    const product =
        products.find(p => p.id === productId);

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    cart.push(product);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert(`${product.name} added to cart!`);
}


// Display products when page loads
if (productGrid) {
    displayProducts(products);
}
const productDetails =
    document.getElementById("productDetails");

if (productDetails) {

    const params =
        new URLSearchParams(window.location.search);

    const productId =
        Number(params.get("id"));

    const product =
        products.find(p => p.id === productId);

    if (product) {

        productDetails.innerHTML = `

            <div class="details-image">
                <img src="${product.image}"
                     alt="${product.name}">
            </div>

            <div class="details-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h1>${product.name}</h1>

                <div class="details-rating">
                    ⭐ ${product.rating} / 5
                </div>

                <h2>
                    ₹${product.price.toLocaleString("en-IN")}
                </h2>

                <p class="details-description">
                    ${product.description}
                </p>

                <div class="product-specs">

                    <p>
                        <strong>Material:</strong>
                        ${product.material}
                    </p>

                    <p>
                        <strong>Color:</strong>
                        ${product.color}
                    </p>

                    <p>
                        <strong>Brand:</strong>
                        ${product.brand}
                    </p>

                    <p>
                        <strong>Dimensions:</strong>
                        ${product.dimensions}
                    </p>

                </div>

                <button
                    class="btn"
                    onclick="addToCart(${product.id})">
                    🛒 Add to Cart
                </button>

            </div>
        `;

    } else {

        productDetails.innerHTML =
            "<h2>Product not found.</h2>";
    }
}
// =========================================
// SHOPPING CART
// =========================================

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function displayCart() {

    const cartContainer =
        document.getElementById("cartContainer");

    if (!cartContainer) return;

    const cart = getCart();

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>🛒 Your cart is empty</h2>
                <p>Add some beautiful furniture to your cart.</p>
                <a href="products.html" class="btn">
                    Continue Shopping
                </a>
            </div>
        `;

        return;
    }

    let total = 0;

    cartContainer.innerHTML = `
        <div class="cart-items">
            ${cart.map((product, index) => {

                total += product.price;

                return `
                    <div class="cart-item">

                        <img src="${product.image}"
                             alt="${product.name}">

                        <div class="cart-item-info">

                            <h3>${product.name}</h3>

                            <p>${product.category}</p>

                            <h4>
                                ₹${product.price.toLocaleString("en-IN")}
                            </h4>

                            <button
                                onclick="removeFromCart(${index})"
                                class="remove-btn">
                                Remove
                            </button>

                        </div>

                    </div>
                `;

            }).join("")}
        </div>

        <div class="cart-summary">

            <h2>Order Summary</h2>

            <div class="summary-row">
                <span>Subtotal</span>
                <strong>
                    ₹${total.toLocaleString("en-IN")}
                </strong>
            </div>

            <div class="summary-row">
                <span>Delivery</span>
                <strong>FREE</strong>
            </div>

            <hr>

            <div class="summary-total">
                <span>Total</span>
                <strong>
                    ₹${total.toLocaleString("en-IN")}
                </strong>
            </div>

            <a href="checkout.html" class="btn checkout-btn">
                Proceed to Checkout
            </a>

        </div>
    `;
}

function removeFromCart(index) {

    const cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);

    displayCart();
}

displayCart();
// =========================================
// CHECKOUT
// =========================================

const checkoutItems =
    document.getElementById("checkoutItems");

if (checkoutItems) {

    const cart = getCart();

    let subtotal = 0;

    checkoutItems.innerHTML = cart.map(product => {

        subtotal += product.price;

        return `
            <div class="checkout-item">
                <img src="${product.image}" alt="${product.name}">

                <div>
                    <h4>${product.name}</h4>
                    <p>₹${product.price.toLocaleString("en-IN")}</p>
                </div>
            </div>
        `;

    }).join("");

    document.getElementById("checkoutSubtotal").textContent =
        `₹${subtotal.toLocaleString("en-IN")}`;

    function updateCheckoutTotal() {

        const delivery =
            Number(document.getElementById("delivery").value);

        const total = subtotal + delivery;

        document.getElementById("deliveryCost").textContent =
            delivery === 0
                ? "FREE"
                : `₹${delivery.toLocaleString("en-IN")}`;

        document.getElementById("checkoutTotal").textContent =
            `₹${total.toLocaleString("en-IN")}`;
    }

    document.getElementById("delivery")
        .addEventListener("change", updateCheckoutTotal);

    updateCheckoutTotal();


    document.getElementById("checkoutForm")
        .addEventListener("submit", function(event) {

            event.preventDefault();

            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }

            alert("🎉 Order placed successfully!");

            localStorage.removeItem("cart");

            window.location.href = "index.html";
        });
}
// ===============================
// LOGIN & REGISTER
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("registerName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const user = {
            name: name,
            email: email,
            password: password
        };

        localStorage.setItem("homeMartUser", JSON.stringify(user));

        alert("Registration successful! 🎉");
        window.location.href = "login.html";
    });
}


const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const user = JSON.parse(localStorage.getItem("homeMartUser"));

        if (!user) {
            alert("No account found. Please register first.");
            return;
        }

        if (email === user.email && password === user.password) {
            localStorage.setItem("homeMartLoggedIn", "true");

            alert("Login successful! 🎉");
            window.location.href = "account.html";
        } else {
            alert("Invalid email or password!");
        }
    });
}
// ===============================
// ACCOUNT
// ===============================

const accountName = document.getElementById("accountName");
const accountEmail = document.getElementById("accountEmail");

if (accountName && accountEmail) {

    const user = JSON.parse(localStorage.getItem("homeMartUser"));

    if (user) {
        accountName.textContent = user.name;
        accountEmail.textContent = user.email;
    } else {
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.removeItem("homeMartLoggedIn");

    alert("Logged out successfully!");

    window.location.href = "login.html";
}
function displayCart() {

    const cartContainer = document.getElementById("cartContainer");

    if (!cartContainer) return;

    let cart = getCart();

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty 🛒</h2>
                <p>Add some beautiful furniture to your cart.</p>
                <a href="products.html" class="btn">Continue Shopping</a>
            </div>
        `;
        return;
    }

    let subtotal = 0;

    let html = `<div class="cart-items">`;

    cart.forEach((item, index) => {

        subtotal += item.price * (item.quantity || 1);

        html += `
            <div class="cart-item">

                <img src="${item.image}" alt="${item.name}">

                <div class="cart-item-info">

                    <h3>${item.name}</h3>

                    <p>${item.category}</p>

                    <h4>₹${item.price.toLocaleString("en-IN")}</h4>

                    <div class="quantity-box">

                        <button onclick="changeQuantity(${index}, -1)">
                            −
                        </button>

                        <span>${item.quantity || 1}</span>

                        <button onclick="changeQuantity(${index}, 1)">
                            +
                        </button>

                    </div>

                    <button
                        class="remove-btn"
                        onclick="removeFromCart(${index})">
                        Remove
                    </button>

                </div>

            </div>
        `;
    });

    html += `</div>`;

    html += `
        <div class="cart-summary">

            <h2>Order Summary</h2>

            <div class="summary-row">
                <span>Subtotal</span>
                <strong>₹${subtotal.toLocaleString("en-IN")}</strong>
            </div>

            <div class="summary-row">
                <span>Delivery</span>
                <strong>FREE</strong>
            </div>

            <div class="summary-total">
                <span>Total</span>
                <strong>₹${subtotal.toLocaleString("en-IN")}</strong>
            </div>

            <a href="checkout.html" class="btn checkout-btn">
                Proceed to Checkout
            </a>

        </div>
    `;

    cartContainer.innerHTML = html;
}
function changeQuantity(index, change) {

    let cart = getCart();

    if (!cart[index].quantity) {
        cart[index].quantity = 1;
    }

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
    displayCart();
}


function removeFromCart(index) {

    let cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);
    displayCart();
}
function addToCart(productId) {

    const product = products.find(p => p.id === productId);

    let cart = getCart();

    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart(cart);

    alert(`${product.name} added to cart! 🛒`);
}
// ===============================
// PRODUCT SORTING
// ===============================

const sortFilter = document.getElementById("sortFilter");

if (sortFilter) {
    sortFilter.addEventListener("change", function () {

        let sortedProducts = [...products];

        if (this.value === "low") {
            sortedProducts.sort((a, b) => a.price - b.price);
        }

        if (this.value === "high") {
            sortedProducts.sort((a, b) => b.price - a.price);
        }

        if (this.value === "rating") {
            sortedProducts.sort((a, b) => b.rating - a.rating);
        }

        displayProducts(sortedProducts);
    });
}
