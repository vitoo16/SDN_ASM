// Main JavaScript file

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#" && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });
});

// Form validation helper
function validateForm(formElement) {
  const inputs = formElement.querySelectorAll("[required]");
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add("error");
    } else {
      input.classList.remove("error");
    }
  });

  return isValid;
}

// Handle form submissions with loading state
function setupFormLoading() {
  document.querySelectorAll("form[data-loading]").forEach((form) => {
    form.addEventListener("submit", function (e) {
      const submitBtn = this.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Loading...';
      }
    });
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  setupFormLoading();

  // Add loading class to body for smoother transitions
  document.body.classList.add("loaded");

  // Initialize any lazy-loaded images
  if ("loading" in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      img.src = img.dataset.src || img.src;
    });
  }
});

// Handle image loading errors
document.addEventListener(
  "error",
  function (e) {
    if (e.target.tagName === "IMG" && !e.target.dataset.errorHandled) {
      // Mark as handled to prevent infinite loop
      e.target.dataset.errorHandled = "true";
      
      // Hide the image and show fallback if available
      const wrapper = e.target.closest('.perfume-card-image-wrapper, .hero-carousel-image-wrapper, .review-image-wrapper');
      if (wrapper) {
        const fallback = wrapper.querySelector('.image-fallback, .card-fallback, .hero-fallback, .review-image-fallback');
        if (fallback) {
          e.target.style.display = 'none';
          fallback.style.display = 'flex';
        }
      } else {
        // If no wrapper/fallback, just hide the broken image
        e.target.style.display = 'none';
      }
    }
  },
  true
);

// Debounce function for search/filter inputs
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Format price helper
function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

// Format date helper
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// Show/hide loading overlay
function showLoading() {
  const overlay = document.createElement("div");
  overlay.className = "loading-overlay";
  overlay.id = "loadingOverlay";
  overlay.innerHTML = '<div class="spinner"></div>';
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add("show"), 10);
}

function hideLoading() {
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) {
    overlay.classList.remove("show");
    setTimeout(() => overlay.remove(), 300);
  }
}

// Intersection Observer for animations
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "50px",
    }
  );

  // Observe fade-in elements
  document
    .querySelectorAll(".fade-in-up, .fade-in, .slide-in-left, .slide-in-right")
    .forEach((el) => {
      observer.observe(el);
    });
}

// Add loading overlay styles
const loadingStyles = document.createElement("style");
loadingStyles.textContent = `
body.loaded {
    opacity: 1;
    transition: opacity 0.3s ease;
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(6, 7, 10, 0.9);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.loading-overlay.show {
    opacity: 1;
}

.error {
    border-color: #f87171 !important;
    animation: shake 0.3s ease;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}

.visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
}
`;
document.head.appendChild(loadingStyles);

// ===== HERO CAROUSEL FUNCTIONALITY =====
let currentSlideIndex = 0;
let carouselInterval = null;

function initHeroCarousel() {
  // Check if featuredPerfumesData exists and has items
  if (
    typeof window.featuredPerfumesData === "undefined" ||
    !window.featuredPerfumesData ||
    window.featuredPerfumesData.length === 0
  ) {
    console.log("No featured perfumes data available for carousel");
    return;
  }

  console.log(
    "Initializing carousel with",
    window.featuredPerfumesData.length,
    "perfumes"
  );

  const prevBtn = document.getElementById("carouselPrev");
  const nextBtn = document.getElementById("carouselNext");

  if (prevBtn) {
    prevBtn.addEventListener("click", function (e) {
      e.preventDefault();
      goToPreviousSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function (e) {
      e.preventDefault();
      goToNextSlide();
    });
  }

  // Start auto-rotate
  startCarouselAutoRotate();
  console.log("Carousel initialized and auto-rotate started");
}

function goToSlide(index) {
  if (
    typeof window.featuredPerfumesData === "undefined" ||
    !window.featuredPerfumesData ||
    window.featuredPerfumesData.length === 0
  ) {
    return;
  }

  currentSlideIndex = index;
  updateCarouselContent();
  updateIndicators();

  // Reset auto-rotate timer
  restartCarouselAutoRotate();
}

function goToPreviousSlide() {
  if (
    typeof window.featuredPerfumesData === "undefined" ||
    !window.featuredPerfumesData
  ) {
    return;
  }

  currentSlideIndex =
    currentSlideIndex === 0
      ? window.featuredPerfumesData.length - 1
      : currentSlideIndex - 1;
  console.log("Previous slide:", currentSlideIndex);
  updateCarouselContent();
  updateIndicators();
  restartCarouselAutoRotate();
}

function goToNextSlide() {
  if (
    typeof window.featuredPerfumesData === "undefined" ||
    !window.featuredPerfumesData
  ) {
    return;
  }

  currentSlideIndex =
    currentSlideIndex === window.featuredPerfumesData.length - 1
      ? 0
      : currentSlideIndex + 1;
  console.log("Next slide:", currentSlideIndex);
  updateCarouselContent();
  updateIndicators();
  restartCarouselAutoRotate();
}

function updateCarouselContent() {
  if (
    typeof window.featuredPerfumesData === "undefined" ||
    !window.featuredPerfumesData
  ) {
    return;
  }

  const perfume = window.featuredPerfumesData[currentSlideIndex];

  // Update image with fade effect
  const img = document.getElementById("heroCarouselImage");
  const fallback = document.getElementById("heroImageFallback");
  
  if (img) {
    img.style.opacity = "0";
    img.style.transition = "opacity 0.35s ease";
    
    // Hide fallback and show image
    if (fallback) {
      fallback.style.display = "none";
    }
    img.style.display = "block";
    
    setTimeout(function () {
      img.src = perfume.uri;
      img.alt = perfume.perfumeName;
      img.style.opacity = "1";
    }, 350);
  }

  // Update description
  const description = document.getElementById("heroDescription");
  if (description) {
    const truncatedDesc =
      perfume.description.substring(0, 180) +
      (perfume.description.length > 180 ? "…" : "");
    description.textContent = truncatedDesc;
  }

  // Update chips
  const brandChip = document.getElementById("heroChipBrand");
  if (brandChip) {
    brandChip.textContent = perfume.brand.brandName;
  }

  const concentrationChip = document.getElementById("heroChipConcentration");
  if (concentrationChip) {
    concentrationChip.textContent = perfume.concentration;
  }

  const volumeChip = document.getElementById("heroChipVolume");
  if (volumeChip) {
    volumeChip.textContent = perfume.volume + " ml";
  }

  // Update view details button link
  const viewDetailsBtn = document.getElementById("heroViewDetailsBtn");
  if (viewDetailsBtn) {
    viewDetailsBtn.href = "/perfumes/" + perfume._id;
  }
}

function updateIndicators() {
  const indicators = document.querySelectorAll(".hero-indicator-btn");
  indicators.forEach(function (btn, index) {
    if (index === currentSlideIndex) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function startCarouselAutoRotate() {
  if (
    typeof window.featuredPerfumesData === "undefined" ||
    !window.featuredPerfumesData ||
    window.featuredPerfumesData.length <= 1
  ) {
    return;
  }

  carouselInterval = setInterval(function () {
    goToNextSlide();
  }, 7000); // 7 seconds like React version
}

function stopCarouselAutoRotate() {
  if (carouselInterval) {
    clearInterval(carouselInterval);
    carouselInterval = null;
  }
}

function restartCarouselAutoRotate() {
  stopCarouselAutoRotate();
  startCarouselAutoRotate();
}

// Initialize carousel when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing carousel...");
  // Small delay to ensure all data is available
  setTimeout(function () {
    initHeroCarousel();
  }, 100);
});

// Export helpers
if (typeof window !== "undefined") {
  window.formatPrice = formatPrice;
  window.formatDate = formatDate;
  window.showLoading = showLoading;
  window.hideLoading = hideLoading;
  window.debounce = debounce;
  window.goToSlide = goToSlide;
}
