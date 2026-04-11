// Contact JavaScript for Ghost Kitchen website
document.addEventListener('DOMContentLoaded', function () {
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }
    
    function handleContactSubmission(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Clear previous messages
        const successMessage = document.getElementById('success-message');
        const errorMessage = document.getElementById('error-message');
        if (successMessage) successMessage.classList.add('hidden');
        if (errorMessage) errorMessage.classList.add('hidden');
        
        // Validate form
        if (!validateContactForm(formData)) {
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending Message...';
        submitBtn.disabled = true;
        
        // Simulate sending message
        setTimeout(() => {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Save message to localStorage (in a real app, this would go to a server)
            saveContactMessage(formData);
            
            // Show success message
            if (successMessage) {
                successMessage.classList.remove('hidden');
            }
            
            showNotification('Message sent successfully!', 'success');
            
            // Clear form
            contactForm.reset();
        }, 1500);
    }
    
    function validateContactForm(data) {
        // Check required fields
        if (!data.firstName || !data.lastName || !data.email || !data.subject || !data.message) {
            showError('Please fill in all required fields');
            return false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showError('Please enter a valid email address');
            return false;
        }
        
        // Validate phone if provided
        if (data.phone && data.phone.trim()) {
            const phoneRegex = /^\d{10,15}$/;
            if (!phoneRegex.test(data.phone.replace(/\D/g, ''))) {
                showError('Please enter a valid phone number');
                return false;
            }
        }
        
        // Check message length
        if (data.message.length < 10) {
            showError('Please provide a more detailed message (at least 10 characters)');
            return false;
        }
        
        return true;
    }
    
    function saveContactMessage(data) {
        // In a real app, this would be sent to a server
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        messages.push({
            ...data,
            timestamp: new Date().toISOString(),
            status: 'pending'
        });
        localStorage.setItem('contactMessages', JSON.stringify(messages));
    }
    
    function showError(message) {
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.remove('hidden');
        }
        showNotification(message, 'error');
    }
    
    function showNotification(message, type) {
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
    }
});