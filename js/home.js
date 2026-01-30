// Home Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Category filter functionality
    const categoryButtons = document.querySelectorAll('.category-btn');
    const foodCategories = document.querySelectorAll('.food-category');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedCategory = this.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-orange-500', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            this.classList.add('active', 'bg-orange-500', 'text-white');
            this.classList.remove('bg-gray-200', 'text-gray-700');

            // Filter food categories
            foodCategories.forEach(category => {
                if (selectedCategory === 'all') {
                    category.style.display = 'block';
                } else {
                    const categoryType = category.getAttribute('data-category');
                    if (categoryType === selectedCategory) {
                        category.style.display = 'block';
                    } else {
                        category.style.display = 'none';
                    }
                }
            });

            // Scroll to menu section
            document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const foodCards = document.querySelectorAll('.food-card');

            foodCards.forEach(card => {
                const foodName = card.querySelector('h3').textContent.toLowerCase();
                const foodDescription = card.querySelector('p').textContent.toLowerCase();
                
                if (foodName.includes(searchTerm) || foodDescription.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Update cart count on page load
    if (typeof cartManager !== 'undefined') {
        cartManager.updateCartCount();
        loadCartItems();
    }

    // Cart Modal Functionality
    const cartModal = document.getElementById('cart-modal');
    const cartIconBtn = document.getElementById('cart-icon-btn');
    const mobileCartBtn = document.getElementById('mobile-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const closeCartBtnBottom = document.getElementById('close-cart-btn-bottom');
    const cartBackdrop = document.getElementById('cart-backdrop');

    // Open cart modal
    function openCartModal() {
        if (cartModal) {
            document.body.classList.add('cart-open');
            cartModal.classList.remove('hidden');
            setTimeout(() => {
                const cartSidebar = document.getElementById('cart-sidebar');
                if (cartSidebar) {
                    cartSidebar.classList.remove('translate-x-full');
                }
            }, 10);
            loadCartItems();
        }
    }

    // Close cart modal
    function closeCartModal() {
        if (cartModal) {
            const cartSidebar = document.getElementById('cart-sidebar');
            if (cartSidebar) {
                cartSidebar.classList.add('translate-x-full');
            }
            setTimeout(() => {
                cartModal.classList.add('hidden');
                document.body.classList.remove('cart-open');
            }, 300);
        }
    }

    // Event listeners for opening cart
    if (cartIconBtn) {
        cartIconBtn.addEventListener('click', openCartModal);
    }
    if (mobileCartBtn) {
        mobileCartBtn.addEventListener('click', function() {
            // Close mobile menu first
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
            openCartModal();
        });
    }

    // Event listeners for closing cart
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCartModal);
    }
    if (closeCartBtnBottom) {
        closeCartBtnBottom.addEventListener('click', closeCartModal);
    }
    if (cartBackdrop) {
        cartBackdrop.addEventListener('click', closeCartModal);
    }

    // Load and display cart items
    function loadCartItems() {
        const cartItemsContainer = document.getElementById('cart-items-container');
        if (!cartItemsContainer) return;

        const cartItems = cartManager.getCartItems();

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="text-center py-12 text-gray-500">
                    <i class="fas fa-shopping-cart text-5xl mb-4 text-gray-300"></i>
                    <p class="text-lg mb-2">Your cart is empty</p>
                    <p class="text-sm">Add some delicious items to get started!</p>
                </div>
            `;
            updateCartTotals();
            return;
        }

        cartItemsContainer.innerHTML = cartItems.map(item => `
            <div class="cart-item mb-4 pb-4 border-b border-gray-200 last:border-0" data-name="${item.name}">
                <div class="flex items-start space-x-3">
                    <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg flex-shrink-0">
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-gray-800 mb-1">${item.name}</h3>
                        <p class="text-orange-500 font-bold mb-2">$${parseFloat(item.price).toFixed(2)}</p>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <button class="cart-quantity-btn decrease bg-gray-200 hover:bg-gray-300 w-7 h-7 rounded-full flex items-center justify-center transition text-sm" data-name="${item.name}">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="cart-quantity w-8 text-center font-semibold">${item.quantity}</span>
                                <button class="cart-quantity-btn increase bg-gray-200 hover:bg-gray-300 w-7 h-7 rounded-full flex items-center justify-center transition text-sm" data-name="${item.name}">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <div class="flex items-center space-x-2">
                                <span class="font-bold text-gray-800">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                                <button class="cart-remove-btn text-red-500 hover:text-red-700 ml-2 transition" data-name="${item.name}" title="Remove">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Attach event listeners to cart items
        attachCartEventListeners();
        updateCartTotals();
    }

    // Attach event listeners to cart item buttons
    function attachCartEventListeners() {
        // Decrease quantity
        document.querySelectorAll('.cart-quantity-btn.decrease').forEach(button => {
            button.addEventListener('click', function() {
                const itemName = this.getAttribute('data-name');
                const item = cartManager.getCartItems().find(i => i.name === itemName);
                if (item) {
                    cartManager.updateQuantity(itemName, item.quantity - 1);
                    loadCartItems();
                    cartManager.updateCartCount();
                }
            });
        });

        // Increase quantity
        document.querySelectorAll('.cart-quantity-btn.increase').forEach(button => {
            button.addEventListener('click', function() {
                const itemName = this.getAttribute('data-name');
                const item = cartManager.getCartItems().find(i => i.name === itemName);
                if (item) {
                    cartManager.updateQuantity(itemName, item.quantity + 1);
                    loadCartItems();
                    cartManager.updateCartCount();
                }
            });
        });

        // Remove item
        document.querySelectorAll('.cart-remove-btn').forEach(button => {
            button.addEventListener('click', function() {
                const itemName = this.getAttribute('data-name');
                cartManager.removeItem(itemName);
                loadCartItems();
                cartManager.updateCartCount();
            });
        });
    }

    // Update cart totals
    function updateCartTotals() {
        const subtotal = cartManager.getCartTotal();
        const deliveryFee = 2.99;
        const tax = subtotal * 0.08;
        const total = subtotal + deliveryFee + tax;

        const subtotalEl = document.getElementById('cart-subtotal');
        const taxEl = document.getElementById('cart-tax');
        const totalEl = document.getElementById('cart-total');

        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

        // Update view cart button
        const viewCartBtn = document.getElementById('view-cart-btn');
        if (viewCartBtn) {
            if (cartManager.getCartItems().length === 0) {
                viewCartBtn.classList.add('opacity-50', 'cursor-not-allowed');
                viewCartBtn.href = '#';
                viewCartBtn.onclick = (e) => {
                    e.preventDefault();
                    closeCartModal();
                };
            } else {
                viewCartBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                viewCartBtn.href = 'order.html';
            }
        }
    }

    // Listen for cart updates
    window.addEventListener('cartUpdated', function() {
        // Refresh cart items if modal is open
        const cartModal = document.getElementById('cart-modal');
        if (cartModal && !cartModal.classList.contains('hidden')) {
            loadCartItems();
        }
    });
});