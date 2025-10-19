// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollEffects();
    initContactForm();
    initAnimations();
    initProductInteractions();
});

// Navigation
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Effects
function initScrollEffects() {
    const scrollTopBtn = document.getElementById('scroll-top');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.service-card, .product-card, .testimonial-card, .stat-item');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        if (validateForm(formObject)) {
            showFormMessage('شکریہ! ہم جلد آپ سے رابطہ کریں گے۔ Thank you! We will contact you soon.', 'success');
            contactForm.reset();
        }
    });

    function validateForm(data) {
        const requiredFields = ['name', 'email', 'phone', 'service', 'message'];
        let isValid = true;

        for (let field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                showFormMessage(`برائے مہربانی ${field} فیلڈ پُر کریں۔ Please fill the ${field} field.`, 'error');
                isValid = false;
                break;
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.email && !emailRegex.test(data.email)) {
            showFormMessage('برائے مہربانی درست ای میل لکھیں۔ Please enter a valid email.', 'error');
            isValid = false;
        }

        return isValid;
    }

    function showFormMessage(message, type) {
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        
        messageDiv.style.cssText = `
            padding: 1.2rem;
            margin-bottom: 1.5rem;
            border-radius: 12px;
            font-weight: 600;
            text-align: center;
            animation: slideDown 0.3s ease;
            ${type === 'success' 
                ? 'background: linear-gradient(135deg, #dcfce7, #bbf7d0); color: #166534; border: 2px solid #86efac;' 
                : 'background: linear-gradient(135deg, #fef2f2, #fecaca); color: #dc2626; border: 2px solid #fca5a5;'
            }
        `;

        contactForm.insertBefore(messageDiv, contactForm.firstChild);

        setTimeout(() => {
            messageDiv.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }

    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

// Animations
function initAnimations() {
    const counters = document.querySelectorAll('.stat-number, .hero-stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        const increment = target / 100;
        let current = 0;
        const hasPercent = counter.textContent.includes('%');
        const hasPlus = counter.textContent.includes('+');
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target.toLocaleString() + (hasPercent ? '%' : '') + (hasPlus ? '+' : '');
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current).toLocaleString() + (hasPercent ? '%' : '') + (hasPlus ? '+' : '');
            }
        }, 20);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // Parallax effect
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const heroImage = document.querySelector('.hero-image');
                
                if (heroImage && scrolled < window.innerHeight) {
                    heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Product Interactions
function initProductInteractions() {
    const productBtns = document.querySelectorAll('.product-btn');
    
    productBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            
            showNotification(`مزید معلومات کے لیے ہم سے رابطہ کریں: ${productName} | Contact us for: ${productName}`, 'success');
            
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> پیغام بھیجا گیا!';
            this.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.style.background = '';
            }, 2500);
        });
    });

    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1.2rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 400px;
        ${type === 'success' 
            ? 'background: linear-gradient(135deg, #10b981, #059669); color: white;' 
            : 'background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white;'
        }
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 4000);
}

// Smooth Reveal on Scroll
function revealOnScroll() {
    const reveals = document.querySelectorAll('.service-card, .product-card, .testimonial-card');
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        const navMenu = document.getElementById('nav-menu');
        
        if (navMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Loading Animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add CSS Animations
const additionalStyles = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }

    .service-card, .product-card, .testimonial-card {
        will-change: transform, opacity;
    }

    .form-group.focused input,
    .form-group.focused select,
    .form-group.focused textarea {
        border-color: #3b82f6;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    .hero-image i {
        animation: floatPhone 3s ease-in-out infinite;
    }

    @keyframes floatPhone {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-20px);
        }
    }

    .service-icon {
        animation: iconBounce 2s ease-in-out infinite;
    }

    @keyframes iconBounce {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }

    .product-badge {
        animation: badgePulse 2s ease-in-out infinite;
    }

    @keyframes badgePulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }

    .testimonial-card::before {
        animation: fadeQuote 3s ease-in-out infinite;
    }

    @keyframes fadeQuote {
        0%, 100% {
            opacity: 0.3;
        }
        50% {
            opacity: 0.5;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// WhatsApp Integration
const whatsappLinks = document.querySelectorAll('a[href*="whatsapp"]');
whatsappLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const phoneNumber = '+923444037806';
        const message = 'السلام علیکم! میں SuperFix کے بارے میں معلومات چاہتا ہوں۔ | Hello! I want to know about SuperFix services.';
        this.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    });
});

// Phone Call Tracking
const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
phoneLinks.forEach(link => {
    link.addEventListener('click', function() {
        showNotification('ہم سے رابطہ کرنے کا شکریہ! | Thank you for calling SuperFix!', 'success');
    });
});

// Service Card Hover Effects
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
    
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-12px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Testimonial Card Effects
const testimonialCards = document.querySelectorAll('.testimonial-card');
testimonialCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.15}s`;
});

// Enhanced Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.section-header').forEach(header => {
    header.style.opacity = '0';
    header.style.transform = 'translateY(30px)';
    header.style.transition = 'all 0.8s ease';
    fadeInObserver.observe(header);
});


// Console Welcome Message
console.log('%c☎️ Email: thedaniyalhassan@gmail.com', 'font-size: 12px; color: #10b981;');
console.log('%c☎️ Contact: +92-3028912704', 'font-size: 12px; color: #10b981;');