// Cart Management System
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.updateCartCount();
    }

    // Load cart from localStorage
    loadCart() {
        const cartData = localStorage.getItem('foodCart');
        return cartData ? JSON.parse(cartData) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('foodCart', JSON.stringify(this.cart));
        this.updateCartCount();
        // Dispatch custom event for cart update
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        }
    }

    // Add item to cart
    addItem(item) {
        const existingItem = this.cart.find(cartItem => cartItem.name === item.name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...item,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.showNotification('Item added to cart!');
    }

    // Remove item from cart
    removeItem(itemName) {
        this.cart = this.cart.filter(item => item.name !== itemName);
        this.saveCart();
        this.showNotification('Item removed from cart');
    }

    // Update item quantity
    updateQuantity(itemName, newQuantity) {
        const item = this.cart.find(cartItem => cartItem.name === itemName);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(itemName);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
            }
        }
    }

    // Get cart count
    getCartCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Get cart total
    getCartTotal() {
        return this.cart.reduce((total, item) => {
            return total + (parseFloat(item.price) * item.quantity);
        }, 0);
    }

    // Update cart count display
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('#cart-count');
        const count = this.getCartCount();
        cartCountElements.forEach(element => {
            element.textContent = count;
            if (count === 0) {
                element.style.display = 'none';
            } else {
                element.style.display = 'flex';
            }
        });
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    // Show notification
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Get all cart items
    getCartItems() {
        return this.cart;
    }
}

// Initialize cart manager
const cartManager = new CartManager();

// Add to cart button functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle Add to Cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const item = {
                name: this.getAttribute('data-name'),
                price: this.getAttribute('data-price'),
                image: this.getAttribute('data-image')
            };
            cartManager.addItem(item);
        });
    });

    // Handle Buy Now buttons
    document.querySelectorAll('.buy-now-btn').forEach(button => {
        button.addEventListener('click', function() {
            const item = {
                name: this.getAttribute('data-name'),
                price: this.getAttribute('data-price'),
                image: this.getAttribute('data-image')
            };
            cartManager.clearCart(); // Clear cart for buy now
            cartManager.addItem(item);
            window.location.href = 'order.html';
        });
    });
});