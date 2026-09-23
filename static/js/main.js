document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFaq();
  initCatalogFilters();
  initQuiz();
  initProductQuantity();
  initContactMap();
});

function initMobileMenu() {
  const burger = document.querySelector('.burger');
  const header = document.querySelector('.site-header');
  if (!burger || !header) return;
  burger.addEventListener('click', () => {
    const isOpen = header.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });
  document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => {
    header.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
  }));
}

function initFaq() {
  document.querySelectorAll('.faq-item > button').forEach((button) => button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    if (!item) return;
    const isOpen = item.classList.toggle('is-open');
    const icon = button.querySelector('b');
    if (icon) icon.textContent = isOpen ? '×' : '+';
    button.setAttribute('aria-expanded', String(isOpen));
  }));
}

function initCatalogFilters() {
  const minPrice = document.querySelector('#min-price');
  const maxPrice = document.querySelector('#max-price');
  const minValue = document.querySelector('#min-price-value');
  const maxValue = document.querySelector('#max-price-value');

  const products = [...document.querySelectorAll('.product-card[data-price]')];

  const submit = document.querySelector('.filter-submit');
  const reset = document.querySelector('.filter-reset');

  const selectedSize = document.querySelector('#selected-size');

  if (!minPrice || !maxPrice || !products.length) return;

  const formatPrice = (value) =>
    Number(value).toLocaleString('ru-RU');

  function syncPriceValues() {
    let min = Number(minPrice.value);
    let max = Number(maxPrice.value);

    if (min > max) {
      [min, max] = [max, min];
    }

    if (minValue) {
      minValue.textContent = formatPrice(min);
    }

    if (maxValue) {
      maxValue.textContent = formatPrice(max);
    }
  }

  function getSelectedSizes() {
    return new Set(
      [...document.querySelectorAll('.size.is-selected')]
        .map(button => button.dataset.size)
    );
  }

  function getSelectedGenders() {
    return new Set(
      [...document.querySelectorAll('input[name="gender"]:checked')]
        .map(input => input.value)
    );
  }

  function applyFilters() {
    let min = Number(minPrice.value);
    let max = Number(maxPrice.value);

    if (min > max) {
      [min, max] = [max, min];
    }

    const selectedSizes = getSelectedSizes();
    const selectedGenders = getSelectedGenders();

    products.forEach(product => {
      const price = Number(product.dataset.price);
      const size = product.dataset.size;
      const gender = product.dataset.gender;

      const priceMatches =
        price >= min && price <= max;

      const sizeMatches =
        selectedSizes.size === 0 ||
        selectedSizes.has(size);

      const genderMatches =
        selectedGenders.size === 0 ||
        selectedGenders.has(gender);

      product.hidden = !(
        priceMatches &&
        sizeMatches &&
        genderMatches
      );
    });
  }

  minPrice.addEventListener('input', () => {
    syncPriceValues();
    applyFilters();
  });

  maxPrice.addEventListener('input', () => {
    syncPriceValues();
    applyFilters();
  });

  document.querySelectorAll('.size').forEach(button => {
    button.addEventListener('click', () => {
      button.classList.toggle('is-selected');

      if (selectedSize) {
        selectedSize.value = [...getSelectedSizes()].join(',');
      }

      applyFilters();
    });
  });

  document.querySelectorAll('input[name="gender"]').forEach(input => {
    input.addEventListener('change', applyFilters);
  });

  submit?.addEventListener('click', event => {
    event.preventDefault();
    applyFilters();
  });

  reset?.addEventListener('click', event => {
    event.preventDefault();

    document.querySelectorAll('.size.is-selected')
      .forEach(button => {
        button.classList.remove('is-selected');
      });

    document.querySelectorAll('input[name="gender"]:checked')
      .forEach(input => {
        input.checked = false;
      });

    minPrice.value = minPrice.min;
    maxPrice.value = maxPrice.max;

    if (selectedSize) {
      selectedSize.value = '';
    }

    products.forEach(product => {
      product.hidden = false;
    });

    syncPriceValues();
  });

  syncPriceValues();
}

function initQuiz() {
  const form = document.querySelector('#quiz-form');
  if (!form) return;
  const steps = [...form.querySelectorAll('.quiz-step')];
  const nextButton = document.querySelector('#quiz-next');
  const progress = document.querySelector('#quiz-progress');
  if (!steps.length || !nextButton || !progress) return;
  let currentStep = 0;

  function renderStep() {
    steps.forEach((step, index) => step.classList.toggle('is-active', index === currentStep));
    progress.textContent = `${currentStep + 1} из ${steps.length}`;
    nextButton.style.display = currentStep === steps.length - 1 ? 'none' : 'inline-flex';
  }

  function validateCurrentStep() {
    const step = steps[currentStep];
    if (currentStep === 0) return Boolean(step.querySelector('input[name="type"]:checked'));
    if (currentStep === 1) return Boolean(step.querySelector('input[name="size"]:checked'));
    return true;
  }

  nextButton.addEventListener('click', () => {
    const step = steps[currentStep];
    if (!validateCurrentStep()) {
      showQuizValidation(step);
      return;
    }
    if (currentStep < steps.length - 1) {
      currentStep += 1;
      renderStep();
    }
  });
  form.addEventListener('submit', () => {
    // Backend endpoint is intentionally controlled by the Django view/action.
    // Native browser validation remains enabled for name and email.
  });
  renderStep();
}

function showQuizValidation(step) {
  let message = step.querySelector('.quiz-validation-message');
  if (!message) {
    message = document.createElement('p');
    message.className = 'quiz-validation-message';
    message.setAttribute('role', 'alert');
    step.append(message);
  }
  message.textContent = 'Выберите вариант, чтобы продолжить.';
}

function initProductQuantity() {
  document.querySelectorAll('.buy-form input[type="number"], .cart-item__form input[type="number"]').forEach((input) => {
    input.addEventListener('change', () => {
      const min = Number(input.min || 1), max = Number(input.max || Infinity), value = Number(input.value || min);
      input.value = Math.min(max, Math.max(min, value));
    });
  });
}

function initContactMap() {
  const mapElement = document.querySelector('.map');
  if (!mapElement) return;

  const mapStylesheet = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  if (!document.querySelector(`link[href="${mapStylesheet}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = mapStylesheet;
    document.head.appendChild(link);
  }

  const loadLeaflet = (callback) => {
    if (window.L) {
      callback();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = callback;
    script.onerror = () => {
      console.warn('Не удалось загрузить Leaflet. Оставляем изображение карты.');
    };
    document.head.appendChild(script);
  };

  loadLeaflet(() => {
    const mapTarget = document.createElement('div');
    mapTarget.id = 'contacts-map';
    mapTarget.setAttribute('aria-label', 'Карта офиса SneakMax');
    mapElement.replaceChildren(mapTarget);

    const latitude = 59.92745;
    const longitude = 30.36112;
    const map = L.map(mapTarget, {
      scrollWheelZoom: false,
      attributionControl: true,
    }).setView([latitude, longitude], 16);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup('<strong>SneakMax</strong><br>г. Санкт-Петербург, Лиговский проспект, д. 30А')
      .openPopup();
  });
}
