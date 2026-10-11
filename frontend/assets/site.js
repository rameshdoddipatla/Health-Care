// Dropdown menus (<details>): only one open at a time, close on outside click or Escape
document.querySelectorAll('.menu').forEach(function (d) {
  d.addEventListener('toggle', function () {
    if (d.open) {
      document.querySelectorAll('.menu[open]').forEach(function (o) {
        if (o !== d) o.removeAttribute('open');
      });
    }
  });
});
document.addEventListener('click', function (e) {
  document.querySelectorAll('.menu[open]').forEach(function (d) {
    if (!d.contains(e.target)) d.removeAttribute('open');
  });
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.menu[open]').forEach(function (d) { d.removeAttribute('open'); });
  }
});

// Date pickers can't select a day in the past
(function () {
  var now = new Date();
  var today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  document.querySelectorAll('input[type="date"]').forEach(function (i) { i.min = today; });
})();
