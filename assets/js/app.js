/* ============ 云游中国 · 前台公共逻辑 ============ */
(function () {
  'use strict';

  var IMG_BASE = 'assets/img/';

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
  window.galleryOf = function (a) {
    var list = (a.gallery && a.gallery.length) ? a.gallery : [a.id + '-g1.jpg', a.id + '-g2.jpg'];
    return list.map(asset);
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

  window.qs = function (key) {
    var m = new URLSearchParams(location.search);
    return m.get(key);
  };

  window.starsHTML = function (rating, size) {
    var r = Math.round((Number(rating) || 0) * 2) / 2;
    var out = '';
    for (var i = 1; i <= 5; i++) {
      if (r >= i) out += '<span style="color:var(--star)">★</span>';
      else if (r >= i - 0.5) out += '<span style="color:var(--star)">⯨</span>';
      else out += '<span style="color:#d8dde3">★</span>';
    }
    return out;
  };

  // ---------- 收藏 ----------
  function favKey() {
    var u = Store.session();
    return 'yunyou_favs_' + (u ? u.id : 'guest');
  }
  window.isFav = function (id) {
    try { return (JSON.parse(localStorage.getItem(favKey())) || []).indexOf(id) >= 0; } catch (e) { return false; }
  };
  window.toggleFav = function (id) {
    var u = Store.session();
    if (!u) { toast('请先登录后再收藏', 'error'); return false; }
    var key = favKey(); var arr = [];
    try { arr = JSON.parse(localStorage.getItem(key)) || []; } catch (e) { }
    var i = arr.indexOf(id);
    if (i >= 0) { arr.splice(i, 1); toast('已取消收藏'); }
    else { arr.push(id); toast('收藏成功', 'success'); }
    try { localStorage.setItem(key, JSON.stringify(arr)); } catch (e) { }
    return i < 0;
  };
  window.myFavs = function () {
    try { return JSON.parse(localStorage.getItem(favKey())) || []; } catch (e) { return []; }
  };

  // ---------- 提示 ----------
  window.toast = function (msg, type) {
    var wrap = document.querySelector('.toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'toast-wrap';
      document.body.appendChild(wrap);
    }
    var el = document.createElement('div');
    el.className = 'toast ' + (type || '');
    el.innerHTML = '<span>' + (type === 'error' ? '⚠️' : '✅') + '</span><span>' + esc(msg) + '</span>';
    wrap.appendChild(el);
    setTimeout(function () { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(function () { el.remove(); }, 300); }, 2600);
  };

  // ---------- 导航 ----------
  function currentPage() {
    var p = location.pathname.split('/').pop() || 'index.html';
    return p;
  }

  window.renderNav = function () {
    var host = document.getElementById('navbar');
    if (!host) return;
    var u = Store.session();
    var page = currentPage();
    var links = [
      { href: 'index.html', label: '首页', key: 'index.html' },
      { href: 'attractions.html', label: '景点大全', key: 'attractions.html' },
      { href: 'news.html', label: '旅游资讯', key: 'news.html' }
    ];
    var html = '<div class="navbar"><div class="container navbar-inner">';
    html += '<a class="brand" href="index.html"><span class="logo">🏔️</span>云游中国</a>';
    html += '<nav class="nav-links">';
    links.forEach(function (l) {
      html += '<a href="' + l.href + '" class="' + (page === l.key ? 'active' : '') + '">' + l.label + '</a>';
    });
    html += '</nav>';
    html += '<div class="nav-search"><input id="navSearchInput" type="text" placeholder="搜索你想去的景点…">' +
      '<button id="navSearchBtn" title="搜索">🔍</button></div>';
    html += '<div class="nav-user">';
    if (u) {
      html += '<span class="avatar">' + esc(u.nickname.charAt(0)) + '</span>';
      html += '<span class="name">' + esc(u.nickname) + '</span>';
      if (u.role === 'admin') html += '<a class="btn btn-ghost btn-sm" href="admin/index.html">后台管理</a>';
      html += '<a class="btn btn-ghost btn-sm" href="profile.html">个人中心</a>';
      html += '<button class="btn btn-ghost btn-sm" id="logoutBtn">退出</button>';
    } else {
      html += '<a class="btn btn-ghost btn-sm" href="login.html">登录</a>';
      html += '<a class="btn btn-primary btn-sm" href="register.html">注册</a>';
    }
    html += '</div></div></div>';
    host.innerHTML = html;

    var inp = document.getElementById('navSearchInput');
    var doSearch = function () {
      var q = inp.value.trim();
      if (q) location.href = 'attractions.html?q=' + encodeURIComponent(q);
    };
    document.getElementById('navSearchBtn').addEventListener('click', doSearch);
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') doSearch(); });
    var lo = document.getElementById('logoutBtn');
    if (lo) lo.addEventListener('click', function () { Store.logout(); toast('已退出登录'); setTimeout(function () { location.href = 'index.html'; }, 500); });
  };

  window.renderFooter = function () {
    var host = document.getElementById('footer');
    if (!host) return;
    var s = Store.settings();
    host.innerHTML =
      '<footer class="footer"><div class="container footer-inner">' +
      '<div><div class="brand">🏔️ ' + esc(s.siteName) + '</div><p>' + esc(s.slogan) + '。<br>一网览尽华夏好风光，让每一次出发都心中有数。</p></div>' +
      '<div><h4>快速导航</h4><a href="index.html">首页</a><a href="attractions.html">景点大全</a><a href="news.html">旅游资讯</a></div>' +
      '<div><h4>热门分类</h4><a href="attractions.html?cat=自然风光">自然风光</a><a href="attractions.html?cat=历史古迹">历史古迹</a><a href="attractions.html?cat=海滨度假">海滨度假</a><a href="attractions.html?cat=主题乐园">主题乐园</a></div>' +
      '<div><h4>关于本站</h4><a href="admin/login.html">后台管理入口</a><a href="register.html">注册账号</a><a href="login.html">用户登录</a></div>' +
      '</div><div class="copyright">' + esc(s.siteName) + ' · 基于 PHP + MySQL 的旅游景点介绍网站（演示版）</div></footer>';
  };

  // ---------- 通用：渲染景点卡片 ----------
  window.spotCardHTML = function (a) {
    return '<a class="spot-card" href="attraction.html?id=' + encodeURIComponent(a.id) + '">' +
      '<div class="cover"><img src="' + coverOf(a) + '" alt="' + esc(a.name) + '" loading="lazy" onerror="if(!this.dataset.f){this.dataset.f=1;this.src=\'assets/img/' + a.id + '-cover.svg\';}else{this.src=\'assets/img/default-cover.svg\';}">' +
      '<span class="badge' + (a.featured ? ' hot' : '') + '">' + (a.featured ? '🔥 热门推荐' : esc(a.category)) + '</span></div>' +
      '<div class="body"><h3>' + esc(a.name) + '</h3>' +
      '<div class="meta"><span>📍 ' + esc(a.province) + '</span><span>·</span><span>👁 ' + fmtNum(a.visits) + '</span></div>' +
      '<p class="summary">' + esc(a.summary) + '</p>' +
      '<div class="tags">' + a.tags.slice(0, 3).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') + '</div>' +
      '<div class="foot"><span class="rate">' + a.rating.toFixed(1) + ' <small>分</small></span>' +
      '<span class="more-link">查看详情 →</span></div></div></a>';
  };

  document.addEventListener('DOMContentLoaded', function () {
    renderNav();
    renderFooter();
  });
})();
