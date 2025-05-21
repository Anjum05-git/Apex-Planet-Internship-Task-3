/**
 * Form validation functionality
 * Validates the contact form fields and provides feedback
 */
export function initFormValidation() {
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const newFormBtn = document.getElementById('newFormBtn');
  
  if (!contactForm || !formSuccess || !newFormBtn) return;
  
  // Add form submission event
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isValid = validateAllFields();
    
    if (isValid) {
      // Simulate form submission (would be an API call in a real app)
      // For demonstration purposes, we'll just show success message after a delay
      
      // Disable submit button and show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      // Simulate API call delay
      setTimeout(() => {
        // Show success message
        formSuccess.classList.remove('hidden');
        setTimeout(() => {
          formSuccess.classList.add('show');
        }, 10);
        
        // Reset form
        contactForm.reset();
        
        // Reset validation states
        const formGroups = contactForm.querySelectorAll('.form-group');
        formGroups.forEach(group => {
          group.classList.remove('valid', 'invalid', 'validated');
          const input = group.querySelector('.form-control');
          if (input) {
            input.classList.remove('success', 'error');
          }
          const errorMsg = group.querySelector('.error-message');
          if (errorMsg) {
            errorMsg.textContent = '';
          }
        });
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }, 1500);
    }
  });
  
  // Reset button click event
  newFormBtn.addEventListener('click', () => {
    formSuccess.classList.remove('show');
    
    setTimeout(() => {
      formSuccess.classList.add('hidden');
    }, 300);
  });
  
  // Add validation on blur for each form control
  const formControls = contactForm.querySelectorAll('.form-control');
  formControls.forEach(control => {
    control.addEventListener('blur', (e) => {
      validateField(e.target);
    });
    
    control.addEventListener('input', (e) => {
      // Clear error on input
      const errorElement = document.getElementById(`${e.target.id}-error`);
      if (errorElement && errorElement.textContent !== '') {
        errorElement.textContent = '';
      }
    });
  });
  
  /**
   * Validates all form fields
   * @returns {boolean} True if all fields are valid, false otherwise
   */
  function validateAllFields() {
    const formControls = contactForm.querySelectorAll('.form-control');
    let isValid = true;
    
    formControls.forEach(control => {
      if (!validateField(control)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  /**
   * Validates a single form field
   * @param {HTMLElement} field - The field to validate
   * @returns {boolean} True if field is valid, false otherwise
   */
  function validateField(field) {
    const fieldValue = field.value.trim();
    const fieldId = field.id;
    const errorElement = document.getElementById(`${fieldId}-error`);
    const formGroup = field.closest('.form-group');
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous validation states
    field.classList.remove('success', 'error');
    if (formGroup) {
      formGroup.classList.remove('valid', 'invalid');
      formGroup.classList.add('validated');
    }
    
    // Check if field is required and empty
    if (field.hasAttribute('required') && fieldValue === '') {
      isValid = false;
      errorMessage = 'This field is required';
    } 
    // Specific validation for email field
    else if (fieldId === 'email' && fieldValue !== '') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(fieldValue)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }
    
    // Update UI based on validation result
    if (isValid) {
      field.classList.add('success');
      if (formGroup) {
        formGroup.classList.add('valid');
      }
    } else {
      field.classList.add('error');
      field.classList.add('animate');
      setTimeout(() => {
        field.classList.remove('animate');
      }, 300);
      
      if (formGroup) {
        formGroup.classList.add('invalid');
      }
    }
    
    // Update error message
    if (errorElement) {
      errorElement.textContent = errorMessage;
    }
    
    return isValid;
  }
}