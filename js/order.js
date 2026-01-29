// Order Details Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Load and display order items
    function loadOrderItems() {
        const orderItemsContainer = document.getElementById('order-items');
        const cartItems = cartManager.getCartItems();

        if (cartItems.length === 0) {
            orderItemsContainer.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-shopping-cart text-4xl mb-4"></i>
                    <p>Your cart is empty</p>
                    <a href="index.html" class="text-orange-500 hover:text-orange-600 mt-4 inline-block">Continue Shopping</a>
                </div>
            `;
            updatePricing();
            return;
        }

        orderItemsContainer.innerHTML = cartItems.map(item => `
            <div class="order-item flex items-center justify-between p-4 border-b border-gray-200" data-name="${item.name}">
                <div class="flex items-center space-x-4 flex-1">
                    <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg">
                    <div>
                        <h3 class="font-semibold text-gray-800 text-lg">${item.name}</h3>
                        <p class="text-orange-500 font-bold">$${parseFloat(item.price).toFixed(2)}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2">
                        <button class="quantity-btn decrease bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center transition" data-name="${item.name}">
                            <i class="fas fa-minus text-xs"></i>
                        </button>
                        <span class="quantity w-12 text-center font-semibold">${item.quantity}</span>
                        <button class="quantity-btn increase bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center transition" data-name="${item.name}">
                            <i class="fas fa-plus text-xs"></i>
                        </button>
                    </div>
                    <div class="text-right min-w-[80px]">
                        <p class="font-bold text-gray-800">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                    <button class="remove-item text-red-500 hover:text-red-700 ml-4 transition" data-name="${item.name}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Attach event listeners
        attachEventListeners();
        updatePricing();
    }

    // Attach event listeners to quantity buttons and remove buttons
    function attachEventListeners() {
        // Decrease quantity
        document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
            button.addEventListener('click', function() {
                const itemName = this.getAttribute('data-name');
                const item = cartManager.getCartItems().find(i => i.name === itemName);
                if (item) {
                    cartManager.updateQuantity(itemName, item.quantity - 1);
                    loadOrderItems();
                }
            });
        });

        // Increase quantity
        document.querySelectorAll('.quantity-btn.increase').forEach(button => {
            button.addEventListener('click', function() {
                const itemName = this.getAttribute('data-name');
                const item = cartManager.getCartItems().find(i => i.name === itemName);
                if (item) {
                    cartManager.updateQuantity(itemName, item.quantity + 1);
                    loadOrderItems();
                }
            });
        });

        // Remove item
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const itemName = this.getAttribute('data-name');
                cartManager.removeItem(itemName);
                loadOrderItems();
            });
        });
    }

    // Update pricing breakdown
    function updatePricing() {
        const subtotal = cartManager.getCartTotal();
        const deliveryFee = 2.99;
        const tax = subtotal * 0.08;
        const total = subtotal + deliveryFee + tax;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('delivery-fee').textContent = `$${deliveryFee.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;

        // Enable/disable checkout button
        const checkoutBtn = document.getElementById('proceed-checkout');
        if (cartManager.getCartItems().length === 0) {
            checkoutBtn.disabled = true;
        } else {
            checkoutBtn.disabled = false;
        }
    }

    // Proceed to checkout
    const checkoutBtn = document.getElementById('proceed-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cartManager.getCartItems().length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Empty Cart',
                    text: 'Your cart is empty! Please add items to proceed.',
                    confirmButtonColor: '#f97316'
                });
                return;
            }
            
            showCheckoutModal();
        });
    }

    // Show checkout modal with order details
    function showCheckoutModal() {
        const cartItems = cartManager.getCartItems();
        const subtotal = cartManager.getCartTotal();
        const deliveryFee = 2.99;
        const tax = subtotal * 0.08;
        const total = subtotal + deliveryFee + tax;

        // Generate order items HTML
        const orderItemsHTML = cartItems.map(item => `
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
                <div class="flex items-center space-x-3 flex-1">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                    <div>
                        <h4 class="font-semibold text-gray-800">${item.name}</h4>
                        <p class="text-sm text-gray-500">Qty: ${item.quantity} × $${parseFloat(item.price).toFixed(2)}</p>
                    </div>
                </div>
                <p class="font-bold text-gray-800">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
            </div>
        `).join('');

        // Generate pricing breakdown HTML
        const pricingHTML = `
            <div class="mt-4 space-y-2 pt-4 border-t border-gray-300">
                <div class="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-gray-700">
                    <span>Delivery Fee</span>
                    <span>$${deliveryFee.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-gray-700">
                    <span>Tax (8%)</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
                <div class="flex justify-between pt-2 border-t border-gray-300">
                    <span class="text-lg font-bold text-gray-800">Total</span>
                    <span class="text-lg font-bold text-orange-500">$${total.toFixed(2)}</span>
                </div>
            </div>
        `;

        // Complete checkout modal HTML
        const checkoutHTML = `
            <div class="text-left">
                <div class="mb-4">
                    <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-shopping-bag text-orange-500 mr-2"></i>
                        Order Summary
                    </h3>
                    <div class="max-h-64 overflow-y-auto">
                        ${orderItemsHTML}
                    </div>
                </div>
                ${pricingHTML}
                <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p class="text-sm text-gray-600">
                        <i class="fas fa-info-circle text-blue-500 mr-2"></i>
                        Your order will be delivered within 30-45 minutes.
                    </p>
                </div>
            </div>
        `;

        Swal.fire({
            title: '<strong>Review Your Order</strong>',
            html: checkoutHTML,
            width: '600px',
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-check mr-2"></i>Place Order',
            cancelButtonText: '<i class="fas fa-times mr-2"></i>Cancel',
            confirmButtonColor: '#f97316',
            cancelButtonColor: '#6b7280',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-lg',
                title: 'text-left mb-4',
                htmlContainer: 'text-left',
                confirmButton: 'px-6 py-3 rounded-lg font-semibold',
                cancelButton: 'px-6 py-3 rounded-lg font-semibold'
            },
            didOpen: () => {
                // Add custom styling
                const popup = Swal.getPopup();
                if (popup) {
                    popup.style.fontFamily = 'inherit';
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                placeOrder();
            }
        });
    }

    // Place order and show success alert
    function placeOrder() {
        const cartItems = cartManager.getCartItems();
        const total = cartManager.getCartTotal() + 2.99 + (cartManager.getCartTotal() * 0.08);
        const orderNumber = 'ORD-' + Date.now().toString().slice(-6);

        // Show loading state
        Swal.fire({
            title: 'Processing your order...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Simulate order processing
        setTimeout(() => {
            Swal.fire({
                icon: 'success',
                title: '<strong>Order Placed Successfully!</strong>',
                html: `
                    <div class="text-center">
                        <div class="mb-4">
                            <i class="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
                        </div>
                        <p class="text-lg text-gray-700 mb-2">Thank you for your order!</p>
                        <p class="text-sm text-gray-600 mb-4">Order Number: <strong class="text-orange-500">${orderNumber}</strong></p>
                        <div class="bg-gray-50 p-4 rounded-lg mb-4">
                            <p class="text-sm text-gray-600 mb-2"><strong>Order Details:</strong></p>
                            <p class="text-sm text-gray-600">Total Items: ${cartItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
                            <p class="text-sm text-gray-600">Total Amount: <strong class="text-orange-500">$${total.toFixed(2)}</strong></p>
                        </div>
                        <p class="text-sm text-gray-500">You will receive a confirmation email shortly.</p>
                    </div>
                `,
                confirmButtonText: '<i class="fas fa-check mr-2"></i>Done',
                confirmButtonColor: '#f97316',
                allowOutsideClick: false,
                customClass: {
                    popup: 'rounded-lg',
                    title: 'text-center',
                    htmlContainer: 'text-center',
                    confirmButton: 'px-8 py-3 rounded-lg font-semibold'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    // Clear cart and redirect to home
                    cartManager.clearCart();
                    window.location.href = 'index.html';
                }
            });
        }, 1500);
    }

    // Initial load
    loadOrderItems();
    cartManager.updateCartCount();
});