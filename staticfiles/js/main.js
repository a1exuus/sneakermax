document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFaq();
  initCatalogFilters();
  initQuiz();
  initProductQuantity();
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
  const formatPrice = (value) => Number(value).toLocaleString('ru-RU');

  function syncPriceValues() {
    if (!minPrice || !maxPrice) return;
    let min = Number(minPrice.value), max = Number(maxPrice.value);
    if (min > max) [min, max] = [max, min];
    if (minValue) minValue.textContent = formatPrice(min);
    if (maxValue) maxValue.textContent = formatPrice(max);
  }

  function applyFilters() {
    if (!minPrice || !maxPrice) return;
    let min = Number(minPrice.value), max = Number(maxPrice.value);
    if (min > max) [min, max] = [max, min];
    const selectedSizes = new Set([...document.querySelectorAll('.size.is-selected')].map((b) => b.dataset.size || b.textContent.trim()));
    const selectedGenders = new Set([...document.querySelectorAll('input[name="gender"]:checked')].map((i) => i.value));
    products.forEach((product) => {
      const price = Number(product.dataset.price || 0);
      const priceMatches = price >= min && price <= max;
      const sizeMatches = selectedSizes.size === 0 || selectedSizes.has(product.dataset.size);
      const genderMatches = selectedGenders.size === 0 || selectedGenders.has(product.dataset.gender);
      product.hidden = !(priceMatches && sizeMatches && genderMatches);
    });
  }

  minPrice?.addEventListener('input', syncPriceValues);
  maxPrice?.addEventListener('input', syncPriceValues);
  document.querySelectorAll('.size').forEach((button) => button.addEventListener('click', () => {
    button.classList.toggle('is-selected');
    if (selectedSize) selectedSize.value = [...document.querySelectorAll('.size.is-selected')].map((b) => b.dataset.size || b.textContent.trim()).join(',');
  }));
  submit?.addEventListener('click', applyFilters);
  reset?.addEventListener('click', () => {
    document.querySelectorAll('.size.is-selected').forEach((button) => button.classList.remove('is-selected'));
    document.querySelectorAll('input[name="gender"]:checked').forEach((input) => { input.checked = false; });
    if (selectedSize) selectedSize.value = '';
    if (minPrice) minPrice.value = minPrice.min;
    if (maxPrice) maxPrice.value = maxPrice.max;
    products.forEach((product) => { product.hidden = false; });
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
