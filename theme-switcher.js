/* =========================================================
   ASS Lyric Replacer — Theme Switcher UI
   Builds the button + dropdown from ThemeManager.list, so
   adding a theme to themes.js is enough to add it here too.
   Kept fully separate from script.js to avoid touching the
   app's existing logic/state.
   ========================================================= */

(function () {
  'use strict';

  function init() {
    if (!window.ThemeManager) return;

    var wrap = document.createElement('div');
    wrap.className = 'theme-switcher';
    wrap.setAttribute('data-theme-switcher', '');

    var btn = document.createElement('button');
    btn.className = 'theme-switcher-btn';
    btn.type = 'button';
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Đổi giao diện');
    btn.title = 'Đổi giao diện';
    btn.innerHTML = '<i class="fa-solid fa-palette"></i>';

    var panel = document.createElement('div');
    panel.className = 'theme-switcher-panel';
    panel.setAttribute('role', 'menu');

    var panelHeader = document.createElement('div');
    panelHeader.className = 'theme-switcher-panel-header';
    panelHeader.textContent = 'Chọn giao diện';
    panel.appendChild(panelHeader);

    var list = document.createElement('div');
    list.className = 'theme-switcher-list';

    var optionEls = {};

    window.ThemeManager.list.forEach(function (theme) {
      var opt = document.createElement('button');
      opt.type = 'button';
      opt.className = 'theme-switcher-option';
      opt.setAttribute('role', 'menuitemradio');
      opt.dataset.themeId = theme.id;

      var swatch = document.createElement('span');
      swatch.className = 'theme-swatch';
      swatch.style.background =
        'linear-gradient(135deg, ' + theme.swatch[0] + ' 0%, ' +
        theme.swatch[1] + ' 55%, ' + theme.swatch[2] + ' 100%)';

      var label = document.createElement('span');
      label.className = 'theme-switcher-option-label';
      label.textContent = theme.name;

      var check = document.createElement('i');
      check.className = 'fa-solid fa-check theme-switcher-check';

      opt.appendChild(swatch);
      opt.appendChild(label);
      opt.appendChild(check);

      opt.addEventListener('click', function () {
        window.ThemeManager.setTheme(theme.id);
        syncActive();
        closePanel();
      });

      list.appendChild(opt);
      optionEls[theme.id] = opt;
    });

    panel.appendChild(list);
    wrap.appendChild(btn);
    wrap.appendChild(panel);
    document.body.appendChild(wrap);

    function syncActive() {
      var current = window.ThemeManager.getCurrentId();
      Object.keys(optionEls).forEach(function (id) {
        optionEls[id].classList.toggle('active', id === current);
        optionEls[id].setAttribute('aria-checked', id === current ? 'true' : 'false');
      });
    }

    function openPanel() {
      wrap.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
    function closePanel() {
      wrap.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
    function togglePanel() {
      if (wrap.classList.contains('open')) closePanel();
      else openPanel();
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      togglePanel();
    });

    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) closePanel();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePanel();
    });

    syncActive();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
