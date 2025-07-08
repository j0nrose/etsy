// Application State
let cart = [];
let products = [];

// Sample product data
const sampleProducts = [
    {
        id: 1,
        name: "Handmade Ceramic Mug",
        description: "Beautiful handcrafted ceramic mug perfect for your morning coffee",
        price: 24.99,
        category: "home",
        image: "Ceramic Art"
    },
    {
        id: 2,
        name: "Silver Moon Necklace",
        description: "Elegant sterling silver necklace with moon pendant",
        price: 45.99,
        category: "jewelry",
        image: "Silver Jewelry"
    },
    {
        id: 3,
        name: "Vintage Leather Journal",
        description: "Handbound leather journal with aged paper",
        price: 32.99,
        category: "vintage",
        image: "Leather Craft"
    },
    {
        id: 4,
        name: "Watercolor Painting",
        description: "Original watercolor landscape painting",
        price: 89.99,
        category: "art",
        image: "Watercolor Art"
    },
    {
        id: 5,
        name: "Knitted Wool Scarf",
        description: "Soft merino wool scarf in autumn colors",
        price: 39.99,
        category: "clothing",
        image: "Knitted Goods"
    },
    {
        id: 6,
        name: "Wooden Cutting Board",
        description: "Handcrafted walnut cutting board with juice groove",
        price: 56.99,
        category: "home",
        image: "Woodwork"
    },
    {
        id: 7,
        name: "Crystal Earrings",
        description: "Delicate crystal drop earrings with gold accents",
        price: 29.99,
        category: "jewelry",
        image: "Crystal Jewelry"
    },
    {
        id: 8,
        name: "Embroidered Tote Bag",
        description: "Canvas tote bag with beautiful floral embroidery",
        price: 34.99,
        category: "clothing",
        image: "Embroidery"
    }
];

// DOM Elements
const cartBtn = document.querySelector('.cart-btn');
const cartModal = document.getElementById('cartModal');
const closeModal = document.querySelector('.close-modal');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.querySelector('.cart-count');
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.querySelector('.search-btn');
const categoryCards = document.querySelectorAll('.category-card');
const newsletterForm = document.getElementById('newsletterForm');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const ctaBtn = document.querySelector('.cta-btn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    products = [...sampleProducts];
    renderProducts(products);
    updateCartCount();
    initializeEventListeners();
    addScrollAnimations();
});

// Event Listeners
function initializeEventListeners() {
    // Cart modal
    cartBtn.addEventListener('click', openCartModal);
    closeModal.addEventListener('click', closeCartModal);
    
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Category filtering
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            filterByCategory(category);
            
            // Add active state
            categoryCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Newsletter form
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // CTA button
    ctaBtn.addEventListener('click', function() {
        document.querySelector('.featured-products').scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    // Close modal when clicking outside
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCartModal();
        }
    });
}

// Product rendering
function renderProducts(productsToRender) {
    productsGrid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">${product.image}</div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">$${product.price}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `;
    
    // Add hover animation
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
    
    return card;
}

// Cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCartCount();
        showAddToCartAnimation();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCartItems();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Add animation to cart count
    if (totalItems > 0) {
        cartCount.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 200);
    }
}

function showAddToCartAnimation() {
    const cartButton = document.querySelector('.cart-btn');
    cartButton.style.animation = 'bounce 0.5s ease';
    setTimeout(() => {
        cartButton.style.animation = '';
    }, 500);
}

// Cart modal
function openCartModal() {
    cartModal.style.display = 'block';
    renderCartItems();
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    cartModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function renderCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        return;
    }
    
    const cartHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <div class="cart-item-price">
                ${(item.price * item.quantity).toFixed(2)}
                <button onclick="removeFromCart(${item.id})" style="margin-left: 10px; color: #ff6b6b; background: none; border: none; cursor: pointer;">×</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartItemsContainer.innerHTML = cartHTML + `
        <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee; font-weight: bold; font-size: 1.2rem;">
            Total: ${total.toFixed(2)}
        </div>
    `;
}

// Search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        renderProducts(products);
        return;
    }
    
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    renderProducts(filteredProducts);
    
    // Scroll to products section
    document.querySelector('.featured-products').scrollIntoView({
        behavior: 'smooth'
    });
}

// Category filtering
function filterByCategory(category) {
    const filteredProducts = products.filter(product => product.category === category);
    renderProducts(filteredProducts);
    
    // Scroll to products section
    document.querySelector('.featured-products').scrollIntoView({
        behavior: 'smooth'
    });
}

// Newsletter subscription
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Simulate newsletter subscription
    if (email) {
        showNotification('Thank you for subscribing to our newsletter!');
        e.target.reset();
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-active');
    
    // Animate hamburger menu
    const spans = mobileMenuBtn.querySelectorAll('span');
    spans.forEach((span, index) => {
        span.style.transform = navLinks.classList.contains('mobile-active') 
            ? `rotate(${index === 0 ? 45 : index === 1 ? 0 : -45}deg) translate(${index === 0 ? 6 : 0}px, ${index === 0 ? 6 : index === 2 ? -6 : 0}px)`
            : 'none';
        span.style.opacity = index === 1 && navLinks.classList.contains('mobile-active') ? '0' : '1';
    });
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.category-card, .product-card').forEach(el => {
        observer.observe(el);
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
        }
        40%, 43% {
            transform: translate3d(0,-10px,0);
        }
        70% {
            transform: translate3d(0,-5px,0);
        }
        90% {
            transform: translate3d(0,-2px,0);
        }
    }
    
    .category-card.active {
        background: #ff6b6b;
        color: white;
        transform: translateY(-5px);
    }
    
    .category-card.active .category-icon {
        filter: brightness(0) invert(1);
    }
    
    .nav-links.mobile-active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        padding: 1rem;
        gap: 1rem;
    }
    
    @media (max-width: 768px) {
        .nav-links {
            display: none;
        }
        
        .nav-links.mobile-active {
            display: flex;
        }
    }
`;
document.head.appendChild(style);

// Initialize product filtering
function showAllProducts() {
    renderProducts(products);
    categoryCards.forEach(card => card.classList.remove('active'));
}

// Add a "Show All" functionality
document.addEventListener('DOMContentLoaded', function() {
    const showAllBtn = document.createElement('button');
    showAllBtn.textContent = 'Show All Products';
    showAllBtn.className = 'cta-btn';
    showAllBtn.style.margin = '2rem auto';
    showAllBtn.style.display = 'block';
    showAllBtn.addEventListener('click', showAllProducts);
    
    const featuredSection = document.querySelector('.featured-products .container');
    featuredSection.insertBefore(showAllBtn, productsGrid);
});

// Checkout functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('checkout-btn')) {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        
        // Simulate checkout process
        showNotification('Redirecting to checkout... (Demo)');
        setTimeout(() => {
            showNotification('Thank you for your purchase! (Demo)');
            cart = [];
            updateCartCount();
            closeCartModal();
        }, 2000);
    }
});

// Add loading states for better UX
function showLoadingState() {
    productsGrid.innerHTML = '<div style="text-align: center; padding: 2rem;">Loading products...</div>';
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showNotification('Something went wrong. Please try again.');
});

// Performance optimization: Lazy loading for images
function addLazyLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('.product-image').forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        imageObserver.observe(img);
    });
}

// Initialize lazy loading after products are rendered
const originalRenderProducts = renderProducts;
renderProducts = function(productsToRender) {
    originalRenderProducts(productsToRender);
    setTimeout(addLazyLoading, 100);
};