// Cart Management
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.updateCartBadge();
    }

    loadCart() {
        try {
            const cart = localStorage.getItem('cart');
            return cart ? JSON.parse(cart) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem('cart', JSON.stringify(this.cart));
            this.updateCartBadge();
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    addToCart(perfumeId, perfume, quantity = 1) {
        const existingItem = this.cart.find(item => item.perfume._id === perfumeId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                perfume: perfume,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.showNotification('Added to cart successfully!', 'success');
    }

    removeFromCart(perfumeId) {
        this.cart = this.cart.filter(item => item.perfume._id !== perfumeId);
        this.saveCart();
        this.showNotification('Removed from cart', 'info');
    }

    updateQuantity(perfumeId, quantity) {
        const item = this.cart.find(item => item.perfume._id === perfumeId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(perfumeId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.showNotification('Cart cleared', 'info');
    }

    getCart() {
        return this.cart;
    }

    getCartCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.perfume.price * item.quantity), 0);
    }

    updateCartBadge() {
        const count = this.getCartCount();
        const badges = document.querySelectorAll('.cart-badge');
        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="material-icons">${type === 'success' ? 'check_circle' : 'info'}</span>
            <span>${message}</span>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize cart manager
const cartManager = new CartManager();

// Global function to add to cart
async function addToCart(perfumeId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    try {
        // Fetch perfume details
        const response = await fetch(`/api/perfumes/${perfumeId}`);
        const data = await response.json();
        
        if (data.success) {
            cartManager.addToCart(perfumeId, data.data.perfume, 1);
        } else {
            cartManager.showNotification('Failed to add to cart', 'error');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        cartManager.showNotification('Error adding to cart', 'error');
    }
}

// Notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
.notification {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    border-radius: 999px;
    background: rgba(12, 15, 21, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
    color: var(--text-primary);
    font-weight: 600;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
    backdrop-filter: blur(24px);
}

.notification.show {
    opacity: 1;
    transform: translateY(0);
}

.notification-success {
    border-color: rgba(74, 222, 128, 0.35);
}

.notification-error {
    border-color: rgba(248, 113, 113, 0.35);
}

.notification-info {
    border-color: rgba(96, 165, 250, 0.35);
}

.notification .material-icons {
    font-size: 1.5rem;
}

.notification-success .material-icons {
    color: #86efac;
}

.notification-error .material-icons {
    color: #fca5a5;
}

.notification-info .material-icons {
    color: #93c5fd;
}

@media (max-width: 768px) {
    .notification {
        bottom: 1rem;
        right: 1rem;
        left: 1rem;
        max-width: calc(100% - 2rem);
    }
}
`;
document.head.appendChild(notificationStyles);

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { cartManager, addToCart };
}

