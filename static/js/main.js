// SneakMax frontend contract: backend may replace the static data without changing the UI logic.

document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.burger');
  const header = document.querySelector('.site-header');
  burger?.addEventListener('click', () => {
    const open = header.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('.main-nav a').forEach((link) => {
    link.addEventListener('click', () => header.classList.remove('menu-open'));
  });

  document.querySelectorAll('.faq-item button').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      item.classList.toggle('is-open');
      button.querySelector('b').textContent = item.classList.contains('is-open') ? '×' : '+';
    });
  });

  document.querySelectorAll('.size').forEach((button) => {
    button.addEventListener('click', () => button.classList.toggle('is-selected'));
  });

  const minPrice = document.querySelector('#min-price');
  const maxPrice = document.querySelector('#max-price');
  const minValue = document.querySelector('#min-price-value');
  const maxValue = document.querySelector('#max-price-value');
  const formatPrice = (value) => Number(value).toLocaleString('ru-RU');
  const syncPrice = () => {
    let min = Number(minPrice.value);
    let max = Number(maxPrice.value);
    if (min > max) [min, max] = [max, min];
    minValue.textContent = formatPrice(min);
    maxValue.textContent = formatPrice(max);
  };
  minPrice?.addEventListener('input', syncPrice);
  maxPrice?.addEventListener('input', syncPrice);

  const quiz = document.querySelector('#quiz-form');
  const steps = [...document.querySelectorAll('.quiz-step')];
  const next = document.querySelector('#quiz-next');
  const progress = document.querySelector('#quiz-progress');
  let currentStep = 0;
  const renderStep = () => {
    steps.forEach((step, index) => step.classList.toggle('is-active', index === currentStep));
    progress.textContent = `${currentStep + 1} из ${steps.length}`;
    next.style.display = currentStep === steps.length - 1 ? 'none' : 'inline-flex';
  };
  next?.addEventListener('click', () => {
    if (currentStep < steps.length - 1) currentStep += 1;
    renderStep();
  });
  quiz?.addEventListener('submit', (event) => {
    event.preventDefault();
    // Replace with fetch('/your-endpoint/', { method: 'POST', ... }) when backend is ready.
  });

  const feedback = document.querySelector('#feedback-form');
  feedback?.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = feedback.querySelector('.form-message');
    message.textContent = 'Данные готовы к отправке.';
  });
});
