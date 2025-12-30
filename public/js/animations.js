// Scroll animations and interactions
class ScrollAnimations {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.skillItems = document.querySelectorAll('.skill-item');
        this.projectCards = document.querySelectorAll('.project-card');
        this.timelineItems = document.querySelectorAll('.timeline-item');
        
        this.init();
    }
    
    init() {
        // Initialize Intersection Observer for animations
        this.initIntersectionObserver();
        
        // Initialize scroll events
        this.initScrollEvents();
        
        // Initialize skill bar animations
        this.initSkillBars();
        
        // Initialize hover effects
        this.initHoverEffects();
    }
    
    initIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Animate skill bars in skills section
                    if (entry.target.id === 'skills') {
                        this.animateSkillBars();
                    }
                    
                    // Animate timeline items
                    if (entry.target.id === 'experience') {
                        this.animateTimeline();
                    }
                    
                    // Animate project cards
                    if (entry.target.id === 'projects') {
                        this.animateProjects();
                    }
                }
            });
        }, observerOptions);
        
        // Observe all sections
        this.sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    initScrollEvents() {
        // Update active nav link on scroll
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.scrollY + 100;
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
        });
    }
    
    initSkillBars() {
        // Store initial widths
        this.skillItems.forEach(item => {
            const percent = item.getAttribute('data-skill');
            const progressBar = item.querySelector('.skill-progress');
            progressBar.style.width = '0%';
            progressBar.dataset.targetWidth = `${percent}%`;
        });
    }
    
    animateSkillBars() {
        this.skillItems.forEach((item, index) => {
            setTimeout(() => {
                const progressBar = item.querySelector('.skill-progress');
                const targetWidth = progressBar.dataset.targetWidth;
                
                progressBar.style.width = targetWidth;
                progressBar.style.transition = 'width 1.5s cubic-bezier(0.65, 0, 0.35, 1)';
                
                // Add shine effect
                progressBar.innerHTML = '<div class="skill-shine"></div>';
            }, index * 200);
        });
    }
    
    animateTimeline() {
        this.timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 300);
        });
    }
    
    animateProjects() {
        this.projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    initHoverEffects() {
        // Add 3D hover effect to cards
        const cards = document.querySelectorAll('.project-card, .skill-category, .info-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = ((x - centerX) / centerX) * 5;
                const rotateX = ((centerY - y) / centerY) * 5;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
                card.style.transition = 'transform 0.5s ease';
            });
        });
    }
}

// Floating particles on click
class ClickParticles {
    constructor() {
        this.particleCount = 30;
        this.init();
    }
    
    init() {
        document.addEventListener('click', (e) => {
            this.createParticles(e.clientX, e.clientY);
        });
        
        // Add particles to interactive elements
        const interactiveElements = document.querySelectorAll('.btn-primary, .btn-secondary, .social-icon, .project-link');
        
        interactiveElements.forEach(element => {
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                const rect = element.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                this.createParticles(x, y);
            });
        });
    }
    
    createParticles(x, y) {
        const colors = ['#667eea', '#764ba2', '#00dbde', '#fc00ff'];
        
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'click-particle';
            
            // Random properties
            const size = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 2;
            const distance = Math.random() * 100 + 50;
            
            // Set initial position
            particle.style.position = 'fixed';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = color;
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            particle.style.opacity = '0.8';
            
            // Add to DOM
            document.body.appendChild(particle);
            
            // Animate particle
            let posX = 0;
            let posY = 0;
            const animation = setInterval(() => {
                posX += Math.cos(angle) * speed;
                posY += Math.sin(angle) * speed;
                
                particle.style.left = `${x + posX}px`;
                particle.style.top = `${y + posY}px`;
                particle.style.opacity = parseFloat(particle.style.opacity) - 0.02;
                
                // Remove particle when animation is complete
                if (parseFloat(particle.style.opacity) <= 0 || 
                    Math.abs(posX) > distance || 
                    Math.abs(posY) > distance) {
                    clearInterval(animation);
                    particle.remove();
                }
            }, 16);
        }
    }
}

// Typing animation for home title
class TypingAnimation {
    constructor() {
        this.titleElement = document.querySelector('.title-name');
        this.originalText = this.titleElement ? this.titleElement.textContent : '';
        this.init();
    }
    
    init() {
        if (!this.titleElement) return;
        
        // Clear text for typing effect
        this.titleElement.textContent = '';
        
        // Start typing animation after a delay
        setTimeout(() => {
            this.typeText(0);
        }, 1000);
    }
    
    typeText(index) {
        if (index < this.originalText.length) {
            this.titleElement.textContent += this.originalText.charAt(index);
            index++;
            
            // Random typing speed
            const speed = Math.random() * 50 + 50;
            setTimeout(() => this.typeText(index), speed);
        }
    }
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animations
    const scrollAnimations = new ScrollAnimations();
    
    // Initialize click particles
    const clickParticles = new ClickParticles();
    
    // Initialize typing animation
    const typingAnimation = new TypingAnimation();
    
    // Add parallax effect to floating shapes
    const shapes = document.querySelectorAll('.shape');
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        shapes.forEach(shape => {
            const depth = parseFloat(shape.getAttribute('data-depth')) || 0.2;
            const x = (mouseX - 0.5) * depth * 100;
            const y = (mouseY - 0.5) * depth * 100;
            
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
    
    // Add scroll-based parallax to sections
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        const background = document.querySelector('#threejs-background');
        if (background) {
            background.style.transform = `translate3d(0px, ${rate}px, 0px)`;
        }
    });
});
