// PrivéZone — UX micro-interactions
(function () {
  'use strict';

  // === Reading progress bar (article pages only) ===
  if (document.body.classList.contains('article-page')) {
    var progress = document.createElement('div');
    progress.className = 'reading-progress';
    document.body.appendChild(progress);

    function updateProgress() {
      var doc = document.documentElement;
      var scrolled = (doc.scrollTop || document.body.scrollTop);
      var total = (doc.scrollHeight - doc.clientHeight);
      var pct = total > 0 ? (scrolled / total) * 100 : 0;
      progress.style.width = pct + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  // === Back-to-top button ===
  var backBtn = document.createElement('button');
  backBtn.className = 'back-to-top';
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
