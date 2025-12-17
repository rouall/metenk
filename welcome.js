// Welcome page JavaScript

// Loading Screen
window.addEventListener('load', () => {
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 1000);
  }
});

// Scroll Animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe both fade-in and text-reveal elements
document.querySelectorAll('.fade-in, .text-reveal').forEach(el => observer.observe(el));

// Particle System
function createParticles() {
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;
  
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    
    // Random animation delay and duration
    const delay = Math.random() * 6;
    const duration = Math.random() * 6 + 3;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    
    // Random size
    const size = Math.random() * 3 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    heroSection.appendChild(particle);
  }
}

// Enhanced Button Effects
function addButtonEffects() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      // Create ripple effect
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.classList.add('btn-ripple');
      
      button.appendChild(ripple);
      
      // Remove ripple after animation
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}





// Carousel functionality
function initCarousel() {
  const images = document.querySelectorAll('.showcase-image');
  const indicators = document.getElementById('carouselIndicators');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  let currentIndex = 0;
  let autoPlayInterval;

  // Create indicators
  images.forEach((_, index) => {
    const indicator = document.createElement('div');
    indicator.className = 'carousel-indicator' + (index === 0 ? ' active' : '');
    indicator.addEventListener('click', () => goToSlide(index));
    indicators.appendChild(indicator);
  });

  function goToSlide(index) {
    images[currentIndex].classList.remove('active');
    indicators.children[currentIndex].classList.remove('active');
    currentIndex = index;
    images[currentIndex].classList.add('active');
    indicators.children[currentIndex].classList.add('active');
    resetAutoPlay();
  }

  function nextSlide() {
    goToSlide((currentIndex + 1) % images.length);
  }

  function prevSlide() {
    goToSlide((currentIndex - 1 + images.length) % images.length);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextSlide, 3000);
  }

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Start auto play
  resetAutoPlay();
}

// Add event listeners for all buttons and links
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize carousel
  initCarousel();
  
  // Create particles
  createParticles();
  
  // Add button effects
  addButtonEffects();
  
  // Hero section buttons - no longer needed as they are simple links
  // CTA section buttons - no longer needed as they are simple links
  // Footer links - no longer needed as simple links
});


