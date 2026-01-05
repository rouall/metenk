// Welcome page JavaScript

// Random Background Image based on time
function setRandomBackground() {
  const hour = new Date().getHours();
  
  // Night backgrounds (18:00 - 6:00)
  const nightBackgrounds = [
    'resource/bgbg-night-1.png',
    'resource/bgbg-night-2.png',
    'resource/bgbg-night-3.png',
    'resource/bgbg-night-4.png'
  ];
  
  // Day backgrounds (6:00 - 18:00)
  const dayBackgrounds = [
    'resource/bgbg.png',
    'resource/bgbg-1.png',
    'resource/bgbg-2.jpg',
    'resource/bgbg-3.png',
    'resource/bgbg-4.png'
  ];
  
  // Determine if it's night or day
  const isNight = hour >= 18 || hour < 6;
  const backgrounds = isNight ? nightBackgrounds : dayBackgrounds;
  
  // Calculate time slot (every 2 hours)
  // Night: 18-20, 20-22, 22-24, 0-2, 2-4, 4-6 (6 slots)
  // Day: 6-8, 8-10, 10-12, 12-14, 14-16, 16-18 (6 slots)
  let timeSlot;
  if (isNight) {
    if (hour >= 18) {
      timeSlot = Math.floor((hour - 18) / 2);
    } else {
      timeSlot = Math.floor((hour + 6) / 2);
    }
  } else {
    timeSlot = Math.floor((hour - 6) / 2);
  }
  
  // Use date to create a daily seed for shuffling
  const today = new Date();
  const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  
  // Simple seeded shuffle to get consistent order for the day
  function seededShuffle(array, seed) {
    const shuffled = [...array];
    let currentSeed = seed;
    for (let i = shuffled.length - 1; i > 0; i--) {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      const j = Math.floor((currentSeed / 233280) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  // Get shuffled backgrounds for today
  const shuffledBgs = seededShuffle(backgrounds, dateSeed + (isNight ? 1 : 0));
  
  // Select background based on time slot (cycle through if more slots than images)
  const bgIndex = timeSlot % shuffledBgs.length;
  const selectedBg = shuffledBgs[bgIndex];
  
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.style.backgroundImage = `url('${selectedBg}')`;
  }
}

// Toast notification function
function showFirefoxToast() {
  // Remove existing toast if any
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create new toast
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = 'Firefox extension is under development 🦊';
  
  // Add to page
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Hide and remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

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

// Shooting Stars System
function createShootingStar() {
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;
  
  const star = document.createElement('div');
  star.className = 'shooting-star';
  
  // Random starting position (top and right edge of viewport)
  const startX = Math.random() * 30 + 70; // 70-100% from left
  const startY = Math.random() * 50; // 0-50% from top
  
  star.style.left = `${startX}%`;
  star.style.top = `${startY}%`;
  
  // Random animation speed variant
  const speedVariant = Math.random();
  if (speedVariant < 0.3) {
    star.classList.add('fast');
  } else if (speedVariant > 0.7) {
    star.classList.add('slow');
  } else {
    star.classList.add('active');
  }
  
  heroSection.appendChild(star);
  
  // Remove after animation completes
  setTimeout(() => {
    star.remove();
  }, 3500);
}

// Create shooting stars at random intervals
function startShootingStars() {
  // Create first few stars with delays
  setTimeout(() => createShootingStar(), 1500);
  setTimeout(() => createShootingStar(), 3000);
  
  // Then create stars at random intervals
  setInterval(() => {
    const random = Math.random();
    if (random > 0.3) { // 70% chance
      createShootingStar();
      
      // 20% chance for a second star shortly after
      if (random > 0.8) {
        setTimeout(() => createShootingStar(), 500);
      }
    }
  }, 2500); // Check every 2.5 seconds
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
  // Set random background
  setRandomBackground();
  
  // Initialize carousel
  initCarousel();
  
  // Create particles
  createParticles();
  
  // Start shooting stars
  startShootingStars();
  
  // Add button effects
  addButtonEffects();
  
  // Hero section buttons - no longer needed as they are simple links
  // CTA section buttons - no longer needed as they are simple links
  // Footer links - no longer needed as simple links
});


