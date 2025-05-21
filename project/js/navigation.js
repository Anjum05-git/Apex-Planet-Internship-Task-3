/**
 * Navigation functionality
 * Handles mobile menu toggle
 */
export function initNavigation() {
  const menuToggle = document.getElementById('menuToggle');
  const navList = document.getElementById('navList');
  
  if (!menuToggle || !navList) return;
  
  // Toggle menu on button click
  menuToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
    
    // Animate burger menu icon
    const spans = menuToggle.querySelectorAll('span');
    
    if (navList.classList.contains('active')) {
      // Transform to X
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      // Reset to burger icon
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (event) => {
    const isClickInsideMenu = navList.contains(event.target);
    const isClickOnToggle = menuToggle.contains(event.target);
    const isMenuOpen = navList.classList.contains('active');
    
    if (isMenuOpen && !isClickInsideMenu && !isClickOnToggle) {
      navList.classList.remove('active');
      
      // Reset burger icon
      const spans = menuToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
  
  // Close menu when window is resized to desktop size
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && navList.classList.contains('active')) {
      navList.classList.remove('active');
      
      // Reset burger icon
      const spans = menuToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
  
  // Add active class to current section in navigation
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (pageYOffset >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}