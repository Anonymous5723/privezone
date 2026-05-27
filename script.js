// PrivéZone — UX micro-interactions
(function () {
  'use strict';

  // === Back-to-top button ===
  var backBtn = document.createElement('button');
  backBtn.id = 'back-to-top';
  backBtn.setAttribute('aria-label', 'Retour en haut');
  backBtn.innerHTML = '&uarr;';
  document.body.appendChild(backBtn);

  function toggleBtn() {
    if (window.scrollY > 600) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', toggleBtn, { passive: true });
  backBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  toggleBtn();
})();
