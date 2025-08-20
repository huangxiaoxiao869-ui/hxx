// 全局变量
let currentSlideIndex = 0;
let cart = [];
let slideInterval;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeSlider();
    initializeMobileNav();
    loadCartFromStorage();
    updateCartDisplay();
});

// 轮播图功能
function initializeSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    // 自动轮播
    slideInterval = setInterval(nextSlide, 5000);
    
    // 鼠标悬停时暂停轮播
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => clearInterval(slideInterval));
        heroSection.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');
    
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
}

function currentSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');
    
    currentSlideIndex = n - 1;
    
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
}

// 移动端导航
function initializeMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // 点击导航链接后关闭菜单
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 报名弹窗功能
function openRegistration(activityName) {
    const modal = document.getElementById('registrationModal');
    const activityNameInput = document.getElementById('activityName');
    
    if (modal && activityNameInput) {
        activityNameInput.value = activityName;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeRegistration() {
    const modal = document.getElementById('registrationModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // 重置表单
        document.getElementById('registrationForm').reset();
    }
}

// 点击弹窗外部关闭
window.addEventListener('click', function(event) {
    const registrationModal = document.getElementById('registrationModal');
    const cartModal = document.getElementById('cartModal');
    
    if (event.target === registrationModal) {
        closeRegistration();
    }
    if (event.target === cartModal) {
        closeCart();
    }
});

// 表单提交处理
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        activityName: document.getElementById('activityName').value,
        participantName: document.getElementById('participantName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        email: document.getElementById('email').value,
        age: document.getElementById('age').value,
        experience: document.getElementById('experience').value,
        submitTime: new Date().toLocaleString()
    };
    
    // 验证必填字段
    if (!formData.participantName || !formData.phoneNumber) {
        alert('请填写姓名和电话号码！');
        return;
    }
    
    // 验证电话号码格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
        alert('请输入正确的手机号码！');
        return;
    }
    
    // 模拟提交成功
    alert('报名成功！我们会尽快与您联系确认活动详情。');
    console.log('报名信息：', formData);
    
    // 关闭弹窗
    closeRegistration();
    
    // 这里可以添加实际的数据提交逻辑
    // submitRegistrationData(formData);
});

// 购物车功能
function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    // 保存到本地存储
    saveCartToStorage();
    
    // 更新显示
    updateCartDisplay();
    
    // 显示添加成功提示
    showNotification(`${productName} 已添加到购物车！`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToStorage();
    updateCartDisplay();
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        saveCartToStorage();
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    if (cartItems) {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">购物车是空的</p>';
        } else {
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div>
                        <strong>${item.name}</strong>
                        <br>
                        <small>¥${item.price} × ${item.quantity}</small>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button onclick="updateQuantity(${index}, -1)" style="background: #e74c3c; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer;">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)" style="background: #27ae60; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer;">+</button>
                        <button onclick="removeFromCart(${index})" style="background: #95a5a6; color: white; border: none; border-radius: 4px; padding: 2px 8px; cursor: pointer; font-size: 12px;">删除</button>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });
        }
    }
    
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total;
    }
}

function openCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('购物车是空的！');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`订单总金额：¥${total}\n\n感谢您的购买！我们会尽快为您安排发货。`);
    
    // 清空购物车
    cart = [];
    saveCartToStorage();
    updateCartDisplay();
    closeCart();
}

// 本地存储
function saveCartToStorage() {
    localStorage.setItem('cricketCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cricketCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// 通知提示
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 滚动效果
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// 页面加载动画
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

// 数字输入验证
document.addEventListener('input', function(e) {
    if (e.target.type === 'tel') {
        // 只允许数字和连字符
        e.target.value = e.target.value.replace(/[^\d-]/g, '');
    }
    
    if (e.target.type === 'number') {
        // 确保年龄在合理范围内
        if (e.target.id === 'age') {
            const value = parseInt(e.target.value);
            if (value < 8) e.target.value = 8;
            if (value > 80) e.target.value = 80;
        }
    }
});

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // ESC键关闭弹窗
    if (e.key === 'Escape') {
        const registrationModal = document.getElementById('registrationModal');
        const cartModal = document.getElementById('cartModal');
        
        if (registrationModal && registrationModal.style.display === 'block') {
            closeRegistration();
        }
        if (cartModal && cartModal.style.display === 'block') {
            closeCart();
        }
    }
});

// 性能优化：图片懒加载
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 初始化懒加载
if ('IntersectionObserver' in window) {
    lazyLoadImages();
}

// 错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误：', e.error);
});

// 页面可见性API - 暂停/恢复轮播
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        clearInterval(slideInterval);
    } else {
        slideInterval = setInterval(nextSlide, 5000);
    }
});

// 触摸事件支持（移动端）
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // 向左滑动 - 下一张
            nextSlide();
        } else {
            // 向右滑动 - 上一张
            const slides = document.querySelectorAll('.slide');
            if (slides.length > 0) {
                currentSlide(currentSlideIndex === 0 ? slides.length : currentSlideIndex);
            }
        }
    }
}
