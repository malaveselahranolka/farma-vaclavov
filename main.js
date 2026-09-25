const ENDPOINT = ''; // Až bude k dispozici služba pro odesílání (např. Formspree), vložte sem URL.

document.addEventListener('DOMContentLoaded', () => {
  // 1. Ready state for hero entrance animation
  requestAnimationFrame(() => {
    document.documentElement.classList.add('is-ready');
  });

  // 2. Footer current year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  // 3. Header solid state on scroll via IntersectionObserver
  const sentinel = document.querySelector('.hero-sentinel');
  const siteHeader = document.querySelector('.site-header');

  if (sentinel && siteHeader && 'IntersectionObserver' in window) {
    const headerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Sentinel passes above viewport top: hero has scrolled past threshold
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          siteHeader.classList.add('is-solid');
        } else {
          siteHeader.classList.remove('is-solid');
        }
      });
    }, {
      rootMargin: '0px 0px 0px 0px'
    });

    headerObserver.observe(sentinel);
  }

  // 4. Mobile navigation toggle and keyboard accessibility
  const menuToggle = document.getElementById('menu-toggle');
  const siteNav = document.getElementById('site-nav');

  if (menuToggle && siteNav && siteHeader) {
    const openMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'true');
      siteNav.classList.add('is-open');
      siteHeader.classList.add('is-menu-open');
    };

    const closeMenu = (returnFocus = true) => {
      menuToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('is-open');
      siteHeader.classList.remove('is-menu-open');
      if (returnFocus) {
        menuToggle.focus();
      }
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu(false);
      } else {
        openMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu(true);
      }
    });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (menuToggle.getAttribute('aria-expanded') === 'true') {
          closeMenu(false);
        }
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && menuToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu(false);
      }
    });
  }

  // 5. Scroll reveal animation via IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -8% 0px'
    });

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  }

  // 6. Contact form validation and submission
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const phoneInput = document.getElementById('form-phone');
  const messageInput = document.getElementById('form-message');
  const companyInput = document.getElementById('form-company');
  const submitBtn = document.getElementById('form-submit');
  const formStatus = document.getElementById('form-status');

  const nameError = document.getElementById('form-name-error');
  const emailError = document.getElementById('form-email-error');
  const messageError = document.getElementById('form-message-error');

  let hasSubmitted = false;

  const setFieldError = (input, errorEl, message) => {
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorEl.id);
    errorEl.textContent = message;
    errorEl.classList.add('is-visible');
  };

  const clearFieldError = (input, errorEl) => {
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    errorEl.textContent = '';
    errorEl.classList.remove('is-visible');
  };

  const clearAllErrors = () => {
    clearFieldError(nameInput, nameError);
    clearFieldError(emailInput, emailError);
    clearFieldError(messageInput, messageError);
  };

  const validateEmailFormat = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const validateName = () => {
    const val = nameInput.value.trim();
    if (!val) {
      setFieldError(nameInput, nameError, 'Vyplňte jméno a příjmení.');
      return false;
    }
    clearFieldError(nameInput, nameError);
    return true;
  };

  const validateEmail = () => {
    const val = emailInput.value.trim();
    if (!val) {
      setFieldError(emailInput, emailError, 'Vyplňte e-mail.');
      return false;
    }
    if (!validateEmailFormat(val)) {
      setFieldError(emailInput, emailError, 'Zadejte e-mail ve tvaru jmeno@domena.cz.');
      return false;
    }
    clearFieldError(emailInput, emailError);
    return true;
  };

  const validateMessage = () => {
    const val = messageInput.value.trim();
    if (!val) {
      setFieldError(messageInput, messageError, 'Napište, s čím vám můžeme pomoci.');
      return false;
    }
    clearFieldError(messageInput, messageError);
    return true;
  };

  nameInput.addEventListener('input', () => {
    if (hasSubmitted) validateName();
  });

  emailInput.addEventListener('input', () => {
    if (hasSubmitted) validateEmail();
  });

  messageInput.addEventListener('input', () => {
    if (hasSubmitted) validateMessage();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hasSubmitted = true;

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      if (!isNameValid) {
        nameInput.focus();
      } else if (!isEmailValid) {
        emailInput.focus();
      } else {
        messageInput.focus();
      }
      return;
    }

    // Check honeypot
    if (companyInput && companyInput.value.trim() !== '') {
      formStatus.textContent = 'Zpráva byla odeslána. Ozveme se vám co nejdříve.';
      form.reset();
      hasSubmitted = false;
      clearAllErrors();
      return;
    }

    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const phoneVal = phoneInput ? phoneInput.value.trim() : '';
    const messageVal = messageInput.value.trim();

    if (!ENDPOINT) {
      // mailto fallback mode
      formStatus.textContent = 'Otevírám váš e-mailový program s předvyplněnou zprávou. Pokud se neotevřel, napište přímo na s.sajnarova@seznam.cz.';

      const subject = encodeURIComponent('Dotaz z webu: ' + nameVal);
      let bodyText = 'Jméno: ' + nameVal + '\n' + 'E-mail: ' + emailVal;
      if (phoneVal) {
        bodyText += '\nTelefon: ' + phoneVal;
      }
      bodyText += '\n\n' + messageVal;

      const mailtoUrl = 'mailto:s.sajnarova@seznam.cz?subject=' + subject + '&body=' + encodeURIComponent(bodyText);
      window.location.href = mailtoUrl;
    } else {
      // Endpoint submission mode
      submitBtn.disabled = true;
      submitBtn.textContent = 'Odesílám…';
      form.setAttribute('aria-busy', 'true');
      formStatus.textContent = '';

      try {
        const response = await fetch(ENDPOINT, {
          method: 'POST',
          body: new FormData(form),
          headers: {
            Accept: 'application/json'
          }
        });

        if (response.ok) {
          formStatus.textContent = 'Zpráva byla odeslána. Ozveme se vám co nejdříve.';
          form.reset();
          hasSubmitted = false;
          clearAllErrors();
        } else {
          formStatus.textContent = 'Zprávu se nepodařilo odeslat. Zkuste to znovu, nebo napište přímo na s.sajnarova@seznam.cz.';
        }
      } catch (err) {
        formStatus.textContent = 'Zprávu se nepodařilo odeslat. Zkuste to znovu, nebo napište přímo na s.sajnarova@seznam.cz.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Odeslat zprávu';
        form.removeAttribute('aria-busy');
      }
    }
  });
});
