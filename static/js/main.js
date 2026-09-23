document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initFaq();
    initLandingFilters();
    initCatalogPageFilters();
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

function initLandingFilters() {
    const filters = document.querySelector('#catalog .filters');

    if (!filters) {
        return;
    }

    const minPrice = filters.querySelector('#min-price');
    const maxPrice = filters.querySelector('#max-price');
    const minValue = filters.querySelector('#min-price-value');
    const maxValue = filters.querySelector('#max-price-value');

    const products = [
        ...document.querySelectorAll('#catalog .product-card[data-price]')
    ];

    if (!minPrice || !maxPrice || !products.length) {
        return;
    }

    const formatPrice = (value) => {
        return Number(value).toLocaleString('ru-RU');
    };

    function updatePriceLabels() {
        minValue.textContent = formatPrice(minPrice.value);
        maxValue.textContent = formatPrice(maxPrice.value);
    }

    function applyFilters() {
        const min = Number(minPrice.value);
        const max = Number(maxPrice.value);

        const selectedSizes = new Set(
            [...filters.querySelectorAll('.size.is-selected')]
                .map(button => button.dataset.size)
        );

        const selectedGenders = new Set(
            [...filters.querySelectorAll('input[name="gender"]:checked')]
                .map(input => input.value)
        );

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
        if (Number(minPrice.value) > Number(maxPrice.value)) {
            minPrice.value = maxPrice.value;
        }

        updatePriceLabels();
        applyFilters();
    });

    maxPrice.addEventListener('input', () => {
        if (Number(maxPrice.value) < Number(minPrice.value)) {
            maxPrice.value = minPrice.value;
        }

        updatePriceLabels();
        applyFilters();
    });

    filters.querySelectorAll('.size').forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('is-selected');
            applyFilters();
        });
    });

    filters.querySelectorAll('input[name="gender"]').forEach(input => {
        input.addEventListener('change', applyFilters);
    });

    filters.querySelector('.filter-submit')?.addEventListener('click', applyFilters);

    filters.querySelector('.filter-reset')?.addEventListener('click', () => {
        filters.querySelectorAll('.size.is-selected').forEach(button => {
            button.classList.remove('is-selected');
        });

        filters.querySelectorAll('input[name="gender"]:checked').forEach(input => {
            input.checked = false;
        });

        minPrice.value = minPrice.min;
        maxPrice.value = maxPrice.max;

        products.forEach(product => {
            product.hidden = false;
        });

        updatePriceLabels();
    });

    updatePriceLabels();
}

function initCatalogPageFilters() {
    const filters = document.querySelector('.filters--sticky');

    if (!filters) {
        return;
    }

    const minPrice = filters.querySelector('#min-price');
    const maxPrice = filters.querySelector('#max-price');
    const minValue = filters.querySelector('#min-price-value');
    const maxValue = filters.querySelector('#max-price-value');
    const selectedSize = filters.querySelector('#selected-size');

    if (!minPrice || !maxPrice) {
        return;
    }

    const formatPrice = (value) => {
        return Number(value).toLocaleString('ru-RU');
    };

    function updatePriceLabels() {
        if (minValue) {
            minValue.textContent = formatPrice(minPrice.value);
        }

        if (maxValue) {
            maxValue.textContent = formatPrice(maxPrice.value);
        }
    }

    minPrice.addEventListener('input', () => {
        if (Number(minPrice.value) > Number(maxPrice.value)) {
            minPrice.value = maxPrice.value;
        }

        updatePriceLabels();
    });

    maxPrice.addEventListener('input', () => {
        if (Number(maxPrice.value) < Number(minPrice.value)) {
            maxPrice.value = minPrice.value;
        }

        updatePriceLabels();
    });

    filters.querySelectorAll('.size').forEach(button => {
        button.addEventListener('click', () => {
            filters.querySelectorAll('.size.is-selected').forEach(item => {
                item.classList.remove('is-selected');
            });

            button.classList.add('is-selected');

            if (selectedSize) {
                selectedSize.value = button.dataset.size;
            }
        });
    });

    updatePriceLabels();
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
