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
    
    animate
