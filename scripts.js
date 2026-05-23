function init() {
      var host = window.location.hostname;
      var path = window.location.pathname.replace(/\/[^/]*$/, '') + '/worldcup_2026_v2.ics';

      // webcal:// links (used by Apple Calendar and other native apps)
      var webcalUrl = 'webcal://' + host + path;
      var webcalLinks = document.querySelectorAll('[id^="webcal-link"]');
      for (var i = 0; i < webcalLinks.length; i++) {
        webcalLinks[i].href = webcalUrl;
      }

      // Google Calendar links — MUST use webcal:// in the cid parameter
      var gcalUrl = 'https://calendar.google.com/calendar/u/0/r?cid=' + encodeURIComponent(webcalUrl);
      var gcalLinks = document.querySelectorAll('[id^="gcal-link"]');
      for (var i = 0; i < gcalLinks.length; i++) {
        gcalLinks[i].href = gcalUrl;
      }


    }

    // ─── Theme toggle ───
    (function () {
      var html = document.documentElement;
      var media = window.matchMedia('(prefers-color-scheme: light)');

      function applyTheme(isLight, save) {
        if (isLight) {
          html.setAttribute('data-theme', 'light');
        } else {
          html.removeAttribute('data-theme');
        }
        if (save) {
          localStorage.setItem('theme', isLight ? 'light' : 'dark');
        }
        var btn = document.getElementById('theme-toggle');
        if (btn) {
          btn.textContent = isLight ? '\u2600\uFE0F' : '\uD83C\uDF19';
        }
      }

      function getStored() { return localStorage.getItem('theme'); }

      // Initial: stored preference wins, else follow system
      var stored = getStored();
      if (stored === 'light') {
        applyTheme(true, false);
      } else if (stored === 'dark') {
        applyTheme(false, false);
      } else {
        applyTheme(media.matches, false);
      }

      // Listen to system changes — only if user hasn't manually set a preference
      media.addEventListener('change', function (e) {
        if (!getStored()) {
          applyTheme(e.matches, false);
        }
      });

      // Manual toggle
      var btn = document.getElementById('theme-toggle');
      if (btn) {
        btn.addEventListener('click', function () {
          var isLight = html.getAttribute('data-theme') === 'light';
          applyTheme(!isLight, true);
        });
      }
    })();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
