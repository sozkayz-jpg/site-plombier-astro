/**
 * Plombier Pro - Main JavaScript
 * Performance optimized, accessible, SEO-friendly
 */

(function() {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function() {
    const menuToggle = document.getElementById('menuToggle');
    const navMobile = document.getElementById('navMobile');
    const navOverlay = document.getElementById('navOverlay');
    const header = document.getElementById('header');

    if (menuToggle && navMobile) {
      menuToggle.addEventListener('click', function() {
        const isOpen = navMobile.classList.contains('open');
        navMobile.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', !isOpen);

        if (navOverlay) {
          navOverlay.classList.toggle('active', !isOpen);
        }

        const spans = menuToggle.querySelectorAll('span');
        if (!isOpen) {
          spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          spans[1].style.opacity = '0';
          spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
          spans[0].style.transform = '';
          spans[1].style.opacity = '1';
          spans[2].style.transform = '';
        }
      });

      navMobile.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
          navMobile.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
          if (navOverlay) {
            navOverlay.classList.remove('active');
          }
          const spans = menuToggle.querySelectorAll('span');
          spans[0].style.transform = '';
          spans[1].style.opacity = '1';
          spans[2].style.transform = '';
        });
      });

      if (navOverlay) {
        navOverlay.addEventListener('click', function() {
          navMobile.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
          navOverlay.classList.remove('active');
          const spans = menuToggle.querySelectorAll('span');
          spans[0].style.transform = '';
          spans[1].style.opacity = '1';
          spans[2].style.transform = '';
        });
      }
    }

    // Hero Slider
    const heroSlides = document.querySelectorAll('.hero__slide');
    const heroDots = document.querySelectorAll('.hero__dot');
    if (heroSlides.length > 0) {
      let currentSlide = 0;
      const totalSlides = heroSlides.length;
      function showSlide(index) {
        heroSlides.forEach(function(s, i) { s.classList.toggle('active', i === index); });
        heroDots.forEach(function(d, i) { d.classList.toggle('active', i === index); });
        currentSlide = index;
      }
      function nextSlide() {
        showSlide((currentSlide + 1) % totalSlides);
      }
      let slideInterval = setInterval(nextSlide, 5000);
      heroDots.forEach(function(dot, i) {
        dot.addEventListener('click', function() {
          clearInterval(slideInterval);
          showSlide(i);
          slideInterval = setInterval(nextSlide, 5000);
        });
      });
    }

    // Header scroll effect
    let lastScroll = 0;

    function handleScroll() {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      if (header) {
        if (currentScroll > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
      lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
      window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      }, { passive: true });

      backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function(item) {
      const question = item.querySelector('.faq__question');
      if (question) {
        question.addEventListener('click', function() {
          const isActive = item.classList.contains('active');
          faqItems.forEach(function(otherItem) {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
              const q = otherItem.querySelector('.faq__question');
              if (q) q.setAttribute('aria-expanded', 'false');
            }
          });
          item.classList.toggle('active');
          question.setAttribute('aria-expanded', !isActive);
        });
      }
    });

    // Scroll Animations
    const animatedElements = document.querySelectorAll('.fade-in');
    if (animatedElements.length > 0) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      animatedElements.forEach(function(el) {
        observer.observe(el);
      });
    }

    // Counter Animation for Stats
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (statNumbers.length > 0) {
      const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      statNumbers.forEach(function(el) {
        counterObserver.observe(el);
      });
    }

    function animateCounter(element) {
      const target = parseInt(element.getAttribute('data-target'), 10);
      const suffix = element.getAttribute('data-suffix') || '';
      const duration = 2000;
      const start = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);
        element.textContent = current + suffix;
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }
      requestAnimationFrame(update);
    }

    // Form Validation & Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');

        requiredFields.forEach(function(field) {
          if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = 'var(--danger)';
          } else {
            field.style.borderColor = '';
          }
        });

        if (!isValid) {
          showToast('Veuillez remplir tous les champs obligatoires.', 'error');
          return;
        }

        const emailField = contactForm.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(emailField.value)) {
            showToast('Veuillez entrer une adresse email valide.', 'error');
            emailField.style.borderColor = 'var(--danger)';
            return;
          }
        }

        if (submitBtn) {
          submitBtn.classList.add('loading');
          submitBtn.disabled = true;
          const originalText = submitBtn.innerHTML;
          submitBtn.innerHTML = 'Envoi en cours...';

          setTimeout(function() {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            contactForm.reset();
            showToast('Message envoyé avec succès ! Nous vous contacterons sous 24h.', 'success');
          }, 1500);
        }
      });
    }

    // Toast Notification
    function showToast(message, type) {
      const existingToast = document.querySelector('.toast');
      if (existingToast) {
        existingToast.remove();
      }
      const toast = document.createElement('div');
      toast.className = 'toast ' + (type || '');
      toast.textContent = message;
      toast.setAttribute('role', 'alert');
      document.body.appendChild(toast);
      void toast.offsetWidth;
      requestAnimationFrame(function() {
        toast.classList.add('show');
      });
      setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() {
          toast.remove();
        }, 300);
      }, 4000);
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      });
    });

    // Service Area Href Telephone tracking
    document.querySelectorAll('a[href^="tel:"]').forEach(function(telLink) {
      telLink.addEventListener('click', function() {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'click', {
            event_category: 'engagement',
            event_label: 'phone_call'
          });
        }
      });
    });

    // Lazy loading images fallback
    if ('loading' in HTMLImageElement.prototype) {
      document.querySelectorAll('img[data-src]').forEach(function(img) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    } else {
      const lazyImages = document.querySelectorAll('img[data-src]');
      if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          });
        });
        lazyImages.forEach(function(img) {
          imageObserver.observe(img);
        });
      }
    }
  });
})();
