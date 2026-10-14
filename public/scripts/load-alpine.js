(function () {
  function loadAlpine() {
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js';
    s.defer = true;
    document.head.appendChild(s);
  }
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadAlpine, { timeout: 2000 });
  } else {
    window.addEventListener('load', function () {
      setTimeout(loadAlpine, 200);
    });
  }
})();
