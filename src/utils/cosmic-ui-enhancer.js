/**
 * Cosmic UI Enhancer
 * 
 * This utility enhances the Cosmic UI with dynamic star generation,
 * improved animations, and better integration between UI components.
 */

class CosmicUIEnhancer {
  constructor(options = {}) {
    // Default configuration
    this.config = {
      starCount: options.starCount || 100,
      nebulaCount: options.nebulaCount || 3,
      animationSpeed: options.animationSpeed || 'normal',
      enableParallax: options.enableParallax !== undefined ? options.enableParallax : true,
      enableNebulaEffect: options.enableNebulaEffect !== undefined ? options.enableNebulaEffect : true,
      colorScheme: options.colorScheme || 'default',
      reducedMotion: options.reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };

    // State
    this.initialized = false;
    this.stars = [];
    this.nebulae = [];
    this.backgroundElement = null;
    this.resizeTimeout = null;
    this.scrollListener = null;
    this.mouseListener = null;
  }

  /**
   * Initialize the Cosmic UI enhancements
   * @returns {CosmicUIEnhancer} The instance for chaining
   */
  initialize() {
    if (this.initialized) return this;

    // Load the enhanced CSS if not already loaded
    this.loadEnhancedStyles();

    // Create or find the background container
    this.setupBackgroundContainer();

    // Generate stars and nebulae
    this.generateStars();
    if (this.config.enableNebulaEffect) {
      this.generateNebulae();
    }

    // Set up event listeners
    this.setupEventListeners();

    // Apply color scheme
    this.applyColorScheme(this.config.colorScheme);

    // Apply cosmic classes to UI elements
    this.enhanceUIElements();

    this.initialized = true;
    console.log('Cosmic UI Enhancer initialized');
    return this;
  }

  /**
   * Load the enhanced CSS styles if not already loaded
   */
  loadEnhancedStyles() {
    const styleId = 'cosmic-ui-enhanced-styles';
    if (!document.getElementById(styleId)) {
      const link = document.createElement('link');
      link.id = styleId;
      link.rel = 'stylesheet';
      link.href = '/styles/cosmic-ui-enhanced.css';
      document.head.appendChild(link);
    }
  }

  /**
   * Set up the background container
   */
  setupBackgroundContainer() {
    // Check if the background container already exists
    this.backgroundElement = document.querySelector('.cosmic-background');
    
    if (!this.backgroundElement) {
      // Create the background container
      this.backgroundElement = document.createElement('div');
      this.backgroundElement.className = 'cosmic-background';
      document.body.insertBefore(this.backgroundElement, document.body.firstChild);
    }
  }

  /**
   * Generate stars in the background
   */
  generateStars() {
    // Clear existing stars
    this.stars.forEach(star => star.element.remove());
    this.stars = [];

    // Get dimensions
    const { width, height } = this.getViewportDimensions();

    // Create new stars
    for (let i = 0; i < this.config.starCount; i++) {
      const starElement = document.createElement('div');
      starElement.className = 'cosmic-star';
      
      // Random position
      const x = Math.random() * width;
      const y = Math.random() * height;
      
      // Random size (0.5px to 3px)
      const size = Math.random() * 2.5 + 0.5;
      
      // Random animation delay
      const delay = Math.random() * 3;
      
      // Apply styles
      starElement.style.left = `${x}px`;
      starElement.style.top = `${y}px`;
      starElement.style.width = `${size}px`;
      starElement.style.height = `${size}px`;
      starElement.style.animationDelay = `${delay}s`;
      
      // Add to background
      this.backgroundElement.appendChild(starElement);
      
      // Store reference
      this.stars.push({
        element: starElement,
        x,
        y,
        size,
        initialX: x,
        initialY: y
      });
    }
  }

  /**
   * Generate nebula effects
   */
  generateNebulae() {
    // Clear existing nebulae
    this.nebulae.forEach(nebula => nebula.element.remove());
    this.nebulae = [];

    // Get dimensions
    const { width, height } = this.getViewportDimensions();

    // Nebula colors
    const colors = [
      'rgba(189, 147, 249, 0.3)', // Purple
      'rgba(255, 121, 198, 0.3)', // Pink
      'rgba(139, 233, 253, 0.3)', // Cyan
      'rgba(80, 250, 123, 0.3)'   // Green
    ];

    // Create new nebulae
    for (let i = 0; i < this.config.nebulaCount; i++) {
      const nebulaElement = document.createElement('div');
      nebulaElement.className = 'cosmic-nebula';
      
      // Random position
      const x = Math.random() * width;
      const y = Math.random() * height;
      
      // Random size (100px to 300px)
      const size = Math.random() * 200 + 100;
      
      // Random color
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Random animation delay
      const delay = Math.random() * 5;
      
      // Apply styles
      nebulaElement.style.left = `${x}px`;
      nebulaElement.style.top = `${y}px`;
      nebulaElement.style.width = `${size}px`;
      nebulaElement.style.height = `${size}px`;
      nebulaElement.style.backgroundColor = color;
      nebulaElement.style.animationDelay = `${delay}s`;
      
      // Add to background
      this.backgroundElement.appendChild(nebulaElement);
      
      // Store reference
      this.nebulae.push({
        element: nebulaElement,
        x,
        y,
        size,
        initialX: x,
        initialY: y
      });
    }
  }

  /**
   * Set up event listeners for responsive behavior
   */
  setupEventListeners() {
    // Resize handler
    window.addEventListener('resize', () => {
      // Debounce resize events
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 200);
    });

    // Parallax effect on mouse move
    if (this.config.enableParallax && !this.config.reducedMotion) {
      this.mouseListener = this.handleMouseMove.bind(this);
      window.addEventListener('mousemove', this.mouseListener);
    }

    // Parallax effect on scroll
    if (this.config.enableParallax && !this.config.reducedMotion) {
      this.scrollListener = this.handleScroll.bind(this);
      window.addEventListener('scroll', this.scrollListener);
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    const { width, height } = this.getViewportDimensions();
    
    // Update star positions
    this.stars.forEach(star => {
      // Calculate new position while maintaining relative position
      const newX = (star.initialX / this.lastWidth) * width;
      const newY = (star.initialY / this.lastHeight) * height;
      
      star.x = newX;
      star.y = newY;
      star.element.style.left = `${newX}px`;
      star.element.style.top = `${newY}px`;
    });
    
    // Update nebula positions
    this.nebulae.forEach(nebula => {
      // Calculate new position while maintaining relative position
      const newX = (nebula.initialX / this.lastWidth) * width;
      const newY = (nebula.initialY / this.lastHeight) * height;
      
      nebula.x = newX;
      nebula.y = newY;
      nebula.element.style.left = `${newX}px`;
      nebula.element.style.top = `${newY}px`;
    });
    
    // Store new dimensions
    this.lastWidth = width;
    this.lastHeight = height;
  }

  /**
   * Handle mouse movement for parallax effect
   * @param {MouseEvent} event - Mouse event
   */
  handleMouseMove(event) {
    if (this.config.reducedMotion) return;
    
    const { width, height } = this.getViewportDimensions();
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    // Calculate mouse position as percentage of viewport
    const mouseXPercent = mouseX / width;
    const mouseYPercent = mouseY / height;
    
    // Apply parallax effect to stars
    this.stars.forEach(star => {
      // Calculate parallax offset based on star size (larger stars move more)
      const parallaxFactor = star.size / 3;
      const offsetX = (mouseXPercent - 0.5) * parallaxFactor * 20;
      const offsetY = (mouseYPercent - 0.5) * parallaxFactor * 20;
      
      star.element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
    
    // Apply subtle parallax to nebulae
    this.nebulae.forEach(nebula => {
      const offsetX = (mouseXPercent - 0.5) * -30;
      const offsetY = (mouseYPercent - 0.5) * -30;
      
      nebula.element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
  }

  /**
   * Handle scroll for parallax effect
   */
  handleScroll() {
    if (this.config.reducedMotion) return;
    
    const scrollY = window.scrollY;
    
    // Apply parallax effect to stars based on scroll position
    this.stars.forEach(star => {
      const parallaxFactor = star.size / 3;
      const offsetY = scrollY * parallaxFactor * 0.05;
      
      // Combine with any existing transform from mouse movement
      const currentTransform = star.element.style.transform;
      const translateXMatch = currentTransform.match(/translate\(([^,]+),/);
      const translateX = translateXMatch ? translateXMatch[1] : '0px';
      
      star.element.style.transform = `translate(${translateX}, ${offsetY}px)`;
    });
  }

  /**
   * Get viewport dimensions
   * @returns {Object} Object with width and height properties
   */
  getViewportDimensions() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Store dimensions for reference
    if (!this.lastWidth) this.lastWidth = width;
    if (!this.lastHeight) this.lastHeight = height;
    
    return { width, height };
  }

  /**
   * Apply a color scheme to the UI
   * @param {string} scheme - Color scheme name
   */
  applyColorScheme(scheme) {
    // Remove any existing scheme classes
    document.body.classList.remove('cosmic-scheme-default', 'cosmic-scheme-dark', 'cosmic-scheme-light', 'cosmic-scheme-warm');
    
    // Add the new scheme class
    document.body.classList.add(`cosmic-scheme-${scheme}`);
    
    // Update CSS variables based on scheme
    const root = document.documentElement;
    
    switch (scheme) {
      case 'dark':
        root.style.setProperty('--cosmic-background', '#121212');
        root.style.setProperty('--cosmic-surface', '#1e1e1e');
        root.style.setProperty('--cosmic-primary', '#bb86fc');
        break;
      case 'light':
        root.style.setProperty('--cosmic-background', '#f5f5f5');
        root.style.setProperty('--cosmic-surface', '#ffffff');
        root.style.setProperty('--cosmic-primary', '#6200ee');
        root.style.setProperty('--cosmic-text', '#121212');
        break;
      case 'warm':
        root.style.setProperty('--cosmic-background', '#2d2d2d');
        root.style.setProperty('--cosmic-surface', '#3d3d3d');
        root.style.setProperty('--cosmic-primary', '#ffb86c');
        break;
      default:
        // Reset to default values
        root.style.removeProperty('--cosmic-background');
        root.style.removeProperty('--cosmic-surface');
        root.style.removeProperty('--cosmic-primary');
        root.style.removeProperty('--cosmic-text');
    }
  }

  /**
   * Enhance existing UI elements with cosmic classes
   */
  enhanceUIElements() {
    // Add cosmic classes to buttons
    document.querySelectorAll('button:not(.cosmic-button)').forEach(button => {
      if (!button.classList.contains('cosmic-button') && 
          !button.closest('.cosmic-button') && 
          !button.classList.contains('no-cosmic')) {
        button.classList.add('cosmic-button');
      }
    });
    
    // Add cosmic classes to inputs
    document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="search"], textarea').forEach(input => {
      if (!input.classList.contains('cosmic-input') && 
          !input.closest('.cosmic-input') && 
          !input.classList.contains('no-cosmic')) {
        input.classList.add('cosmic-input');
      }
    });
    
    // Add cosmic classes to cards/panels
    document.querySelectorAll('.card, .panel, .box').forEach(card => {
      if (!card.classList.contains('cosmic-card') && 
          !card.closest('.cosmic-card') && 
          !card.classList.contains('no-cosmic')) {
        card.classList.add('cosmic-card');
      }
    });
    
    // Add cosmic classes to headings
    document.querySelectorAll('h1, h2, h3').forEach(heading => {
      if (!heading.classList.contains('cosmic-title') && 
          !heading.closest('.cosmic-title') && 
          !heading.classList.contains('no-cosmic')) {
        heading.classList.add('cosmic-title');
      }
    });
  }

  /**
   * Clean up resources
   */
  destroy() {
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    
    if (this.mouseListener) {
      window.removeEventListener('mousemove', this.mouseListener);
    }
    
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
    
    // Remove stars and nebulae
    this.stars.forEach(star => star.element.remove());
    this.nebulae.forEach(nebula => nebula.element.remove());
    
    // Clear arrays
    this.stars = [];
    this.nebulae = [];
    
    this.initialized = false;
  }
}

// Create and export a singleton instance
const cosmicUIEnhancer = new CosmicUIEnhancer();

// Auto-initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  cosmicUIEnhancer.initialize();
});

export default cosmicUIEnhancer;