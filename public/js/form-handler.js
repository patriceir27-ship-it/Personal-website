// Contact form handler with Netlify Functions
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.formMessage = document.getElementById('form-message');
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Add input validation
        this.addInputValidation();
    }
    
    addInputValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateInput(input);
            });
            
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
        });
    }
    
    validateInput(input) {
        const value = input.value.trim();
        
        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showInputError(input, 'Please enter a valid email address');
                return false;
            }
        }
        
        if (input.required && !value) {
            this.showInputError(input, 'This field is required');
            return false;
        }
        
        this.clearInputError(input);
        return true;
    }
    
    showInputError(input, message) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;
        
        // Remove existing error
        this.clearInputError(input);
        
        // Add error class
        formGroup.classList.add('error');
        
        // Create error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#ff5252';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '0.5rem';
        
        formGroup.appendChild(errorElement);
    }
    
    clearInputError(input) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;
        
        formGroup.classList.remove('error');
        
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }
    
    async handleSubmit() {
        // Validate all inputs
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showFormMessage('Please fill in all required fields correctly', 'error');
            return;
        }
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitButton = this.form.querySelector('.btn-submit');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        try {
            // Send to Netlify Function
            const response = await fetch('/.netlify/functions/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                this.showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                this.form.reset();
                
                // Trigger confetti animation
                this.triggerConfetti();
            } else {
                throw new Error(result.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormMessage(error.message || 'Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }
    
    showFormMessage(message, type) {
        if (!this.formMessage) return;
        
        this.formMessage.textContent = message;
        this.formMessage.className = `form-message ${type}`;
        this.formMessage.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.formMessage.style.display = 'none';
        }, 5000);
    }
    
    triggerConfetti() {
        // Create confetti particles
        const colors = ['#667eea', '#764ba2', '#00dbde', '#fc00ff'];
        const particleCount = 150;
        
        for (let i = 0; i < particleCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-particle';
            
            // Random properties
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 10 + 5;
            const startX = Math.random() * window.innerWidth;
            const startY = -50;
            const endY = window.innerHeight + 50;
            const rotation = Math.random() * 360;
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 1;
            
            // Set styles
            confetti.style.position = 'fixed';
            confetti.style.left = `${startX}px`;
            confetti.style.top = `${startY}px`;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.background = color;
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1000';
            confetti.style.opacity = '0.8';
            confetti.style.transform = `rotate(${rotation}deg)`;
            
            // Add to DOM
            document.body.appendChild(confetti);
            
            // Animate confetti
            confetti.animate([
                { 
                    transform: `translate(0, 0) rotate(${rotation}deg)`,
                    opacity: 0.8 
                },
                { 
                    transform: `translate(${(Math.random() - 0.5) * 200}px, ${endY}px) rotate(${rotation + 360}deg)`,
                    opacity: 0 
                }
            ], {
                duration: duration * 1000,
                delay: delay * 1000,
                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
                fill: 'forwards'
            }).onfinish = () => confetti.remove();
        }
    }
}

// Initialize form handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = new ContactForm();
});
