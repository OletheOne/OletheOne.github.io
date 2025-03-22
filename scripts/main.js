/**
 * Enhanced GameGuides Website JavaScript
 * Adds dynamic effects, particle backgrounds, and smooth transitions
 */
document.addEventListener('DOMContentLoaded', () => {
    // Intro animation elements
    const introAnimation = document.getElementById('intro-animation');
    const introBackground = document.getElementById('intro-background');
    const introContent = document.getElementById('intro-content');
    const exploreButton = document.getElementById('explore-button');
    const mainContent = document.getElementById('main-content');
    const body = document.body;
    
    // Run the animation sequence
    setTimeout(() => {
        introAnimation?.classList.add('animate');
    }, 500);
    
    // Button click completes the animation
    exploreButton?.addEventListener('click', (e) => {
        e.preventDefault();
        completeIntroAnimation();
        
        // Scroll to guides section after animation completes
        setTimeout(() => {
            const targetSection = document.getElementById(e.target.getAttribute('href').substring(1));
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }, 1000);
    });
    
    // Function to complete the intro animation
    function completeIntroAnimation() {
        if (!introAnimation) return;
        
        introAnimation.classList.add('complete');
        
        // Show main content after animation completes
        setTimeout(() => {
            if (mainContent) {
                mainContent.classList.add('visible');
                body.classList.remove('no-scroll');
            }
            
            // IMPORTANT: Completely remove the intro animation element after transition
            setTimeout(() => {
                if (introAnimation) {
                    introAnimation.style.display = 'none';
                    // Optional: Remove from DOM entirely
                    introAnimation.remove();
                }
            }, 2000); // Wait for the animation to complete before removing
        }, 500);
    }
    
    // Set flag when navigating to a guide
    document.querySelectorAll('a[href*="guides/"]').forEach(link => {
        link.addEventListener('click', () => {
            sessionStorage.setItem('fromGuide', 'true');
        });
    });
    
    // Check if we should show the intro (skip if returning from a guide)
    const fromGuide = sessionStorage.getItem('fromGuide');
    if (fromGuide && introAnimation) {
        // Skip animation if returning from a guide
        introAnimation.style.display = 'none';
        if (mainContent) {
            mainContent.classList.add('visible');
            body.classList.remove('no-scroll');
        }
        sessionStorage.removeItem('fromGuide');
    }
    
    // Handle missing background image
    if (introBackground) {
        const testBg = new Image();
        testBg.onerror = () => {
            introBackground.style.backgroundImage = 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)';
        };
        testBg.src = introBackground.style.backgroundImage.replace(/url\(['"]?([^'"]+)['"]?\)/, '$1');
    }
    
    // Variables for main site functionality
    const header = document.getElementById('main-header');
    const backToTopButton = document.getElementById('back-to-top');
    const progressBar = document.getElementById('progress-bar');
    const navToggle = document.getElementById('nav-toggle');
    const navList = document.querySelector('.nav__list');
    
    let lastScrollY = window.scrollY;
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if(this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if(targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Handle scroll events
    window.addEventListener('scroll', () => {
        // Progress bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) {
            progressBar.style.width = scrolled + "%";
        }
        
        // Back to top button visibility
        if (backToTopButton) {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }
        
        // Header appearance/disappearance on scroll
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
                
                if (window.scrollY > lastScrollY) {
                    header.classList.add('hidden');
                } else {
                    header.classList.remove('hidden');
                }
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        lastScrollY = window.scrollY;
    });
    
    // Back to top functionality
    if (backToTopButton) {
        backToTopButton.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Mobile navigation toggle
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }
    
    // Add active class to current section in navigation
    function setActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav__link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNavLink);
    
    // TOC highlighting based on scroll position (for guide pages)
    function highlightTocItem() {
        const sections = document.querySelectorAll('section[id], div[id^="part"]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            if (!section) return;
            
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.toc__link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
                
                document.querySelectorAll('.nav__link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightTocItem);
    
    // Handle video placeholder
    const videoElement = document.querySelector('video');
    const videoPlaceholder = document.querySelector('.video-placeholder');
    
    if (videoElement && videoPlaceholder) {
        // Initially hide the placeholder
        videoPlaceholder.style.display = 'none';
        
        // Show placeholder if video fails to load
        videoElement.addEventListener('error', () => {
            videoElement.style.display = 'none';
            videoPlaceholder.style.display = 'flex';
        });
        
        // Check if the source is accessible
        const videoSource = videoElement.querySelector('source');
        if (videoSource) {
            const testImage = new Image();
            testImage.onerror = () => {
                videoElement.style.display = 'none';
                videoPlaceholder.style.display = 'flex';
            };
            testImage.src = videoSource.src.replace('.mp4', '.jpg');
        }
    }
    
    // Check for missing images and apply fallbacks
    function handleMissingImages() {
        const images = document.querySelectorAll('[style*="background-image"]');
        
        images.forEach(img => {
            const style = getComputedStyle(img);
            const url = style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
            
            if (url) {
                const imageUrl = url[1];
                const tempImg = new Image();
                
                tempImg.onerror = () => {
                    // Apply a fallback gradient if image fails to load
                    const elementId = img.id;
                    if (elementId === 'hero' || elementId === 'intro-background') {
                        img.style.backgroundImage = 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)';
                    } else {
                        img.style.backgroundImage = 'none';
                        img.style.backgroundColor = 'var(--color-primary-light)';
                    }
                };
                
                tempImg.src = imageUrl;
            }
        });
    }
    
    handleMissingImages();
    
    // Add particle background effect (if page has particle container)
    const particleContainer = document.getElementById('particles-background');
    if (particleContainer) {
        createParticleBackground();
    }
    
    function createParticleBackground() {
        const particleCount = 100;
        const colors = ['rgba(0, 228, 255, 0.3)', 'rgba(255, 74, 110, 0.2)', 'rgba(255, 255, 255, 0.15)'];
        const maxSize = 5;
        const container = document.getElementById('particles-background');
        
        if (!container) return;
        
        for (let i = 0; i < particleCount; i++) {
            createParticle(container, colors, maxSize);
        }
    }
    
    function createParticle(container, colors, maxSize) {
        const particle = document.createElement('div');
        
        // Random particle style
        const size = Math.floor(Math.random() * maxSize) + 1;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Set particle position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Animation duration and delay
        const animationDuration = (Math.random() * 20) + 10;
        const animationDelay = Math.random() * 10;
        
        // Apply styles
        particle.style.cssText = `
            position: absolute;
            top: ${posY}%;
            left: ${posX}%;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
            animation: floatParticle ${animationDuration}s linear infinite;
            animation-delay: ${animationDelay}s;
        `;
        
        container.appendChild(particle);
    }
    
    // Add floating effect to guide cards on hover
    const guideCards = document.querySelectorAll('.guide-card');
    guideCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 15;
            const angleY = (centerX - x) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-8px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
    
    // Add typing effect to intro subtitle (if exists)
    const introSubtitle = document.querySelector('.intro-subtitle');
    if (introSubtitle && introSubtitle.textContent) {
        const text = introSubtitle.textContent;
        introSubtitle.textContent = '';
        
        // Only start typing effect after intro animation begins
        setTimeout(() => {
            let i = 0;
            const typingEffect = setInterval(() => {
                if (i < text.length) {
                    introSubtitle.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typingEffect);
                }
            }, 30);
        }, 1000);
    }
    
    // Animate guide parts on scroll
    const guideParts = document.querySelectorAll('.guide-part');
    
    function checkGuidePartsVisibility() {
        guideParts.forEach(part => {
            const rect = part.getBoundingClientRect();
            const isVisible = (rect.top <= window.innerHeight * 0.8);
            
            if (isVisible) {
                part.classList.add('animate-in');
            }
        });
    }
    
    // Add style for animation
    if (guideParts.length > 0) {
        const style = document.createElement('style');
        style.textContent = `
            .guide-part {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            .guide-part.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
        
        window.addEventListener('scroll', checkGuidePartsVisibility);
        // Initial check
        checkGuidePartsVisibility();
    }
    
    // Add glitch effect to headings for cyberpunk feel
    const headings = document.querySelectorAll('h1, h2');
    headings.forEach(heading => {
        heading.addEventListener('mouseover', () => {
            heading.classList.add('glitch-effect');
        });
        
        heading.addEventListener('mouseout', () => {
            heading.classList.remove('glitch-effect');
        });
    });
    
    // Add style for glitch effect
    const glitchStyle = document.createElement('style');
    glitchStyle.textContent = `
        @keyframes glitch {
            0% {
                transform: translate(0);
                text-shadow: 0 0 5px var(--color-accent);
            }
            20% {
                transform: translate(-2px, 2px);
                text-shadow: -1px 2px 0 rgba(255, 74, 110, 0.7), 1px -1px 0 rgba(0, 228, 255, 0.7);
            }
            40% {
                transform: translate(-2px, -2px);
                text-shadow: 1px 1px 0 rgba(255, 74, 110, 0.7), -1px -1px 0 rgba(0, 228, 255, 0.7);
            }
            60% {
                transform: translate(2px, 2px);
                text-shadow: -1px -1px 0 rgba(255, 74, 110, 0.7), 1px 1px 0 rgba(0, 228, 255, 0.7);
            }
            80% {
                transform: translate(2px, -2px);
                text-shadow: 1px -1px 0 rgba(255, 74, 110, 0.7), -1px 1px 0 rgba(0, 228, 255, 0.7);
            }
            100% {
                transform: translate(0);
                text-shadow: 0 0 5px var(--color-accent);
            }
        }
        
        .glitch-effect {
            animation: glitch 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
    `;
    document.head.appendChild(glitchStyle);
    
    // Animate numbers in lists/stats where applicable
    const animateNumbers = () => {
        document.querySelectorAll('.animate-number').forEach(element => {
            const finalNumber = parseInt(element.getAttribute('data-number'), 10);
            const duration = parseInt(element.getAttribute('data-duration') || '1000', 10);
            const startValue = 0;
            const increment = finalNumber / (duration / 16);
            
            let currentValue = startValue;
            const counter = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalNumber) {
                    element.textContent = finalNumber.toLocaleString();
                    clearInterval(counter);
                } else {
                    element.textContent = Math.floor(currentValue).toLocaleString();
                }
            }, 16);
        });
    };
    
    // Run number animation on elements when in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('animate-number')) {
                    animateNumbers();
                }
                observer.unobserve(entry.target);
            }
        });
    });
    
    document.querySelectorAll('.animate-number').forEach(element => {
        observer.observe(element);
    });
    
    // Initialize Reveal Effects for fade-in elements
    const revealOnScroll = function() {
        const elements = document.querySelectorAll('.fade-in');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if(elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for fade-in elements
    document.querySelectorAll('.fade-in').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', revealOnScroll);
    
    // Initial check for animations (after intro animation completes)
    setTimeout(revealOnScroll, 2000);
});