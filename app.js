// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize copy functionality
    initializeCopyButtons();
    
    // Initialize smooth scroll
    initializeSmoothScroll();
    
    // Initialize success message system
    initializeSuccessMessage();
    
    // === Dynamisation du titre et du h1 avec le clientId ===
    // Fonction utilitaire pour extraire le paramètre 'client' de l'URL
    function getClientIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('client');
    }

    const clientId = getClientIdFromUrl();
    const h1Element = document.getElementById('dynamic-h1');
    const titleElement = document.getElementById('dynamic-title');
    const clientDynamic = document.getElementById('client-dynamic');
    let cadeauText;
    if (clientId) {
        cadeauText = `🎁 CADEAU offert à ${clientId} par Kays (Sirrtech) – 30 messages automatisés prêts à l'emploi`;
        if (clientDynamic) {
            clientDynamic.textContent = clientId + ' ';
        }
    } else {
        cadeauText = `🎁 CADEAU offert par Kays (Sirrtech) – 30 messages automatisés prêts à l'emploi`;
        if (clientDynamic) {
            clientDynamic.textContent = '';
        }
    }
    if (h1Element) {
        h1Element.textContent = cadeauText;
    }
    if (titleElement) {
        titleElement.textContent = cadeauText;
    }
    // Supprime la mention client s'il y en a une
    const clientMention = document.getElementById('client-mention');
    if (clientMention) {
        clientMention.remove();
    }

    // Affichage conditionnel du contenu après formulaire
    function showCategoriesSection() {
        const formSection = document.getElementById('leadmagnet-form-section');
        const categoriesSection = document.getElementById('categories-section');
        if (formSection) formSection.style.display = 'none';
        if (categoriesSection) categoriesSection.classList.remove('hidden');
    }

    function validateLeadmagnetForm(form) {
        const nom = form.nom.value.trim();
        const prenom = form.prenom.value.trim();
        const email = form.email.value.trim();
        const indicatif = form.indicatif.value;
        const telephone = form.telephone.value.trim();
        // Validation stricte email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!nom || !prenom || !email || !telephone || !indicatif) return false;
        if (!emailRegex.test(email)) return false;
        // Téléphone : au moins 9 chiffres (hors indicatif)
        if (!/^[0-9\s-]{9,}$/.test(telephone)) return false;
        return true;
    }

    // Prépare la liaison avec un endpoint (à compléter)
    async function submitLeadmagnetForm(form) {
        const data = {
            nom: form.nom.value.trim(),
            prenom: form.prenom.value.trim(),
            email: form.email.value.trim(),
            indicatif: form.indicatif.value,
            telephone: form.telephone.value.trim(),
        };
        // Remplace l'URL ci-dessous par ton endpoint réel
        const endpoint = '/api/leadmagnet';
        try {
            // À activer quand le backend sera prêt
            // const response = await fetch(endpoint, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
            // if (!response.ok) throw new Error('Erreur lors de l\'envoi');
            // return await response.json();
            return true; // Simulation OK
        } catch (err) {
            alert('Erreur lors de l\'envoi du formulaire.');
            return false;
        }
    }

    // Empêche l'affichage via l'inspecteur (obfuscation JS simple)
    function protectCategoriesSection() {
        setInterval(() => {
            const categoriesSection = document.getElementById('categories-section');
            const formSection = document.getElementById('leadmagnet-form-section');
            if (categoriesSection && !categoriesSection.classList.contains('hidden') && formSection && formSection.style.display !== 'none') {
                categoriesSection.classList.add('hidden');
            }
        }, 1000);
    }

    function showScrollArrows() {
        const arrows = document.getElementById('scroll-arrows');
        if (arrows) {
            arrows.classList.remove('hidden');
            // Masquer après 8 secondes
            setTimeout(() => {
                arrows.classList.add('hidden');
            }, 8000);
        }
    }

    const form = document.getElementById('leadmagnet-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (validateLeadmagnetForm(form)) {
                const sent = await submitLeadmagnetForm(form);
                if (sent) {
                    showCategoriesSection();
                    showScrollArrows();
                }
            } else {
                alert('Merci de remplir tous les champs correctement.');
            }
        });
    }
    protectCategoriesSection();
});

// Copy to clipboard functionality
function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const textToCopy = this.getAttribute('data-copy');
            const originalText = this.textContent;
            
            try {
                // Disable button during copy operation
                this.disabled = true;
                
                // Copy to clipboard
                await navigator.clipboard.writeText(textToCopy);
                
                // Update button state
                this.textContent = 'Copié !';
                this.classList.add('copied');
                
                // Show success message
                showSuccessMessage('Message copié dans le presse-papiers !');
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    this.textContent = originalText;
                    this.classList.remove('copied');
                    this.disabled = false;
                }, 2000);
                
            } catch (err) {
                console.error('Erreur lors de la copie:', err);
                
                // Fallback for older browsers
                fallbackCopyTextToClipboard(textToCopy, this, originalText);
            }
        });
    });
}

// Fallback copy function for older browsers
function fallbackCopyTextToClipboard(text, button, originalText) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            button.textContent = 'Copié !';
            button.classList.add('copied');
            showSuccessMessage('Message copié dans le presse-papiers !');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
                button.disabled = false;
            }, 2000);
        } else {
            throw new Error('Commande de copie échouée');
        }
    } catch (err) {
        console.error('Fallback: Impossible de copier', err);
        button.textContent = 'Erreur';
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 2000);
    }
    
    document.body.removeChild(textArea);
}

// Smooth scroll functionality
function initializeSmoothScroll() {
    const smoothScrollLinks = document.querySelectorAll('.smooth-scroll, a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Calculate offset for better positioning
                    const offset = 80; // Space from top
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Success message system
function initializeSuccessMessage() {
    // Create success message element if it doesn't exist
    if (!document.querySelector('.copy-success-message')) {
        const successMessage = document.createElement('div');
        successMessage.className = 'copy-success-message';
        successMessage.setAttribute('role', 'alert');
        successMessage.setAttribute('aria-live', 'polite');
        document.body.appendChild(successMessage);
    }
}

// Show success message
function showSuccessMessage(message) {
    const successElement = document.querySelector('.copy-success-message');
    
    if (successElement) {
        successElement.textContent = message;
        successElement.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            successElement.classList.remove('show');
        }, 3000);
    }
}

// Enhanced accordion functionality (optional, since HTML details/summary works natively)
function initializeAccordions() {
    const accordions = document.querySelectorAll('.category-accordion');
    
    accordions.forEach(accordion => {
        const summary = accordion.querySelector('.accordion-summary');
        
        summary.addEventListener('click', function() {
            // Add slight delay to allow native toggle to complete
            setTimeout(() => {
                const isOpen = accordion.hasAttribute('open');
                
                // Update ARIA attributes for accessibility
                summary.setAttribute('aria-expanded', isOpen);
                
                // Optional: Close other accordions (uncomment if you want only one open at a time)
                // if (isOpen) {
                //     accordions.forEach(otherAccordion => {
                //         if (otherAccordion !== accordion && otherAccordion.hasAttribute('open')) {
                //             otherAccordion.removeAttribute('open');
                //             otherAccordion.querySelector('.accordion-summary').setAttribute('aria-expanded', 'false');
                //         }
                //     });
                // }
            }, 10);
        });
        
        // Set initial ARIA state
        summary.setAttribute('aria-expanded', accordion.hasAttribute('open'));
    });
}

// Initialize accordions
document.addEventListener('DOMContentLoaded', function() {
    initializeAccordions();
});

// Utility function to handle keyboard navigation
document.addEventListener('keydown', function(e) {
    // Handle Enter key for copy buttons
    if (e.key === 'Enter' && e.target.classList.contains('copy-btn')) {
        e.target.click();
    }
    
    // Handle Escape key to close success message
    if (e.key === 'Escape') {
        const successMessage = document.querySelector('.copy-success-message.show');
        if (successMessage) {
            successMessage.classList.remove('show');
        }
    }
});

// Performance optimization: Debounce scroll events if needed
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

// Analytics tracking (optional - can be used with Google Analytics or other services)
function trackCopyEvent(messageType, channel) {
    // Example tracking - replace with your analytics service
    if (typeof gtag !== 'undefined') {
        gtag('event', 'copy_message', {
            event_category: 'engagement',
            event_label: `${messageType} - ${channel}`,
            value: 1
        });
    }
    
    console.log('Message copied:', messageType, channel);
}

// Enhanced copy functionality with analytics
function enhancedCopyHandler(button) {
    const messageCard = button.closest('.message-card');
    const messageType = messageCard ? messageCard.querySelector('.message-title').textContent : 'unknown';
    const channel = messageCard ? messageCard.querySelector('.channel-badge').textContent : 'unknown';
    
    trackCopyEvent(messageType, channel);
}

// Error handling for failed operations
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
});

// Intersection Observer for animations (optional enhancement)
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe message cards for subtle animations
    const messageCards = document.querySelectorAll('.message-card');
    messageCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Initialize scroll animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if user prefers reduced motion is not set
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        initializeScrollAnimations();
    }
});

// Accessibility enhancements
function enhanceAccessibility() {
    // Add skip link functionality
    const skipLinks = document.querySelectorAll('a[href^="#"]');
    skipLinks.forEach(link => {
        link.addEventListener('focus', function() {
            this.style.position = 'absolute';
            this.style.left = '0';
            this.style.top = '0';
            this.style.zIndex = '1000';
        });
        
        link.addEventListener('blur', function() {
            this.style.position = '';
            this.style.left = '';
            this.style.top = '';
            this.style.zIndex = '';
        });
    });
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', enhanceAccessibility);