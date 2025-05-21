// Import modules
import { initFormValidation } from './form.js';
import { initTodoList } from './todo.js';
import { initNavigation } from './navigation.js';
import { initQuiz } from './quiz.js';
import { initCarousel } from './carousel.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize navigation
  initNavigation();
  
  // Initialize form validation
  initFormValidation();
  
  // Initialize todo list
  initTodoList();
  
  // Initialize quiz
  initQuiz();
  
  // Initialize carousel
  initCarousel();
  
  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Close mobile menu if open
        const navList = document.getElementById('navList');
        if (navList.classList.contains('active')) {
          navList.classList.remove('active');
        }
        
        // Scroll to target with smooth behavior
        window.scrollTo({
          top: targetElement.offsetTop - 70, // Adjust for header
          behavior: 'smooth'
        });
      }
    });
  });
});

// Add scroll event listener for header styling
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (window.scrollY > 100) {
    header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    header.style.boxShadow = 'var(--shadow-md)';
  } else {
    header.style.backgroundColor = 'var(--color-white)';
    header.style.boxShadow = 'var(--shadow-sm)';
  }
});