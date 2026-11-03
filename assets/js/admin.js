/* ============ 云游中国 · 后台公共逻辑 ============ */
(function () {
  'use strict';

  var IMG_BASE = '../assets/img/';
  window.IMG_BASE = IMG_BASE;

  function asset(p) {
    if (!p) return '';
    if (/^(data:|https?:|blob:)/.test(p)) return p;
    return IMG_BASE + p;
  }
  window.asset = asset;

  window.coverOf = function (a) {
    if (a.cover && /^(data:|blob:)/.test(a.cover)) return a.cover;
    return asset(a.id + '-cover.jpg');
  };

  window.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  window.fmtNum = function (n) {
    n = Number(n) || 0;
    if (n >= 10000) return (n / 10000).toFixed(1) + '万';
    return String(n);
  };

  window.starsHTML = function (r) {
    var x = Math.round((Number(r) || 0));
    var s = '';
    for (var i = 1; i <= 5; i++) s += i <= x ? '<span class="star">★</span>' : '<span style="color:#d8dde3">★</span>';
    return s;
  };

  window.toast = function (msg, type) {
    var wrap = document.querySelector('.toast-wrap');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
    var el = document.createElement('div');
    el.className = 'toast ' + (type || '');
    el.innerHTML = '<span>' + (type === 'error' ? '⚠️' : '✅') + '</span><span>' + esc(msg) + '</span>';
    wrap.appendChild(el);
    setTimeout(function () { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(function () { el.remove(); }, 300); }, 2400);
  };

  window.today = function () {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };

  var MENU = [
    { key: 'dashboard', href: 'index.html', label: '仪表盘', icon: '📊' },
    { key: 'attractions', href: 'attractions.html', label: '景点管理', icon: '🏞️' },
    { key: 'news', href: 'news.html', label: '资讯管理', icon: '📰' },
    { key: 'users', href: 'users.html', label: '用户管理', icon: '👥' },
    { key: 'comments', href: 'comments.html', label: '留言管理', icon: '💬' },
    { key: 'settings', href: 'settings.html', label: '账号设置', icon: '⚙️' }
  ];

  window.renderShell = function (activeKey, title) {
    var u = Store.session();
    if (!u || u.role !== 'admin') { location.href = 'login.html'; return; }

    var side = document.getElementById('sidebar');
    var html = '<div class="side-brand"><span class="logo">🏔️</span>云游中国</div><nav class="side-menu">';
    MENU.forEach(function (m) {
      html += '<a href="' + m.href + '" class="' + (m.key === activeKey ? 'active' : '') + '">' + m.icon + ' ' + m.label + '</a>';
    });
    html += '</nav><div class="side-foot">' +
      '<a href="../index.html">🌐 返回前台</a>' +
      '<a href="#" id="adminLogout">🚪 退出登录</a></div>';
    side.innerHTML = html;
    document.getElementById('adminLogout').addEventListener('click', function (e) {
      e.preventDefault(); Store.logout(); location.href = 'login.html';
    });

    var top = document.getElementById('topbar');
    top.innerHTML = '<div><h1>' + title + '</h1><div class="crumb">云游中国 · 后台管理</div></div>' +
      '<div class="right"><span style="font-size:13px;color:var(--muted)">' + esc(u.nickname) + '</span>' +
      '<span class="avatar">' + esc(u.nickname.charAt(0)) + '</span></div>';
  };

  // ---------- 弹窗 ----------
  window.openModal = function (title, bodyHTML, footHTML) {
    var old = document.querySelector('.modal-mask');
    if (old) old.remove();
    var mask = document.createElement('div');
    mask.className = 'modal-mask show';
    mask.innerHTML = '<div class="modal"><div class="m-head"><h3>' + esc(title) + '</h3>' +
      '<button class="close" data-close="1">✕</button></div>' +
      '<div class="m-body">' + bodyHTML + '</div>' +
      (footHTML ? '<div class="m-foot">' + footHTML + '</div>' : '') + '</div>';
    document.body.appendChild(mask);
    mask.addEventListener('click', function (e) { if (e.target === mask || e.target.getAttribute('data-close')) closeModal(); });
    return mask;
  };
  window.closeModal = function () {
    var m = document.querySelector('.modal-mask');
    if (m) m.remove();
  };
  window.mConfirm = function (msg, onOk) {
    var mask = openModal('操作确认', '<p style="margin:0;color:var(--text);font-size:14.5px">' + esc(msg) + '</p>',
      '<button class="a-btn a-btn-ghost" data-close="1">取消</button><button class="a-btn a-btn-danger" id="mOk">确认删除</button>');
    mask.querySelector('#mOk').addEventListener('click', function () { closeModal(); onOk(); });
  };

  // ---------- 文件转 DataURL ----------
  window.fileToDataURL = function (file, cb) {
    var r = new FileReader();
    r.onload = function () { cb(r.result); };
    r.readAsDataURL(file);
  };

  // 压缩图片后再转 DataURL，避免 localStorage 超限导致数据无法保存
  window.compressImage = function (file, maxW, cb) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var w = img.width, h = img.height;
        if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
        try {
          var canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          cb(canvas.toDataURL('image/jpeg', 0.8));
        } catch (e) { cb(reader.result); }
      };
      img.onerror = function () { cb(reader.result); };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };
})();
