// Main JavaScript file
class PortfolioApp {
    constructor() {
        this.currentSection = 'home';
        this.init();
    }
    
    init() {
        // Initialize navigation
        this.initNavigation();
        
        // Initialize section transitions
        this.initSectionTransitions();
        
        // Initialize mobile menu
        this.initMobileMenu();
        
        // Initialize smooth scrolling
        this.initSmoothScrolling();
        
        // Initialize theme
        this.initTheme();
        
        // Initialize analytics (optional)
        this.initAnalytics();
    }
    
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('href').substring(1);
                this.navigateToSection(sectionId);
                
                // Close mobile menu if open
                this.closeMobileMenu();
            });
        });
    }
    
    initSectionTransitions() {
        // Store all sections
        this.sections = document.querySelectorAll('.section');
        
        // Show home section by default
        this.showSection('home');
    }
    
    initMobileMenu() {
        const toggleButton = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (toggleButton && navLinks) {
            toggleButton.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                toggleButton.classList.toggle('active');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navLinks.contains(e.target) && !toggleButton.contains(e.target)) {
                    navLinks.classList.remove('active');
                    toggleButton.classList.remove('active');
                }
            });
        }
    }
    
    initSmoothScrolling() {
        // Add smooth scroll to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    initTheme() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme) {
            document.body.classList.add(savedTheme);
        }
        
        // Add theme toggle in the future if needed
    }
    
    initAnalytics() {
        // Simple page view tracking
        this.trackPageView();
        
        // Track section views
        this.trackSectionViews();
        
        // Track form submissions
        this.trackFormSubmissions();
    }
    
    trackPageView() {
        // You can integrate with Google Analytics or similar here
        console.log('Page viewed:', window.location.pathname);
    }
    
    trackSectionViews() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Section viewed:', entry.target.id);
                    // Send to analytics service
                }
            });
        }, { threshold: 0.5 });
        
        this.sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    trackFormSubmissions() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', () => {
                console.log('Form submitted');
                // Send to analytics service
            });
        }
    }
    
    navigateToSection(sectionId) {
        // Update URL hash without scrolling
        history.pushState(null, null, `#${sectionId}`);
        
        // Update current section
        this.currentSection = sectionId;
        
        // Show section
        this.showSection(sectionId);
        
        // Update active nav link
        this.updateActiveNavLink(sectionId);
    }
    
    showSection(sectionId) {
        // Hide all sections
        this.sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Scroll to section
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    }
    
    updateActiveNavLink(sectionId) {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    closeMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const toggleButton = document.querySelector('.nav-toggle');
        
        if (navLinks && toggleButton) {
            navLinks.classList.remove('active');
            toggleButton.classList.remove('active');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const sectionId = window.location.hash.substring(1) || 'home';
        app.navigateToSection(sectionId);
    });
    
    // Load initial section from URL
    const initialSection = window.location.hash.substring(1) || 'home';
    app.navigateToSection(initialSection);
    
    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Remove loading screen if exists
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, 500);
        }
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus search/contact
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                app.navigateToSection('contact');
                const contactForm = document.getElementById('contact-form');
                if (contactForm) {
                    const firstInput = contactForm.querySelector('input');
                    if (firstInput) firstInput.focus();
                }
            }
        }
        
        // Escape to close mobile menu
        if (e.key === 'Escape') {
            app.closeMobileMenu();
        }
    });
    
    // Add performance monitoring
    if ('performance' in window) {
        const perfEntries = performance.getEntriesByType('navigation');
        if (perfEntries.length > 0) {
            const navTiming = perfEntries[0];
            console.log('Page load time:', navTiming.loadEventEnd - navTiming.loadEventStart, 'ms');
        }
    }
});
