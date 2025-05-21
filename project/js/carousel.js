/**
 * Carousel functionality
 * Handles image carousel with touch support and keyboard navigation
 */
export function initCarousel() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const nextButton = carousel.querySelector('.carousel-button.next');
  const prevButton = carousel.querySelector('.carousel-button.prev');
  const dotsNav = carousel.querySelector('.carousel-dots');
  const dots = Array.from(dotsNav.children);

  const slideWidth = slides[0].getBoundingClientRect().width;
  let currentIndex = 0;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let isDragging = false;

  // Position slides next to each other
  function setSlidePosition(slide, index) {
    slide.style.left = slideWidth * index + 'px';
  }
  slides.forEach(setSlidePosition);

  function moveToSlide(targetIndex) {
    if (targetIndex < 0) {
      targetIndex = slides.length - 1;
    } else if (targetIndex >= slides.length) {
      targetIndex = 0;
    }

    track.style.transform = `translateX(-${slideWidth * targetIndex}px)`;
    updateDots(targetIndex);
    currentIndex = targetIndex;
  }

  function updateDots(targetIndex) {
    const currentDot = dotsNav.querySelector('.active');
    const targetDot = dots[targetIndex];
    
    if (currentDot) {
      currentDot.classList.remove('active');
    }
    if (targetDot) {
      targetDot.classList.add('active');
    }
  }

  // Next/Previous button handlers
  nextButton.addEventListener('click', () => {
    moveToSlide(currentIndex + 1);
  });

  prevButton.addEventListener('click', () => {
    moveToSlide(currentIndex - 1);
  });

  // Dot navigation
  dotsNav.addEventListener('click', e => {
    const targetDot = e.target.closest('button');
    if (!targetDot) return;

    const targetIndex = dots.findIndex(dot => dot === targetDot);
    moveToSlide(targetIndex);
  });

  // Touch events
  function touchStart(event) {
    isDragging = true;
    carousel.classList.add('dragging');
    
    startPos = event.type.includes('mouse') 
      ? event.pageX 
      : event.touches[0].clientX;
      
    prevTranslate = currentTranslate;
  }

  function touchMove(event) {
    if (!isDragging) return;
    
    const currentPosition = event.type.includes('mouse')
      ? event.pageX
      : event.touches[0].clientX;
      
    currentTranslate = prevTranslate + currentPosition - startPos;
    
    // Restrict movement within bounds
    const minTranslate = -(slideWidth * (slides.length - 1));
    const maxTranslate = 0;
    
    if (currentTranslate > maxTranslate) {
      currentTranslate = maxTranslate;
    } else if (currentTranslate < minTranslate) {
      currentTranslate = minTranslate;
    }
    
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  function touchEnd() {
    isDragging = false;
    carousel.classList.remove('dragging');
    
    const movedBy = currentTranslate - prevTranslate;
    
    if (Math.abs(movedBy) > slideWidth / 3) {
      if (movedBy > 0) {
        moveToSlide(currentIndex - 1);
      } else {
        moveToSlide(currentIndex + 1);
      }
    } else {
      moveToSlide(currentIndex);
    }
  }

  // Touch event listeners
  carousel.addEventListener('touchstart', touchStart);
  carousel.addEventListener('touchmove', touchMove);
  carousel.addEventListener('touchend', touchEnd);

  // Mouse event listeners
  carousel.addEventListener('mousedown', touchStart);
  carousel.addEventListener('mousemove', touchMove);
  carousel.addEventListener('mouseup', touchEnd);
  carousel.addEventListener('mouseleave', touchEnd);

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {
      moveToSlide(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      moveToSlide(currentIndex + 1);
    }
  });

  // Prevent context menu on right click
  carousel.addEventListener('contextmenu', e => {
    e.preventDefault();
  });

  // Auto-advance slides every 5 seconds
  let autoAdvance = setInterval(() => {
    moveToSlide(currentIndex + 1);
  }, 5000);

  // Pause auto-advance on hover
  carousel.addEventListener('mouseenter', () => {
    clearInterval(autoAdvance);
  });

  carousel.addEventListener('mouseleave', () => {
    autoAdvance = setInterval(() => {
      moveToSlide(currentIndex + 1);
    }, 5000);
  });
}