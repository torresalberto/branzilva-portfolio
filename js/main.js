// LÍNEA VIVA - Main JavaScript
// Interactive line animations, cursor trails, scroll effects

document.addEventListener('DOMContentLoaded', () => {
  initInkCanvas();
  initScrollEffects();
  initCursorInteraction();
  initFloatingLines();
  initSectionVisibility();
  loadArtworks();
  loadInstagramFeed();
  initLightbox();
  initBreathingAnimation();
});

// ============================================
// INK CANVAS - Cursor Trails
// ============================================
let inkCanvas, inkCtx;
let inkDrops = [];
let mousePos = { x: 0, y: 0 };
let lastMousePos = { x: 0, y: 0 };
let mouseVelocity = { x: 0, y: 0 };

function initInkCanvas() {
  inkCanvas = document.getElementById('ink-canvas');
  inkCtx = inkCanvas.getContext('2d');
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('touchmove', handleTouchMove, { passive: true });
  
  animateCanvas();
}

function resizeCanvas() {
  inkCanvas.width = window.innerWidth;
  inkCanvas.height = window.innerHeight;
}

function handleMouseMove(e) {
  lastMousePos = { ...mousePos };
  mousePos = { x: e.clientX, y: e.clientY };
  mouseVelocity = {
    x: mousePos.x - lastMousePos.x,
    y: mousePos.y - lastMousePos.y
  };
  
  // Create ink drops based on velocity
  if (Math.abs(mouseVelocity.x) + Math.abs(mouseVelocity.y) > 2) {
    createInkDrop(mousePos.x, mousePos.y, mouseVelocity);
  }
}

function handleTouchMove(e) {
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    lastMousePos = { ...mousePos };
    mousePos = { x: touch.clientX, y: touch.clientY };
    mouseVelocity = {
      x: mousePos.x - lastMousePos.x,
      y: mousePos.y - lastMousePos.y
    };
    
    if (Math.abs(mouseVelocity.x) + Math.abs(mouseVelocity.y) > 2) {
      createInkDrop(mousePos.x, mousePos.y, mouseVelocity);
    }
  }
}

function createInkDrop(x, y, velocity) {
  const size = Math.random() * 8 + 3;
  const opacity = Math.random() * 0.3 + 0.1;
  
  inkDrops.push({
    x: x + (Math.random() - 0.5) * 20,
    y: y + (Math.random() - 0.5) * 20,
    size: size,
    opacity: opacity,
    velocity: {
      x: velocity.x * 0.1 + (Math.random() - 0.5) * 2,
      y: velocity.y * 0.1 + (Math.random() - 0.5) * 2
    },
    life: 1,
    decay: Math.random() * 0.01 + 0.005
  });
}

function animateCanvas() {
  inkCtx.clearRect(0, 0, inkCanvas.width, inkCanvas.height);
  
  // Get current color mode
  const body = document.body;
  let strokeColor = '#1a1a1a';
  
  if (body.classList.contains('mode-wash')) {
    strokeColor = '#c94e50';
  } else if (body.classList.contains('mode-glow')) {
    strokeColor = '#00d4ff';
  }
  
  // Update and draw ink drops
  for (let i = inkDrops.length - 1; i >= 0; i--) {
    const drop = inkDrops[i];
    
    drop.x += drop.velocity.x;
    drop.y += drop.velocity.y;
    drop.velocity.x *= 0.98;
    drop.velocity.y *= 0.98;
    drop.life -= drop.decay;
    
    if (drop.life <= 0) {
      inkDrops.splice(i, 1);
      continue;
    }
    
    inkCtx.beginPath();
    inkCtx.arc(drop.x, drop.y, drop.size * drop.life, 0, Math.PI * 2);
    inkCtx.fillStyle = hexToRgba(strokeColor, drop.opacity * drop.life);
    inkCtx.fill();
    
    // Draw tail
    if (drop.life > 0.5) {
      inkCtx.beginPath();
      inkCtx.moveTo(drop.x, drop.y);
      inkCtx.lineTo(drop.x - drop.velocity.x * 10, drop.y - drop.velocity.y * 10);
      inkCtx.strokeStyle = hexToRgba(strokeColor, drop.opacity * drop.life * 0.5);
      inkCtx.lineWidth = drop.size * drop.life * 0.5;
      inkCtx.lineCap = 'round';
      inkCtx.stroke();
    }
  }
  
  requestAnimationFrame(animateCanvas);
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ============================================
// LOAD POLAROID FEED (different images from grid)
// ============================================
function loadInstagramFeed() {
  const feed = document.getElementById('insta-feed');
  
  // Different images for polaroid section
  const polaroidImages = [
    'images/art/618485338_18092535214948629_4340409091351113843_n.jpg',
    'images/art/619908148_18067759913537301_5826772426705135230_n.webp',
    'images/art/621835392_18114462877717428_1498156613551486740_n.jpg',
    'images/art/623986566_18125653810551947_4782045505636224720_n.webp',
    'images/art/624584011_18193869226343494_4843418806609295727_n.webp',
    'images/art/641737611_18563531041058207_8254296480407644483_n.jpg',
    'images/art/648986747_18108894841742989_8555651953242600009_n.jpg',
    'images/art/650372957_18100283677936962_5763525205878963576_n.jpg',
    'images/art/651171864_18096484378960572_4523142624195284576_n.jpg',
  ];
  
  polaroidImages.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Artwork';
    img.loading = 'lazy';
    feed.appendChild(img);
  });
}

// ============================================

// SCROLL EFFECTS - Color Mode Transitions
// ============================================
let scrollMode = 'ink';

function initScrollEffects() {
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check
}

function handleScroll() {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollProgress = scrollY / docHeight;
  
  let newMode = 'ink';
  
  if (scrollProgress < 0.2) {
    newMode = 'ink';
  } else if (scrollProgress < 0.5) {
    newMode = 'wash';
  } else {
    newMode = 'glow';
  }
  
  if (newMode !== scrollMode) {
    scrollMode = newMode;
    updateColorMode(newMode);
  }
}

function updateColorMode(mode) {
  const body = document.body;
  
  // Remove all mode classes
  body.classList.remove('mode-ink', 'mode-wash', 'mode-glow');
  
  // Add new mode class
  body.classList.add(`mode-${mode}`);
  
  // Update floating lines color
  updateFloatingLinesColor(mode);
}

// ============================================
// CURSOR INTERACTION - Lines reach toward cursor
// ============================================
function initCursorInteraction() {
  document.addEventListener('mousemove', (e) => {
    const floatingLines = document.querySelectorAll('.floating-line');
    
    floatingLines.forEach(line => {
      const rect = line.getBoundingClientRect();
      const lineCenterX = rect.left + rect.width / 2;
      const lineCenterY = rect.top + rect.height / 2;
      
      const distance = Math.hypot(e.clientX - lineCenterX, e.clientY - lineCenterY);
      
      if (distance < 200) {
        line.classList.add('active');
        
        // Make line reach toward cursor
        const angle = Math.atan2(e.clientY - lineCenterY, e.clientX - lineCenterX);
        const reach = (200 - distance) * 0.1;
        
        line.style.transform = `rotate(${angle}rad) scaleX(${1 + reach * 0.01})`;
      } else {
        line.classList.remove('active');
        line.style.transform = '';
      }
    });
  });
}

// ============================================
// FLOATING LINES - Decorative animated lines
// ============================================
function initFloatingLines() {
  const container = document.getElementById('floating-lines');
  const numLines = 15;
  
  for (let i = 0; i < numLines; i++) {
    const line = document.createElement('div');
    line.className = 'floating-line';
    
    // Random properties
    const width = Math.random() * 150 + 50;
    const height = Math.random() * 2 + 1;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const rotation = Math.random() * 360;
    const delay = Math.random() * 5;
    const duration = Math.random() * 10 + 10;
    
    line.style.cssText = `
      width: ${width}px;
      height: ${height}px;
      left: ${left}%;
      top: ${top}%;
      transform: rotate(${rotation}deg);
      animation: float ${duration}s ease-in-out ${delay}s infinite;
    `;
    
    container.appendChild(line);
  }
  
  // Add animation keyframes
  addFloatingAnimation();
}

function addFloatingAnimation() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% { 
        transform: rotate(var(--rotation, 0deg)) translateY(0); 
      }
      50% { 
        transform: rotate(var(--rotation, 0deg)) translateY(-20px); 
      }
    }
  `;
  document.head.appendChild(style);
}

function updateFloatingLinesColor(mode) {
  const lines = document.querySelectorAll('.floating-line');
  let color;
  
  switch(mode) {
    case 'ink':
      color = '#1a1a1a';
      break;
    case 'wash':
      color = '#c94e50';
      break;
    case 'glow':
      color = '#00d4ff';
      break;
  }
  
  lines.forEach(line => {
    line.style.background = color;
  });
}

// ============================================
// LOAD ARTWORKS
// ============================================
function loadArtworks() {
  const grid = document.getElementById('artwork-grid');
  
  // ALL artworks from images/art folder (34 images)
  const artworks = [
    'images/art/004_branzilva_1774669907181.jpg',
    'images/art/006_branzilva_1774669907488.jpg',
    'images/art/007_branzilva_1774669907935.jpg',
    'images/art/009_branzilva_1774669908602.jpg',
    'images/art/010_branzilva_1774669908783.jpg',
    'images/art/017_branzilva_1774669910039.jpg',
    'images/art/018_branzilva_1774669910242.jpg',
    'images/art/022_branzilva_1774669911024.jpg',
    'images/art/023_branzilva_1774669911253.jpg',
    'images/art/025_branzilva_1774669911755.jpg',
    'images/art/028_branzilva_1774669912834.jpg',
    'images/art/029_branzilva_1774669913139.jpg',
    'images/art/030_branzilva_1774669913406.jpg',
    'images/art/031_branzilva_1774669913776.jpg',
    'images/art/032_branzilva_1774669913960.jpg',
    'images/art/033_branzilva_1774669914365.jpg',
    'images/art/034_branzilva_1774669914730.jpg',
    'images/art/036_branzilva_1774669915131.jpg',
    'images/art/037_branzilva_1774669915664.jpg',
    'images/art/038_branzilva_1774669915868.jpg',
    'images/art/040_branzilva_1774669916222.jpg',
    'images/art/652006648_18162492238417838_8293971321245675376_n.jpg',
    'images/art/652896906_18123218902607640_4098618003830155748_n.jpg',
    'images/art/655019375_18200838343340588_810112245707058065_n.jpg',
  ];
  
  artworks.forEach((src, index) => {
    const card = document.createElement('div');
    card.className = 'artwork-card';
    card.innerHTML = `<img src="${src}" alt="Artwork ${index + 1}" loading="lazy">`;
    grid.appendChild(card);
  });
}


// ============================================
// SECTION VISIBILITY - Reveal on scroll
// ============================================
function initSectionVisibility() {
  const sections = document.querySelectorAll('.section-works, .section-instagram, .section-contact');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });
  
  sections.forEach(section => {
    observer.observe(section);
  });
}


// ============================================
// LIGHTBOX - Fullscreen artwork viewer
// ============================================
let currentLightboxIndex = 0;
let lightboxImages = [];

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  
  // Collect all images from both sections
  document.querySelectorAll('.artwork-card img, .photo-area img').forEach((img, index) => {
    lightboxImages.push({
      src: img.src,
      alt: img.alt,
      index: index
    });
  });
  
  // Add click handlers to artwork cards
  document.querySelectorAll('.artwork-card').forEach((card, index) => {
    card.addEventListener('click', () => openLightbox(index));
    card.setAttribute('data-index', String(index + 1).padStart(2, '0'));
  });
  
  // Add click handlers to polaroid images
  document.querySelectorAll('.photo-area img').forEach((img, index) => {
    img.addEventListener('click', () => {
      // Calculate actual index in full array
      const gridCount = document.querySelectorAll('.artwork-card').length;
      openLightbox(gridCount + index);
    });
  });
  
  // Close handlers
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  // Navigation
  prevBtn.addEventListener('click', () => navigateLightbox(-1));
  nextBtn.addEventListener('click', () => navigateLightbox(1));
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
  
  // Update counter
  document.getElementById('lightbox-total').textContent = lightboxImages.length;
}

function openLightbox(index) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  
  currentLightboxIndex = index;
  lightboxImg.src = lightboxImages[index].src;
  lightboxImg.alt = lightboxImages[index].alt;
  document.getElementById('lightbox-current').textContent = index + 1;
  
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function navigateLightbox(direction) {
  currentLightboxIndex += direction;
  
  if (currentLightboxIndex < 0) {
    currentLightboxIndex = lightboxImages.length - 1;
  } else if (currentLightboxIndex >= lightboxImages.length) {
    currentLightboxIndex = 0;
  }
  
  const lightboxImg = document.getElementById('lightbox-img');
  lightboxImg.src = lightboxImages[currentLightboxIndex].src;
  lightboxImg.alt = lightboxImages[currentLightboxIndex].alt;
  document.getElementById('lightbox-current').textContent = currentLightboxIndex + 1;
}


// ============================================
// BREATHING ANIMATION - Organic line movement
// ============================================
function initBreathingAnimation() {
  // Add breathing effect to name SVG
  const namePaths = document.querySelectorAll('.name-path');
  
  namePaths.forEach((path, index) => {
    path.style.animationDelay = `${index * 0.5}s`;
  });
  
  // Add organic wobble to floating elements
  const cards = document.querySelectorAll('.artwork-card');
  
  cards.forEach((card, index) => {
    card.style.animationDelay = `${0.5 + index * 0.1}s`;
  });
}

// ============================================
// WIND EFFECT - Lines affected by scroll direction
// ============================================
let lastScrollTime = 0;
let scrollDirection = 0;

window.addEventListener('scroll', () => {
  const now = Date.now();
  const delta = now - lastScrollTime;
  
  if (delta > 100) {
    const currentScroll = window.scrollY;
    scrollDirection = currentScroll > lastScrollTime ? 1 : -1;
    applyWindEffect(scrollDirection);
  }
  
  lastScrollTime = now;
});

function applyWindEffect(direction) {
  const floatingLines = document.querySelectorAll('.floating-line');
  
  floatingLines.forEach(line => {
    const currentTransform = line.style.transform || '';
    const skew = direction * 5;
    
    line.style.transition = 'transform 0.3s ease';
    line.style.transform = currentTransform + ` skewX(${skew}deg)`;
    
    setTimeout(() => {
      line.style.transform = currentTransform;
    }, 300);
  });
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
  // Press '1' for ink mode
  if (e.key === '1') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Press '2' for wash mode
  if (e.key === '2') {
    const washSection = document.querySelector('.section-works');
    if (washSection) {
      washSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  // Press '3' for glow mode
  if (e.key === '3') {
    const glowSection = document.querySelector('.section-instagram');
    if (glowSection) {
      glowSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
});
