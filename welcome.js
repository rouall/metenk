// Welcome page JavaScript



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

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Extension Functions
async function openExtension() {

  try {
    // Get current timer state from background
    const response = await chrome.runtime.sendMessage({ action: 'getState' });
    
    if (response) {
      const isTimerRunning = response.isRunning || false;
      
      // Check if timer is not running (neither countdown nor stopwatch)
      if (!isTimerRunning) {
        // Switch to focus mode and start timer
        await chrome.runtime.sendMessage({ action: 'switchMode', mode: 'focus' });
        await chrome.runtime.sendMessage({ action: 'start' });
      }
    }
    
    // Open popup to show the timer
    if (chrome.action) {
      chrome.action.openPopup();
    }
  } catch (error) {
    console.error('Error starting focus session:', error);
    // Fallback: just open the popup
    if (chrome.action) {
      chrome.action.openPopup();
    }
  }
}

async function openTodolist() {
  try {
    // 尝试打开侧边栏
    await chrome.runtime.sendMessage({ action: 'openSidePanel' });
  } catch (error) {
    console.error('Error opening sidebar todolist:', error);
    // Fallback: open popup
    if (chrome.action) {
      chrome.action.openPopup();
    }
  }
}

function openSettings() {
  if (chrome && chrome.runtime) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open('options.html', '_blank');
  }
}

async function openHistory() {
  if (chrome && chrome.tabs) {
    const historyUrl = chrome.runtime.getURL('history.html');
    
    // Query all tabs to find if history page is already open
    const tabs = await chrome.tabs.query({});
    const existingTab = tabs.find(tab => tab.url === historyUrl);
    
    if (existingTab) {
      // If history page is already open, switch to that tab
      await chrome.tabs.update(existingTab.id, { active: true });
      await chrome.windows.update(existingTab.windowId, { focused: true });
    } else {
      // If not open, create a new tab
      chrome.tabs.create({ url: historyUrl });
    }
  } else {
    window.open('history.html', '_blank');
  }
}

function rateExtension() {
  if (chrome && chrome.tabs) {
    chrome.tabs.create({ 
      url: 'https://chromewebstore.google.com/detail/study-timer/baefifnjmlmfcdkmbkdbjiijlpggkoic/reviews?' 
    });
  } else {
    window.open('https://chromewebstore.google.com/detail/study-timer/baefifnjmlmfcdkmbkdbjiijlpggkoic/reviews?', '_blank');
  }
}

// Track visit
if (chrome && chrome.runtime) {
  chrome.runtime.sendMessage({ action: 'welcomePageVisited' });
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
  if (typeof i18n !== 'undefined') {
    try { await i18n.init(); i18n.translatePage(); } catch (e) {}
  }
  

  
  // Initialize carousel
  initCarousel();
  

  
  // Hero section buttons
  const heroStartBtn = document.getElementById('heroStartBtn');
  const heroTodolistBtn = document.getElementById('heroTodolistBtn');
  
  if (heroStartBtn) {
    heroStartBtn.addEventListener('click', openExtension);
  }
  
  if (heroTodolistBtn) {
    heroTodolistBtn.addEventListener('click', openTodolist);
  }
  
  // CTA section buttons
  const ctaStartBtn = document.getElementById('ctaStartBtn');
  const ctaHistoryBtn = document.getElementById('ctaHistoryBtn');
  
  if (ctaStartBtn) {
    ctaStartBtn.addEventListener('click', openExtension);
  }
  
  if (ctaHistoryBtn) {
    ctaHistoryBtn.addEventListener('click', openHistory);
  }
  
  // Footer links
  const footerSettingsLink = document.getElementById('footerSettingsLink');
  const footerHistoryLink = document.getElementById('footerHistoryLink');
  const footerRateLink = document.getElementById('footerRateLink');
  const footerSupportLink = document.getElementById('footerSupportLink');
  
  if (footerSettingsLink) {
    footerSettingsLink.addEventListener('click', (e) => {
      e.preventDefault();
      openSettings();
    });
  }
  
  if (footerHistoryLink) {
    footerHistoryLink.addEventListener('click', (e) => {
      e.preventDefault();
      openHistory();
    });
  }
  
  if (footerRateLink) {
    footerRateLink.addEventListener('click', (e) => {
      e.preventDefault();
      rateExtension();
    });
  }
  
  if (footerSupportLink) {
    footerSupportLink.addEventListener('click', (e) => {
      e.preventDefault();
      // 打开sponsor.html页面
      chrome.tabs.create({ url: chrome.runtime.getURL('sponsor.html') });
    });
  }
});

// First Time Guide Modal
(function() {
  const GUIDE_SHOWN_KEY = 'firstGuideShown';
  const modal = document.getElementById('firstGuideModal');
  const completeBtn = document.getElementById('guideCompleteBtn');
  
  // Check if guide has been shown before
  const hasShownGuide = localStorage.getItem(GUIDE_SHOWN_KEY);
  
  if (!hasShownGuide) {
    // Show modal after a short delay for better UX
    setTimeout(() => {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }, 500);
  }
  
  // Handle complete button click
  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      // Add closing animation
      modal.style.opacity = '0';
      
      setTimeout(() => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Mark guide as shown
        localStorage.setItem(GUIDE_SHOWN_KEY, 'true');
      }, 300);
    });
  }
})();
