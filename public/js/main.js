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
        
        // Initialize skill bars
        this.initSkillBars();
        
        // Initialize animations
        this.initAnimations();
        
        // Set up intersection observers
        this.setupObservers();
        
        // Handle initial load
        this.handleInitialLoad();
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
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            const sectionId = window.location.hash.substring(1) || 'home';
            this.navigateToSection(sectionId);
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
            toggleButton.addEventListener('click', (e) => {
                e.stopPropagation();
                navLinks.classList.toggle('active');
                toggleButton.classList.toggle('active');
                
                // Toggle aria-expanded for accessibility
                const isExpanded = navLinks.classList.contains('active');
                toggleButton.setAttribute('aria-expanded', isExpanded);
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navLinks.contains(e.target) && !toggleButton.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
            
            // Close menu when clicking on a link
            navLinks.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });
            
            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileMenu();
                }
            });
        }
    }
    
    closeMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const toggleButton = document.querySelector('.nav-toggle');
        
        if (navLinks && toggleButton) {
            navLinks.classList.remove('active');
            toggleButton.classList.remove('active');
            toggleButton.setAttribute('aria-expanded', 'false');
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
                    const headerHeight = document.querySelector('.nav-3d').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    initSkillBars() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
            const percent = item.getAttribute('data-skill');
            const progressBar = item.querySelector('.skill-progress');
            
            if (progressBar) {
                progressBar.style.width = '0%';
                progressBar.dataset.targetWidth = `${percent}%`;
            }
        });
        
        // Observe skills section for animation
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateSkillBars();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(skillsSection);
        }
    }
    
    animateSkillBars() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach((item, index) => {
            setTimeout(() => {
                const progressBar = item.querySelector('.skill-progress');
                if (progressBar && progressBar.dataset.targetWidth) {
                    progressBar.style.width = progressBar.dataset.targetWidth;
                    progressBar.style.transition = 'width 1.5s cubic-bezier(0.65, 0, 0.35, 1)';
                }
            }, index * 100);
        });
    }
    
    initAnimations() {
        // Add hover effects to cards
        const cards = document.querySelectorAll('.project-card, .skills-category, .info-card, .about-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (window.innerWidth > 768) { // Only on desktop
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateY = ((x - centerX) / centerX) * 3;
                    const rotateX = ((centerY - y) / centerY) * 3;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
                    card.style.transition = 'transform 0.5s ease';
                }
            });
        });
    }
    
    setupObservers() {
        // Observe sections for animation triggers
        const sections = document.querySelectorAll('.section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Trigger specific animations based on section
                    switch(entry.target.id) {
                        case 'experience':
                            this.animateTimeline();
                            break;
                        case 'projects':
                            this.animateProjects();
                            break;
                    }
                }
            });
        }, { threshold: 0.1 });
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            }, index * 200);
        });
    }
    
    animateProjects() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            }, index * 150);
        });
    }
    
    handleInitialLoad() {
        // Remove loading screen
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.classList.add('loaded');
                
                // Set initial active section from URL
                const initialSection = window.location.hash.substring(1) || 'home';
                this.navigateToSection(initialSection);
            }, 1000);
        });
        
        // Handle images that fail to load
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', function() {
                console.warn('Image failed to load:', this.src);
                this.style.display = 'none';
                
                // Show placeholder if available
                const placeholder = this.nextElementSibling;
                if (placeholder && placeholder.classList.contains('image-placeholder')) {
                    placeholder.style.display = 'flex';
                }
            });
        });
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
        
        // Scroll to section
        this.scrollToSection(sectionId);
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
    
    scrollToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            const headerHeight = document.querySelector('.nav-3d').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus contact form
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
    });
    
    // Add performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfEntries = performance.getEntriesByType('navigation');
            if (perfEntries.length > 0) {
                const navTiming = perfEntries[0];
                console.log('Page load time:', navTiming.loadEventEnd - navTiming.loadEventStart, 'ms');
            }
        });
    }
    
    // Handle service worker registration for PWA (optional)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(
                (registration) => {
                    console.log('ServiceWorker registration successful');
                },
                (err) => {
                    console.log('ServiceWorker registration failed: ', err);
                }
            );
        });
    }
});

// Utility function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
