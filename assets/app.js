/**
 * gjsvip.edge — 渡劫的个人官网
 * 交互脚本（原生 JS，零外部依赖）：
 *   1. 主题切换（深色默认 / 亮色，localStorage 记忆）
 *   2. 终端 Hero 打字机效果（尊重 prefers-reduced-motion）
 *   3. scroll-reveal 入场动画（IntersectionObserver）
 *   4. 技能条动画与数字 count-up
 *   5. 卡片鼠标跟随高光、邮箱复制 Toast、页脚年份、顶栏滚动态
 */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;

  /* 标记 JS 可用：reveal 隐藏态仅在 .js 下生效，保证无 JS 时内容完整可见 */
  root.classList.add('js');

  var reduceMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- 1. 主题切换 ---------------- */
  var THEME_KEY = 'gjsvip-theme';
  var toggle = doc.getElementById('themeToggle');

  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* 无痕模式等场景下降级为仅本次会话生效 */
    }
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      applyTheme(currentTheme() === 'light' ? 'dark' : 'light');
    });
  }

  /* ---------------- 2. 页脚年份 ---------------- */
  var yearEl = doc.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------------- 3. Toast ---------------- */
  var toast = doc.getElementById('toast');
  var toastTimer = null;

  function showToast(message) {
    if (!toast) {
      return;
    }
    toast.textContent = message;
    toast.classList.add('show');
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 1800);
  }

  /* ---------------- 4. 复制邮箱 ---------------- */
  var mailButtons = doc.querySelectorAll('.copy-mail');

  function copyText(text, onSuccess, onFail) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess, onFail);
      return;
    }
    /* 降级：临时 textarea + execCommand */
    var textarea = doc.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    doc.body.appendChild(textarea);
    textarea.select();
    try {
      doc.execCommand('copy');
      onSuccess();
    } catch (e) {
      onFail();
    }
    doc.body.removeChild(textarea);
  }

  Array.prototype.forEach.call(mailButtons, function (btn) {
    btn.addEventListener('click', function () {
      var mail = btn.getAttribute('data-mail') || '';
      copyText(
        mail,
        function () {
          showToast('已复制邮箱：' + mail);
        },
        function () {
          showToast('复制失败，请手动复制：' + mail);
        }
      );
    });
  });

  /* ---------------- 5. 终端打字机 ---------------- */
  var termBody = doc.getElementById('termBody');
  /* 无 JS 时终端内已有静态完整内容；JS 就绪后先缓存，再清空重演 */
  var staticTermHtml = termBody ? termBody.innerHTML : '';

  var SCRIPT = [
    { type: 'cmd', text: 'whoami' },
    { type: 'out', html: '<strong>渡劫 · 全栈独立开发者</strong>' },
    { type: 'cmd', text: 'cat belief.txt' },
    { type: 'out', html: '「打开网页就能用。」——于是有了渡劫code' },
    { type: 'cmd', text: 'ls ./edge' },
    { type: 'out', html: '<span class="term-dim">workers/&nbsp;&nbsp;pages/&nbsp;&nbsp;d1/&nbsp;&nbsp;kv/&nbsp;&nbsp;r2/</span>' },
    { type: 'cmd', text: 'echo $STATUS' },
    { type: 'out', html: '渡劫中… 持续迭代' }
  ];

  function promptHtml() {
    return '<span class="term-prompt">gjsvip@edge</span>:<span class="term-path">~</span>$ ';
  }

  function typeCommand(text, done) {
    var line = doc.createElement('div');
    line.className = 'term-line';
    line.innerHTML = promptHtml();

    var cmd = doc.createElement('span');
    line.appendChild(cmd);

    /* 打字时显示临时光标 */
    var caret = doc.createElement('i');
    caret.className = 'cursor';
    line.appendChild(caret);

    termBody.appendChild(line);

    var i = 0;
    (function step() {
      if (i < text.length) {
        cmd.textContent += text.charAt(i);
        i += 1;
        setTimeout(step, 65);
      } else {
        line.removeChild(caret);
        setTimeout(done, 280);
      }
    }());
  }

  function printOutput(html, done) {
    var line = doc.createElement('div');
    line.className = 'term-line term-out';
    line.innerHTML = html;
    line.style.opacity = '0';
    termBody.appendChild(line);
    requestAnimationFrame(function () {
      line.style.transition = 'opacity 0.18s ease';
      line.style.opacity = '1';
    });
    setTimeout(done, 340);
  }

  function appendFinalCursor() {
    var line = doc.createElement('div');
    line.className = 'term-line';
    line.innerHTML = promptHtml() + '<i class="cursor"></i>';
    termBody.appendChild(line);
  }

  function runScript(index) {
    if (index >= SCRIPT.length) {
      appendFinalCursor();
      return;
    }
    var item = SCRIPT[index];
    if (item.type === 'cmd') {
      typeCommand(item.text, function () {
        runScript(index + 1);
      });
    } else {
      printOutput(item.html, function () {
        runScript(index + 1);
      });
    }
  }

  if (termBody) {
    if (reduceMotion) {
      /* 减少动态：保留静态内容，不播放打字机 */
      termBody.innerHTML = staticTermHtml;
    } else {
      termBody.innerHTML = '';
      setTimeout(function () {
        runScript(0);
      }, 350);
    }
  }

  /* ---------------- 6. scroll-reveal + 计数 + 技能条 ---------------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-target') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion || !isFinite(target)) {
      el.textContent = String(target) + suffix;
      return;
    }
    var startTime = null;
    var duration = 1200;

    function frame(timestamp) {
      if (startTime === null) {
        startTime = timestamp;
      }
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); /* easeOutCubic */
      el.textContent = String(Math.round(target * eased)) + suffix;
      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    }
    requestAnimationFrame(frame);
  }

  function activateStatsStrip(strip) {
    var nums = strip.querySelectorAll('.num');
    Array.prototype.forEach.call(nums, animateCount);
  }

  function whenVisible(el, callback) {
    if (!('IntersectionObserver' in window)) {
      callback();
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            callback();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
  }

  var revealEls = doc.querySelectorAll('.reveal');
  Array.prototype.forEach.call(revealEls, function (el) {
    whenVisible(el, function () {
      el.classList.add('visible');
    });
  });

  var statsStrip = doc.querySelector('.stats-strip');
  if (statsStrip) {
    whenVisible(statsStrip, function () {
      activateStatsStrip(statsStrip);
    });
  }

  /* ---------------- 7. 卡片鼠标跟随高光 ---------------- */
  var finePointer =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: fine)').matches;

  if (!reduceMotion && finePointer) {
    var spotlightCards = doc.querySelectorAll('.card, .panel');
    Array.prototype.forEach.call(spotlightCards, function (card) {
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', event.clientX - rect.left + 'px');
        card.style.setProperty('--my', event.clientY - rect.top + 'px');
      });
    });
  }

  /* ---------------- 7.5 移动端导航折叠 ----------------
     ≤720px 顶栏导航收进抽屉；点击链接 / 点击外部 / ESC 均关闭。 */
  var navToggle = doc.getElementById('navToggle');
  var siteNav = doc.getElementById('siteNav');

  function setNavOpen(open) {
    if (!navToggle || !siteNav) {
      return;
    }
    siteNav.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? '收起导航菜单' : '展开导航菜单');
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function (event) {
      event.stopPropagation();
      setNavOpen(!siteNav.classList.contains('open'));
    });

    /* 点击导航内任意链接后收起（锚点跳转） */
    Array.prototype.forEach.call(siteNav.querySelectorAll('a'), function (link) {
      link.addEventListener('click', function () {
        setNavOpen(false);
      });
    });

    /* 点击抽屉外部关闭 */
    doc.addEventListener('click', function (event) {
      if (!siteNav.classList.contains('open')) {
        return;
      }
      if (!siteNav.contains(event.target) && !navToggle.contains(event.target)) {
        setNavOpen(false);
      }
    });

    /* ESC 关闭 */
    doc.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        setNavOpen(false);
      }
    });

    /* 视口放大回桌面宽度时复位，避免残留 .open */
    if (typeof window.matchMedia === 'function') {
      var desktopMq = window.matchMedia('(min-width: 721px)');
      var onDesktop = function (e) {
        if (e.matches) {
          setNavOpen(false);
        }
      };
      if (typeof desktopMq.addEventListener === 'function') {
        desktopMq.addEventListener('change', onDesktop);
      } else if (typeof desktopMq.addListener === 'function') {
        desktopMq.addListener(onDesktop);
      }
    }
  }

  /* ---------------- 8. 顶栏滚动态 ---------------- */
  var header = doc.querySelector('.site-header');
  if (header) {
    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 8);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
