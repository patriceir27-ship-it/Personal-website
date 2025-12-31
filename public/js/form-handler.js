// Contact form handler for Formspree
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.formMessage = document.getElementById('form-message');
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        this.addInputValidation();
    }
    
    addInputValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateInput(input);
            });
        });
    }
    
    validateInput(input) {
        const value = input.value.trim();
        
        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showInputError(input, 'Please enter a valid email');
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
            this.showFormMessage('Please fill all required fields', 'error');
            return;
        }
        
        // Get form data
        const formData = new FormData(this.form);
        
        // Show loading
        const submitBtn = this.form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Submit to Formspree
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                this.showFormMessage('Message sent successfully!', 'success');
                this.form.reset();
                this.triggerConfetti();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            this.showFormMessage('Failed to send. Please email me directly.', 'error');
            console.error('Form error:', error);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    showFormMessage(message, type) {
        if (!this.formMessage) return;
        
        this.formMessage.textContent = message;
        this.formMessage.className = `form-message ${type}`;
        this.formMessage.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => {
                this.formMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    triggerConfetti() {
        // Your existing confetti code
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});
