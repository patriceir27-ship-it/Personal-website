// Main JavaScript file
class PortfolioApp {
    constructor() {
        this.init();
    }
    
    init() {
        this.initNavigation();
        this.initMobileMenu();
        this.initScrollAnimations();
        this.initSkillBars();
        this.initImageHandling();
        this.handleInitialLoad();
    }
    
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('href').substring(1);
                this.navigateToSection(sectionId);
                this.closeMobileMenu();
            });
        });
        
        window.addEventListener('popstate', () => {
            const sectionId = window.location.hash.substring(1) || 'home';
            this.navigateToSection(sectionId);
        });
    }
    
    initMobileMenu() {
        const toggleButton = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (toggleButton && navLinks) {
            toggleButton.addEventListener('click', (e) => {
                e.stopPropagation();
                navLinks.classList.toggle('active');
                toggleButton.classList.toggle('active');
            });
            
            document.addEventListener('click', (e) => {
                if (!navLinks.contains(e.target) && !toggleButton.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
            
            navLinks.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => this.closeMobileMenu());
            });
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeMobileMenu();
            });
        }
    }
    
    closeMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const toggleButton = document.querySelector('.nav-toggle');
        
        if (navLinks && toggleButton) {
            navLinks.classList.remove('active');
            toggleButton.classList.remove('active');
        }
    }
    
    initScrollAnimations() {
        // Animate timeline items
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200);
                }
            });
        }, { threshold: 0.2 });
        
        document.querySelectorAll('.timeline-item').forEach(item => {
            timelineObserver.observe(item);
        });
        
        // Update active nav link on scroll
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.5 });
        
        sections.forEach(section => sectionObserver.observe(section));
    }
    
    initSkillBars() {
        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return;
        
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkillBars();
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        skillObserver.observe(skillsSection);
    }
    
    animateSkillBars() {
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            setTimeout(() => {
                const progressBar = item.querySelector('.skill-progress');
                if (progressBar && progressBar.dataset.targetWidth) {
                    progressBar.style.width = progressBar.dataset.targetWidth;
                }
            }, index * 100);
        });
    }
    
    initImageHandling() {
        // Preload profile image
        const profileImg = document.getElementById('profile-img');
        const aboutImg = document.getElementById('about-profile-img');
        
        if (profileImg) {
            profileImg.onerror = function() {
                this.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'avatar-placeholder';
                placeholder.innerHTML = '<i class="fas fa-user-astronaut"></i>';
                this.parentNode.appendChild(placeholder);
            };
        }
        
        if (aboutImg) {
            aboutImg.onerror = function() {
                this.style.display = 'none';
                const placeholder = document.getElementById('about-placeholder');
                if (placeholder) placeholder.style.display = 'flex';
            };
        }
    }
    
    navigateToSection(sectionId) {
        history.pushState(null, null, `#${sectionId}`);
        
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            const headerHeight = document.querySelector('.nav-3d').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    handleInitialLoad() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.classList.add('loaded');
                
                // Set initial section from URL
                const initialSection = window.location.hash.substring(1) || 'home';
                this.navigateToSection(initialSection);
            }, 1000);
        });
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});
