/* Prototipo de tienda mayorista + detal. Vanilla JS, sin dependencias.
   En producción este código se reemplaza por componentes renderizados en servidor
   (ver README). Aquí sirve para probar flujos, jerarquía y copy. */
(function () {
  'use strict';

  const C = window.COLORS, P = window.PRODUCTS, T = window.TIERS, B = window.BUSINESS;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Estado persistente (solo conveniencia del prototipo) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const state = {
    tab: store.get('tab', 'mayor'),     // pestaña de compra en la ficha: 'mayor' | 'detal'
    cart: store.get('cart-v2', [])         // [{id,color,size,qty}]
  };
  const save = () => { store.set('tab', state.tab); store.set('cart-v2', state.cart); };

  /* ---------- Formato y precios ---------- */
  const cop = n => '$' + Math.round(n).toLocaleString('es-CO');
  const round100 = n => Math.round(n / 100) * 100;
  const byId = id => P.find(p => p.id === id);
  const wholesale = (p, off) => round100(p.price * (1 - off));

  function cartUnits() { return state.cart.reduce((a, i) => a + i.qty, 0); }
  // El nivel se decide por piezas en todo el pedido (mezclando referencias, tallas y colores).
  function tierFor(units) { let t = null; T.forEach(x => { if (units >= x.min) t = x; }); return t; }
  function currentTier() { return tierFor(cartUnits()); }
  function nextTier() { const u = cartUnits(); return T.find(x => u < x.min) || null; }
  const isWholesale = () => !!currentTier();
  // Mismo precio para todo el pedido: detal por debajo de 12 piezas, por mayor desde 12.
  function unitPrice(p) {
    const t = currentTier();
    return t ? wholesale(p, t.off) : p.price;
  }
  function cartTotals() {
    const retail = state.cart.reduce((a, i) => a + byId(i.id).price * i.qty, 0);
    const total = state.cart.reduce((a, i) => a + unitPrice(byId(i.id)) * i.qty, 0);
    return { retail, total, saving: retail - total };
  }

  /* ---------- Siluetas SVG de prendas (placeholder de fotografía) ---------- */
  const SHAPES = {
    tee: 'M60 44 L86 32 Q100 44 114 32 L140 44 L170 74 L150 94 L140 84 L140 206 L60 206 L60 84 L50 94 L30 74 Z',
    oversize: 'M48 46 L82 32 Q100 46 118 32 L152 46 L182 88 L156 104 L147 92 L149 208 L51 208 L53 92 L44 104 L18 88 Z',
    crop: 'M58 58 L85 46 Q100 58 115 46 L142 58 L168 84 L150 100 L141 92 L141 150 L59 150 L59 92 L50 100 L32 84 Z',
    polo: 'M60 44 L86 30 L100 46 L114 30 L140 44 L170 74 L150 94 L140 84 L140 206 L60 206 L60 84 L50 94 L30 74 Z',
    hoodie: 'M56 54 L80 38 Q100 26 120 38 L144 54 L174 156 L152 162 L142 104 L142 208 L58 208 L58 104 L48 162 L26 156 Z',
    bra: 'M60 70 L78 44 L88 46 Q100 78 112 46 L122 44 L140 70 L142 128 L58 128 Z',
    legging: 'M70 30 L130 30 L135 62 L128 218 L108 218 L100 92 L92 218 L72 218 L65 62 Z',
    jogger: 'M63 30 L137 30 L143 72 L137 198 L141 214 L106 214 L108 198 L100 98 L92 198 L94 214 L59 214 L63 198 L57 72 Z',
    biker: 'M68 58 L132 58 L138 92 L139 158 L106 158 L100 114 L94 158 L61 158 L62 92 Z',
    short: 'M63 58 L137 58 L148 156 L106 156 L100 118 L94 156 L52 156 Z',
    bermuda: 'M62 44 L138 44 L146 176 L106 176 L100 110 L94 176 L54 176 Z',
    skirt: 'M66 60 L134 60 L150 150 Q100 162 50 150 Z',
    crew: 'M58 50 L84 38 Q100 48 116 38 L142 50 L176 170 L156 176 L142 110 L142 208 L58 208 L58 110 L44 176 L24 170 Z',
    jersey: 'M58 44 L84 30 L100 50 L116 30 L142 44 L172 76 L152 96 L142 86 L142 206 L58 206 L58 86 L48 96 L28 76 Z'
  };
  const DETAILS = {
    tee: '<path d="M86 32 Q100 50 114 32" />',
    oversize: '<path d="M82 32 Q100 54 118 32" />',
    crop: '<path d="M85 46 Q100 64 115 46" />',
    polo: '<path d="M100 46 L100 74" /><circle cx="100" cy="58" r="1.6" /><circle cx="100" cy="68" r="1.6" />',
    hoodie: '<path d="M80 38 Q100 72 120 38" /><path d="M72 150 L128 150 L122 180 L78 180 Z" /><path d="M94 60 L92 88 M106 60 L108 88" />',
    bra: '<path d="M60 112 L140 112" />',
    legging: '<path d="M65 46 L135 46" />',
    jogger: '<path d="M58 46 L142 46" /><path d="M96 40 L96 56 M104 40 L104 56" />',
    biker: '<path d="M64 72 L136 72" /><path d="M126 96 L136 96 L136 124 L128 124" />',
    short: '<path d="M60 72 L140 72" />',
    bermuda: '<path d="M60 58 L140 58" /><path d="M58 100 L76 100 L76 130 L56 130 M142 100 L124 100 L124 130 L144 130" />',
    skirt: '<path d="M66 74 L134 74" /><path d="M84 76 L78 152 M100 76 L100 156 M116 76 L122 152" />',
    crew: '<path d="M84 38 Q100 56 116 38" /><path d="M58 196 L142 196 M28 164 L46 170 M172 164 L154 170" />',
    jersey: ''
  };
  function lum(hex) {
    const n = parseInt(hex.slice(1), 16);
    return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  }
  let svgSeq = 0;
  function garmentSVG(type, colorKey, label) {
    const col = C[colorKey] || C.negro, hex = col.hex;
    const stroke = lum(hex) > 0.6 ? 'rgba(0,0,0,.28)' : 'rgba(255,255,255,.28)';
    const id = 'g' + (++svgSeq);
    let defs = '', fill = hex;
    if (col.stripes) {
      defs = `<defs><pattern id="${id}" width="24" height="10" patternUnits="userSpaceOnUse"><rect width="24" height="10" fill="${hex}"/><rect x="12" width="12" height="10" fill="${col.hex2}"/></pattern></defs>`;
      fill = `url(#${id})`;
    }
    if (col.metallic) {
      defs = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${col.hex2}"/><stop offset=".45" stop-color="${hex}"/><stop offset=".6" stop-color="${col.hex2}"/><stop offset="1" stop-color="#6E7175"/></linearGradient></defs>`;
      fill = `url(#${id})`;
    }
    const one = (t, tf) => `<g transform="${tf || ''}"><path class="g-body" d="${SHAPES[t]}" fill="${fill}" /><g class="g-det" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round">${DETAILS[t] || ''}</g></g>`;
    let inner;
    if (type === 'set') inner = one('bra', 'translate(-38 8) scale(.9)') + one('legging', 'translate(52 16) scale(.86)');
    else if (type === 'setskirt') inner = one('bra', 'translate(-30 20) scale(.9)') + one('skirt', 'translate(40 40) scale(.9)');
    else inner = one(type);
    // Camiseta de fútbol: cuello en V y ribetes con el color secundario, sin escudo.
    if (type === 'jersey' && col.hex2) {
      inner += `<g fill="none" stroke="${col.stripes ? hex : col.hex2}" stroke-width="5" stroke-linejoin="round"><path d="M84 30 L100 50 L116 30"/><path d="M28 76 L48 96 M172 76 L152 96"/></g>`;
    }
    return `<svg viewBox="0 0 200 240" role="img" aria-label="${label || 'Prenda'}" class="garment">${defs}${inner}</svg>`;
  }
  function swBg(key) {
    const c = C[key] || C.negro;
    if (c.stripes) return `repeating-linear-gradient(90deg, ${c.hex} 0 4px, ${c.hex2} 4px 8px)`;
    if (c.hex2) return `linear-gradient(135deg, ${c.hex} 0 62%, ${c.hex2} 62%)`;
    return c.hex;
  }

  /* ---------- Header, footer, drawer ---------- */
  // Menú: cada opción despliega sus categorías al pasar el cursor (o al tocar en móvil).
  const GARMENT_LABEL = {
    legging: 'Leggings', bra: 'Tops deportivos', set: 'Conjuntos', biker: 'Bikers',
    crop: 'Camisetas crop', oversize: 'Camisetas oversize', jogger: 'Joggers', tee: 'Camisetas deportivas',
    short: 'Pantalonetas', polo: 'Polos', bermuda: 'Bermudas', hoodie: 'Suéteres con capota',
    skirt: 'Faldas deportivas', setskirt: 'Conjuntos con falda', crew: 'Suéteres', jersey: 'Camisetas de fútbol'
  };
  const LINE_LABEL = { deportiva: 'Deportiva', casual: 'Casual' };
  const forGender = (p, g) => p.gender === g || p.gender === 'unisex';
  function featureCard(p, label) {
    if (!p) return '';
    return `<a class="mega-feat" href="producto.html?id=${p.id}">
      <div class="mega-img">${garmentSVG(p.garment, p.colors[0], p.name)}</div>
      <span class="eyebrow">${label}</span><b>${p.name}</b>
      <span class="small">${cop(p.price)} detal · <span class="b2b-t">${cop(wholesale(p, T[0].off))} por mayor</span></span>
    </a>`;
  }
  function genderMenu(g) {
    const cols = ['deportiva', 'casual'].filter(line => P.some(p => forGender(p, g) && p.line === line)).map(line => {
      const ps = P.filter(p => forGender(p, g) && p.line === line);
      const types = [...new Set(ps.map(p => p.garment))];
      return `<div class="mega-col">
        <a class="mega-h" href="catalogo.html?genero=${g}&linea=${line}">${LINE_LABEL[line]}</a>
        <ul>${types.map(t => `<li><a href="catalogo.html?genero=${g}&linea=${line}&prenda=${t}">${GARMENT_LABEL[t]}<small>${ps.filter(p => p.garment === t).length}</small></a></li>`).join('')}
          <li><a class="mega-all" href="catalogo.html?genero=${g}&linea=${line}">Ver todo ${LINE_LABEL[line].toLowerCase()}</a></li></ul>
      </div>`;
    }).join('');
    const quick = `<div class="mega-col">
      <span class="mega-h">Destacados</span>
      <ul><li><a href="catalogo.html?genero=${g}&tag=nuevo">Novedades</a></li>
        <li><a href="catalogo.html?genero=${g}&tag=bestseller">Más vendidos</a></li>
        <li><a href="catalogo.html?genero=${g}&vista=lista">Pedido por mayor</a></li>
        <li><a class="mega-all" href="catalogo.html?genero=${g}">Ver todo ${g === 'mujer' ? 'Mujer' : 'Hombre'}</a></li></ul>
    </div>`;
    const feat = P.find(p => p.gender === g && p.tags.includes('bestseller'));
    return cols + quick + featureCard(feat, 'Más vendido');
  }
  function tagMenu(tag, label) {
    const cols = ['mujer', 'hombre'].map(g => {
      const ps = P.filter(p => forGender(p, g) && p.tags.includes(tag));
      return `<div class="mega-col">
        <a class="mega-h" href="catalogo.html?genero=${g}&tag=${tag}">${g === 'mujer' ? 'Mujer' : 'Hombre'}</a>
        <ul>${ps.map(p => `<li><a href="producto.html?id=${p.id}">${p.name}</a></li>`).join('')}
          <li><a class="mega-all" href="catalogo.html?genero=${g}&tag=${tag}">Ver todo</a></li></ul>
      </div>`;
    }).join('');
    const feats = P.filter(p => p.tags.includes(tag)).slice(0, 2);
    return cols + feats.map(p => featureCard(p, label)).join('');
  }
  function b2bMenu() {
    return `<div class="mega-col">
        <span class="mega-h">Cómo comprar por mayor</span>
        <ul><li><a href="mayoristas.html">Cómo funciona</a></li>
          <li><a href="mayoristas.html#niveles">Precios por cantidad</a></li>
          <li><a href="catalogo.html?vista=lista">Pedido por mayor</a></li>
          <li><a href="mayoristas.html#faq">Preguntas de mayoristas</a></li>
          <li><a href="mayoristas.html#asesor">Hablar con un asesor</a></li></ul>
      </div>
      <div class="mega-col mega-tiers">
        <span class="mega-h">Precio según piezas en tu pedido</span>
        <ul>${T.map((t, i) => `<li><span>${t.name}</span><span>${t.min}${T[i + 1] ? '–' + (T[i + 1].min - 1) : '+'} pzs · −${t.off * 100}%</span></li>`).join('')}</ul>
        <p class="small muted">Mezcla referencias, tallas y colores para llegar a ${T[0].min} piezas.</p>
        <a class="btn btn-b2b sm" href="catalogo.html?vista=lista">Armar pedido por mayor</a>
      </div>`;
  }
  const NAV = [
    { href: 'catalogo.html?genero=mujer', label: 'Mujer', menu: () => genderMenu('mujer') },
    { href: 'catalogo.html?genero=hombre', label: 'Hombre', menu: () => genderMenu('hombre') },
    { href: 'catalogo.html?tag=nuevo', label: 'Novedades', menu: () => tagMenu('nuevo', 'Nuevo') },
    { href: 'catalogo.html?tag=bestseller', label: 'Más vendidos', menu: () => tagMenu('bestseller', 'Más vendido') },
    { href: 'mayoristas.html', label: 'Comprar por mayor', menu: b2bMenu, cls: 'nav-b2b' }
  ];
  const ANNOUNCE = [
    'Precio por mayor desde <b>' + T[0].min + ' piezas</b> mezclando referencias, tallas y colores',
    'Envío gratis a toda Colombia desde <b>' + B.wholesaleFreeShippingUnits + ' piezas</b> o <b>' + cop(B.retailFreeShipping) + '</b> al detal',
    'Paga con PSE, Nequi, Bancolombia o tarjeta · Despacho en <b>' + B.dispatch + '</b>'
  ];

  function header() {
    const el = $('#site-header');
    if (!el) return;
    el.innerHTML = `
      <div class="announce" aria-live="polite"><p id="announce-text">${ANNOUNCE[0]}</p></div>
      <div class="bar wrap">
        <button class="icon-btn only-m" id="menu-btn" aria-label="Abrir menú" aria-expanded="false">
          <svg viewBox="0 0 24 24" width="22" height="22"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="1.8" fill="none"/></svg>
        </button>
        <nav class="nav" id="nav" aria-label="Principal">
          ${NAV.map((n, k) => `<div class="nav-item">
            <a href="${n.href}" class="nav-top ${n.cls || ''}" aria-haspopup="true" aria-expanded="false" aria-controls="mega-${k}">${n.label}</a>
            <div class="mega" id="mega-${k}"><div class="wrap mega-in">${n.menu()}</div></div>
          </div>`).join('')}
        </nav>
        <a href="index.html" class="logo" aria-label="Inicio">MARCA<span>®</span></a>
        <div class="bar-actions">
        <form class="search" role="search" action="catalogo.html">
          <label for="q" class="sr">Buscar</label>
          <input id="q" name="q" type="search" placeholder="Buscar prenda, color o SKU" autocomplete="off" />
          <div class="suggest" id="suggest" hidden></div>
        </form>
        <button class="icon-btn cart-btn" id="cart-btn" aria-label="Abrir pedido">
          <svg viewBox="0 0 24 24" width="22" height="22"><path d="M5 8h14l-1 12H6L5 8Zm4 0V6a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="1.8" fill="none"/></svg>
          <span class="count" id="cart-count">0</span>
        </button>
        </div>
      </div>`;

    // En la Home el encabezado va transparente sobre la foto y se vuelve blanco al bajar.
    const solid = () => el.classList.toggle('solid', !document.body.classList.contains('home') || scrollY > 40);
    solid();
    addEventListener('scroll', solid, { passive: true });

    // Anuncio rotativo
    let i = 0;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) setInterval(() => {
      const p = $('#announce-text');
      p.classList.add('out');
      setTimeout(() => { i = (i + 1) % ANNOUNCE.length; p.innerHTML = ANNOUNCE[i]; p.classList.remove('out'); }, 300);
    }, 4200);

    $('#cart-btn').addEventListener('click', openCart);
    // Escritorio: abre al pasar el cursor, con una pequeña espera para no parpadear al cruzar el menú.
    // Móvil: el primer toque despliega la lista en lugar de navegar.
    const items = $$('.nav-item');
    const setOpen = (it, open) => { it.classList.toggle('open', open); $('.nav-top', it).setAttribute('aria-expanded', open); };
    const desktop = () => matchMedia('(min-width: 1024px) and (hover: hover)').matches;
    items.forEach(it => {
      let t;
      it.addEventListener('mouseenter', () => { if (!desktop()) return; clearTimeout(t); t = setTimeout(() => { items.forEach(o => setOpen(o, o === it)); }, 90); });
      it.addEventListener('mouseleave', () => { if (!desktop()) return; clearTimeout(t); t = setTimeout(() => setOpen(it, false), 160); });
      it.addEventListener('focusin', () => { if (desktop()) items.forEach(o => setOpen(o, o === it)); });
      it.addEventListener('focusout', e => { if (!it.contains(e.relatedTarget)) setOpen(it, false); });
      $('.nav-top', it).addEventListener('click', e => {
        if (desktop()) return;
        e.preventDefault();
        const open = !it.classList.contains('open');
        items.forEach(o => setOpen(o, false));
        setOpen(it, open);
      });
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') items.forEach(o => setOpen(o, false)); });
    $('#menu-btn').addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      $('#menu-btn').setAttribute('aria-expanded', open);
    });
    searchSuggest();
  }

  function searchSuggest() {
    const input = $('#q'), box = $('#suggest');
    const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    input.addEventListener('input', () => {
      const q = norm(input.value.trim());
      if (q.length < 2) { box.hidden = true; return; }
      const hits = P.filter(p => norm(p.name + ' ' + p.sku + ' ' + p.colors.map(c => C[c].name).join(' ') + ' ' + p.cat).includes(q)).slice(0, 5);
      const colorHit = Object.entries(C).find(([, v]) => v.role !== 'equipo' && v.role !== 'web' && norm(v.name).includes(q));
      box.innerHTML = (colorHit ? `<a href="catalogo.html?color=${colorHit[0]}" class="sg-color"><i style="background:${swBg(colorHit[0])}"></i>Ver todo en ${colorHit[1].name}</a>` : '') +
        (hits.length ? hits.map(p => `<a href="producto.html?id=${p.id}"><span>${p.name}</span><code>${p.sku}</code></a>`).join('')
                     : `<p>Sin resultados para “${input.value}”. Prueba con “legging”, “oversize” o un color.</p>`);
      box.hidden = false;
    });
    input.addEventListener('blur', () => setTimeout(() => { box.hidden = true; }, 150));
  }

  function footer() {
    const el = $('#site-footer');
    if (!el) return;
    el.innerHTML = `
      <div class="wrap foot">
        <div>
          <a href="index.html" class="logo">MARCA<span>®</span></a>
          <p class="muted">Ropa deportiva, conjuntos de gimnasio, camisetas de fútbol y ropa casual para hombre y mujer. Venta al por mayor y al detal con envío a toda Colombia.</p>
          <p class="muted small">[DATO REQUERIDO] Razón social · NIT · Dirección de bodega · Horario de atención</p>
        </div>
        <div><h4>Comprar</h4><a href="catalogo.html?genero=mujer">Mujer</a><a href="catalogo.html?genero=hombre">Hombre</a><a href="catalogo.html?tag=nuevo">Novedades</a><a href="catalogo.html?tag=bestseller">Más vendidos</a></div>
        <div><h4>Mayoristas</h4><a href="mayoristas.html">Cómo funciona</a><a href="mayoristas.html#niveles">Precios por volumen</a><a href="catalogo.html?vista=lista">Pedido rápido</a><a href="mayoristas.html#asesor">Hablar con un asesor</a></div>
        <div><h4>Ayuda</h4><a href="mayoristas.html#faq">Preguntas frecuentes</a><a href="#">Envíos y tiempos</a><a href="#">Cambios y devoluciones</a><a href="#">Guía de tallas</a></div>
      </div>
      <div class="wrap legal small muted">Prototipo navegable · precios, mínimos y stock son supuestos de demostración.</div>`;
  }

  function waLink(text) { return 'https://wa.me/' + B.whatsapp + '?text=' + encodeURIComponent(text); }
  function waFloat() {
    const a = document.createElement('a');
    a.className = 'wa-float';
    a.target = '_blank'; a.rel = 'noopener';
    a.href = waLink('Hola, quiero información para comprar al por mayor.');
    a.setAttribute('aria-label', 'Hablar con un asesor por WhatsApp');
    a.innerHTML = '<svg viewBox="0 0 32 32" width="26" height="26"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.6c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6Zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-1.9-.9-3.2-2-4.2-3.8-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.6.7.6-.1 1.9-.8 2.1-1.5.3-.7.3-1.4.2-1.5 0-.1-.2-.2-.5-.4Z"/></svg><span>Asesor</span>';
    document.body.appendChild(a);
  }

  function drawer() {
    const d = document.createElement('div');
    d.innerHTML = `
      <div class="scrim" id="scrim" hidden></div>
      <aside class="drawer" id="drawer" aria-label="Tu pedido" aria-hidden="true">
        <header class="drawer-h"><h2 id="drawer-title">Tu pedido</h2><button class="icon-btn" id="drawer-close" aria-label="Cerrar">✕</button></header>
        <div class="drawer-tier" id="drawer-tier"></div>
        <div class="drawer-items" id="drawer-items"></div>
        <footer class="drawer-f" id="drawer-f"></footer>
      </aside>
      <div class="toast" id="toast" role="status" hidden></div>`;
    document.body.appendChild(d);
    $('#drawer-close').addEventListener('click', closeCart);
    $('#scrim').addEventListener('click', closeCart);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });
  }
  function openCart() {
    renderCart();
    $('#scrim').hidden = false;
    $('#drawer').classList.add('open');
    $('#drawer').setAttribute('aria-hidden', 'false');
    $('#drawer-close').focus();
  }
  function closeCart() {
    $('#scrim').hidden = true;
    $('#drawer').classList.remove('open');
    $('#drawer').setAttribute('aria-hidden', 'true');
  }

  const pz = n => n + (n === 1 ? ' pieza' : ' piezas');
  function tierMeter(compact) {
    const u = cartUnits(), cur = currentTier(), nxt = nextTier();
    const goal = nxt ? nxt.min : T[T.length - 1].min;
    const pct = Math.min(100, u / goal * 100);
    let msg;
    if (!cur) msg = `Llevas <b>${pz(u)}</b>. Agrega <b>${pz(T[0].min - u)}</b> más (de cualquier prenda) y todo el pedido pasa a <b>precio por mayor</b> (−${T[0].off * 100}%).`;
    else if (nxt) msg = `<b>Precio ${cur.name}</b> activo con ${pz(u)} (−${cur.off * 100}%). Suma <b>${pz(nxt.min - u)}</b> y pasas a ${nxt.name} (−${nxt.off * 100}%).`;
    else msg = `<b>Precio ${cur.name}</b> activo con ${pz(u)}: tienes el mejor precio (−${cur.off * 100}%).`;
    return `<div class="meter ${compact ? 'compact' : ''}">
      <p>${msg}</p>
      <div class="track" aria-hidden="true"><span style="width:${pct}%"></span>${T.map(t => `<i style="left:${Math.min(100, t.min / goal * 100)}%"></i>`).join('')}</div>
    </div>`;
  }

  function renderCart() {
    const items = $('#drawer-items'), f = $('#drawer-f'), tier = $('#drawer-tier');
    $('#drawer-title').textContent = 'Tu pedido';
    if (!state.cart.length) {
      tier.innerHTML = '';
      items.innerHTML = `<div class="empty"><p>Aún no has agregado prendas.</p><a class="btn" href="catalogo.html">Ver catálogo</a></div>`;
      f.innerHTML = '';
      return;
    }
    tier.innerHTML = tierMeter(true);
    // Agrupar por producto para que un pedido de 40 líneas siga siendo legible
    const groups = {};
    state.cart.forEach((it, idx) => { (groups[it.id] = groups[it.id] || []).push({ ...it, idx }); });
    items.innerHTML = Object.entries(groups).map(([id, lines]) => {
      const p = byId(id), units = lines.reduce((a, l) => a + l.qty, 0);
      return `<div class="line">
        <a href="producto.html?id=${id}" class="line-img" style="background:var(--paper-2)">${garmentSVG(p.garment, lines[0].color, p.name)}</a>
        <div class="line-body">
          <div class="line-top"><a href="producto.html?id=${id}">${p.name}</a><b>${cop(unitPrice(p) * units)}</b></div>
          <code class="muted">${p.sku} · ${units} u. × ${cop(unitPrice(p))}</code>
          <ul class="line-vars">${lines.map(l => `<li><i class="sw" style="background:${swBg(l.color)}"></i>${C[l.color].name} · ${l.size}
            <span class="qty sm"><button data-dec="${l.idx}" aria-label="Restar">−</button><output>${l.qty}</output><button data-inc="${l.idx}" aria-label="Sumar">+</button></span></li>`).join('')}</ul>
        </div>
      </div>`;
    }).join('');
    $$('[data-inc]', items).forEach(b => b.addEventListener('click', () => { state.cart[b.dataset.inc].qty++; afterCartChange(); }));
    $$('[data-dec]', items).forEach(b => b.addEventListener('click', () => {
      const i = +b.dataset.dec; state.cart[i].qty--; if (state.cart[i].qty <= 0) state.cart.splice(i, 1); afterCartChange();
    }));
    const t = cartTotals(), w = isWholesale();
    f.innerHTML = `
      <dl class="totals">
        <div><dt>Piezas</dt><dd>${cartUnits()}</dd></div>
        <div><dt>Tipo de precio</dt><dd>${w ? currentTier().name : 'Detal'}</dd></div>
        ${w ? `<div><dt>Precio detal</dt><dd class="strike">${cop(t.retail)}</dd></div><div class="save"><dt>Ahorro por mayor</dt><dd>−${cop(t.saving)}</dd></div>` : ''}
        <div class="grand"><dt>Total</dt><dd>${cop(t.total)}</dd></div>
      </dl>
      <a class="btn ${w ? 'btn-b2b' : ''} block" href="checkout.html">${w ? 'Finalizar pedido por mayor' : 'Comprar al detal'}</a>
      <a class="btn ghost block" target="_blank" rel="noopener" href="${waLink(orderText())}">Enviar pedido a un asesor por WhatsApp</a>
      <p class="small muted center">PSE · Nequi · Bancolombia · Tarjeta${w ? '' : ' · Addi · Contraentrega'}</p>`;
  }

  function orderText() {
    const t = cartTotals(), tier = currentTier();
    const lines = state.cart.map(i => { const p = byId(i.id); return `• ${p.sku} ${p.name} – ${C[i.color].name} ${i.size} × ${i.qty}`; });
    return `Hola, quiero hacer este pedido:\n${lines.join('\n')}\n\nPiezas: ${cartUnits()}\nPrecio: ${tier ? tier.name : 'Detal'}\nTotal estimado: ${cop(t.total)}\nCiudad de envío: `;
  }

  function afterCartChange(bump) {
    save();
    const c = $('#cart-count');
    if (c) {
      c.textContent = cartUnits();
      c.hidden = !cartUnits();
      if (bump) { c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }
    }
    if ($('#drawer') && $('#drawer').classList.contains('open')) renderCart();
    document.dispatchEvent(new CustomEvent('cart:change'));
  }

  function addToCart(id, color, size, qty) {
    if (qty <= 0) return;
    const ex = state.cart.find(i => i.id === id && i.color === color && i.size === size);
    if (ex) ex.qty += qty; else state.cart.push({ id, color, size, qty });
    afterCartChange(true);
  }
  function setLine(id, color, size, qty) {
    const idx = state.cart.findIndex(i => i.id === id && i.color === color && i.size === size);
    if (qty <= 0) { if (idx > -1) state.cart.splice(idx, 1); }
    else if (idx > -1) state.cart[idx].qty = qty;
    else state.cart.push({ id, color, size, qty });
    afterCartChange();
  }
  function qtyInCart(id, color, size) {
    const it = state.cart.find(i => i.id === id && i.color === color && i.size === size);
    return it ? it.qty : 0;
  }

  function toast(html) {
    const t = $('#toast');
    t.innerHTML = html; t.hidden = false;
    t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { t.hidden = true; }, 3200);
  }

  /* ---------- Tarjeta de producto ---------- */
  function priceBlock(p) {
    return `<span class="price">${cop(p.price)} <small class="muted">detal</small></span>
      <span class="price b2b">${cop(wholesale(p, T[0].off))} <small>por mayor · desde ${T[0].min} pzs</small></span>`;
  }
  function card(p) {
    const tag = p.tags.includes('nuevo') ? '<span class="tag">Nuevo</span>' : p.tags.includes('bestseller') ? '<span class="tag dark">Más vendido</span>' : '';
    return `<article class="card" data-id="${p.id}">
      <a href="producto.html?id=${p.id}" class="card-img">
        ${tag}
        <div class="g-main">${garmentSVG(p.garment, p.colors[0], p.name)}</div>
      </a>
      <div class="card-body">
        <ul class="swatches" aria-label="Colores">${p.colors.map((c, i) => `<li><button class="sw ${i === 0 ? 'on' : ''}" data-c="${c}" style="background:${swBg(c)}" aria-label="${C[c].name}" title="${C[c].name}"></button></li>`).join('')}</ul>
        <a href="producto.html?id=${p.id}" class="card-name">${p.name}</a>
        <div class="card-price">${priceBlock(p)}</div>
        <p class="card-meta muted small">Tallas ${p.sizes[0]}–${p.sizes[p.sizes.length - 1]} · ${p.team ? 'Local y visitante' : p.colors.length + ' colores'}</p>
      </div>
    </article>`;
  }
  function bindCards(root) {
    $$('.card', root).forEach(el => {
      const p = byId(el.dataset.id);
      $$('.sw', el).forEach(b => {
        const show = () => {
          $$('.sw', el).forEach(x => x.classList.toggle('on', x === b));
          $('.g-main', el).innerHTML = garmentSVG(p.garment, b.dataset.c, p.name);
        };
        b.addEventListener('mouseenter', show);
        b.addEventListener('click', show);
      });
    });
  }

  // Mismo criterio que el catálogo para contar referencias de un enlace.
  function matchesQuery(p, q) {
    const g = q.get('genero'), l = q.get('linea'), c = q.get('cat'), t = q.get('prenda');
    return (!g || p.gender === g || p.gender === 'unisex') && (!l || p.line === l) &&
      (!c || p.cat === c) && (!t || p.garment === t);
  }

  /* ---------- Página: inicio ---------- */
  function initHome() {
    const hero = $('#hero-garments');
    if (hero) {
      const seq = [['legging', 'princesa'], ['jersey', 'junior-l'], ['skirt', 'lavanda'], ['hoodie', 'gris'], ['bra', 'malva'], ['jersey', 'america-l'], ['oversize', 'arcilla']];
      let k = 0;
      const draw = () => {
        const [g, c] = seq[k % seq.length];
        hero.innerHTML = garmentSVG(g, c, 'Prenda destacada') ;
        const lab = $('#hero-color');
        if (lab) lab.innerHTML = `<i style="background:${swBg(c)}"></i>${C[c].name} <span class="muted">· ${C[c].pantone}</span>`;
        k++;
      };
      draw();
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(() => {
        hero.classList.add('swap');
        setTimeout(() => { draw(); hero.classList.remove('swap'); }, 350);
      }, 2600);
    }
    const cats = $('#cats');
    if (cats) cats.innerHTML = window.CATEGORIES.filter(c => c.tile).map(c => {
      const n = P.filter(p => matchesQuery(p, new URLSearchParams(c.href.split('?')[1]))).length;
      return `<a class="cat" href="${c.href}"><div class="cat-img">${garmentSVG(c.garment, c.color, c.name)}</div><span>${c.name}</span><small class="muted">${n} referencias</small></a>`;
    }).join('');
    const float = $('#hero-float');
    if (float) {
      const pieces = [['jersey', 'junior-v', 'Camiseta de fútbol'], ['legging', 'negro', 'Legging'], ['hoodie', 'plata', 'Suéter con capota'], ['skirt', 'rosa', 'Falda deportiva'], ['tee', 'negro', 'Camiseta dry-fit']];
      float.innerHTML = pieces.map(([g, c, l], i) => `<div class="fl fl-${i + 1}">${garmentSVG(g, c, l)}</div>`).join('');
    }
    $$('.collection-art[data-g]').forEach(el => { el.innerHTML = garmentSVG(el.dataset.g, el.dataset.c, el.closest('.collection').querySelector('h2').textContent); });
    const newIn = $('#new-in');
    if (newIn) { newIn.innerHTML = P.filter(p => p.tags.includes('nuevo')).slice(0, 8).map(card).join(''); bindCards(newIn); }
    const best = $('#best');
    const renderBest = () => { if (best) { best.innerHTML = P.filter(p => p.tags.includes('bestseller')).slice(0, 8).map(card).join(''); bindCards(best); } };
    renderBest();
    initTierStrip();
    initSeasonColors();
  }

  // Niveles de precio en columnas, con una prenda real como ejemplo.
  function initTierStrip() {
    const el = $('#tiers-strip');
    if (!el) return;
    const ex = byId('legging-flex') || P[0];
    const extra = ['Tu primer pedido por mayor', 'Envío gratis a toda Colombia', 'Asesor asignado y factura'];
    el.innerHTML = `
      <div class="ts detal">
        <p class="ts-name">Detal</p>
        <p class="ts-qty"><b>1–${T[0].min - 1}</b> piezas</p>
        <p class="ts-off">Precio normal</p>
        <p class="ts-ex">${ex.name}<br><b>${cop(ex.price)}</b></p>
      </div>` + T.map((t, i) => `
      <div class="ts">
        <p class="ts-name">${t.name}</p>
        <p class="ts-qty"><b>${t.min}+</b> piezas</p>
        <p class="ts-off">−${t.off * 100}%</p>
        <p class="ts-ex">${ex.name}<br><s>${cop(ex.price)}</s> <b>${cop(wholesale(ex, t.off))}</b></p>
        <p class="ts-extra">${extra[i]}</p>
      </div>`).join('');
  }

  function initSeasonColors() {
    const el = $('#season');
    if (!el) return;
    const months = [
      ['Octubre', 'Pedido de temporada', ['oliva', 'arcilla', 'malva', 'azulnoche'], 'Compra de boutiques para noviembre y diciembre.'],
      ['Noviembre', 'Black Friday · 27 nov', ['negro', 'princesa', 'fucsia', 'gris'], 'Básicos de alta rotación y un color de impacto.'],
      ['Diciembre', 'Estreno y vacaciones', ['chili', 'blanco', 'anis', 'lavanda'], 'Rojo para Navidad, blanco y amarillo para Año Nuevo.']
    ];
    el.innerHTML = months.map(([m, s, cs, d]) => `<a class="season" href="catalogo.html?color=${cs[0]}">
      <div class="season-sw">${cs.map(c => `<i style="background:${swBg(c)}" title="${C[c].name}"></i>`).join('')}</div>
      <h3>${m}</h3><p class="eyebrow">${s}</p><p class="muted small">${d}</p>
      <p class="small">${cs.map(c => C[c].name).join(' · ')}</p></a>`).join('');
  }

  /* ---------- Página: catálogo ---------- */
  function initCatalog() {
    const grid = $('#grid');
    if (!grid) return;
    const q = new URLSearchParams(location.search);
    const f = {
      genero: q.get('genero') ? [q.get('genero')] : [],
      linea: q.get('linea') ? [q.get('linea')] : [], prenda: q.get('prenda') || '', equipo: q.get('equipo') ? [q.get('equipo')] : [],
      tallas: [], colores: q.get('color') ? [q.get('color')] : [],
      cat: q.get('cat') || '', tag: q.get('tag') || '', q: (q.get('q') || '').toLowerCase(),
      stock: false, sort: 'rel', view: q.get('vista') === 'lista' ? 'lista' : 'grid'
    };
    if (f.q) $('#q').value = q.get('q');

    // Dama en numeración colombiana, caballero en letras, pantalón de hombre por cintura.
    const sizeGroups = [
      { label: 'Mujer', sizes: ['6', '8', '10', '12'] },
      { label: 'Hombre', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
      { label: 'Pantalón hombre', sizes: ['28', '30', '32', '34', '36'] }
    ];
    const usedColors = Object.keys(C).filter(k => C[k].role !== 'equipo' && P.some(p => p.colors.includes(k)));
    $('#filters-body').innerHTML = `
      <fieldset><legend>Género</legend>${['mujer', 'hombre', 'unisex'].map(g => `<label class="chk"><input type="checkbox" name="genero" value="${g}" ${f.genero.includes(g) ? 'checked' : ''}/> ${g[0].toUpperCase() + g.slice(1)}</label>`).join('')}</fieldset>
      <fieldset><legend>Línea</legend>${['deportiva', 'casual'].map(g => `<label class="chk"><input type="checkbox" name="linea" value="${g}" ${f.linea.includes(g) ? 'checked' : ''}/> ${LINE_LABEL[g]}</label>`).join('')}</fieldset>
      <fieldset id="team-filter"><legend>Equipo de fútbol</legend>${Object.entries(window.TEAMS).map(([k, t]) => `<label class="chk"><input type="checkbox" name="equipo" value="${k}" ${f.equipo.includes(k) ? 'checked' : ''}/> <i class="sw" style="background:${swBg(k + '-l')}"></i>${t}</label>`).join('')}</fieldset>
      <fieldset id="size-filter"><legend>Talla</legend><div id="size-filter-body"></div></fieldset>
      <fieldset><legend>Color</legend><div class="color-grid">${usedColors.map(c => `<label class="color-chip" title="${C[c].name}"><input type="checkbox" name="colores" value="${c}" ${f.colores.includes(c) ? 'checked' : ''}/><i style="background:${swBg(c)}"></i><span>${C[c].name}</span></label>`).join('')}</div></fieldset>
      <fieldset><legend>Disponibilidad</legend><label class="chk"><input type="checkbox" name="stock"/> Todas las tallas disponibles</label></fieldset>`;

    let sizeKey = '';
    function renderSizeFilter() {
      // Tallas de las prendas que se están viendo. En Mujer u Hombre no se suman las unisex (S–XL).
      const scope = P.filter(p => (!f.genero.length || f.genero.includes(p.gender)) &&
        (!f.linea.length || f.linea.includes(p.line)) && (!f.prenda || p.garment === f.prenda) &&
        (!f.equipo.length || f.equipo.includes(p.team)) && (!f.cat || p.cat === f.cat) && (!f.tag || p.tags.includes(f.tag)));
      const groups = sizeGroups
        .map(g => ({ label: g.label, sizes: g.sizes.filter(sz => scope.some(p => p.sizes.includes(sz))) }))
        .filter(g => g.sizes.length);
      $('#team-filter').hidden = !scope.some(p => p.team);
      const key = groups.map(g => g.label + g.sizes.join()).join('|');
      if (key === sizeKey) return;
      sizeKey = key;
      const all = groups.flatMap(g => g.sizes);
      f.tallas = f.tallas.filter(sz => all.includes(sz));
      const chip = sz => `<label class="size-chip"><input type="checkbox" name="tallas" value="${sz}" ${f.tallas.includes(sz) ? 'checked' : ''}/><span>${sz}</span></label>`;
      // Con un solo grupo (por ejemplo Mujer) no hace falta rótulo.
      $('#size-filter-body').innerHTML = groups.map(g =>
        `${groups.length > 1 ? `<p class="size-group">${g.label}</p>` : ''}<div class="size-grid">${g.sizes.map(chip).join('')}</div>`).join('');
    }

    $('#filters-body').addEventListener('change', e => {
      const n = e.target.name;
      if (n === 'stock') f.stock = e.target.checked;
      else f[n] = $$(`input[name="${n}"]:checked`).map(i => i.value);
      render();
    });
    $('#sort').addEventListener('change', e => { f.sort = e.target.value; render(); });
    $$('.view-toggle button').forEach(b => b.addEventListener('click', () => { f.view = b.dataset.view; render(); }));
    $('#open-filters').addEventListener('click', () => document.body.classList.add('filters-open'));
    $$('[data-close-filters]').forEach(b => b.addEventListener('click', () => document.body.classList.remove('filters-open')));
    $('#clear-filters').addEventListener('click', () => {
      Object.assign(f, { genero: [], linea: [], prenda: '', equipo: [], tallas: [], colores: [], cat: '', tag: '', q: '', stock: false });
      $$('#filters-body input').forEach(i => { i.checked = false; });
      $('#q').value = '';
      render();
    });

    function list() {
      let r = P.filter(p =>
        (!f.genero.length || f.genero.includes(p.gender) || (p.gender === 'unisex' && f.genero.some(g => g !== 'unisex'))) &&
        (!f.linea.length || f.linea.includes(p.line)) &&
        (!f.prenda || p.garment === f.prenda) &&
        (!f.equipo.length || f.equipo.includes(p.team)) &&
        (!f.tallas.length || p.sizes.some(s => f.tallas.includes(s))) &&
        (!f.colores.length || p.colors.some(c => f.colores.includes(c))) &&
        (!f.cat || p.cat === f.cat || (f.cat === 'unisex' && p.gender === 'unisex')) &&
        (!f.tag || p.tags.includes(f.tag)) &&
        (!f.q || (p.name + ' ' + p.sku + ' ' + p.colors.map(c => C[c].name).join(' ')).toLowerCase().includes(f.q)) &&
        (!f.stock || p.colors.every(c => p.sizes.every(s => window.stockFor(p.id, c, s) > 0))));
      if (f.sort === 'asc') r.sort((a, b) => a.price - b.price);
      if (f.sort === 'desc') r.sort((a, b) => b.price - a.price);
      if (f.sort === 'nuevo') r.sort((a, b) => b.tags.includes('nuevo') - a.tags.includes('nuevo'));
      return r;
    }

    function chips() {
      const c = [];
      f.genero.forEach(v => c.push(['genero', v, v]));
      f.linea.forEach(v => c.push(['linea', v, LINE_LABEL[v]]));
      f.equipo.forEach(v => c.push(['equipo', v, window.TEAMS[v]]));
      f.tallas.forEach(v => c.push(['tallas', v, 'Talla ' + v]));
      f.colores.forEach(v => c.push(['colores', v, C[v].name]));
      if (f.prenda) c.push(['prenda', f.prenda, GARMENT_LABEL[f.prenda] || f.prenda]);
      if (f.cat) c.push(['cat', f.cat, (window.CATEGORIES.find(x => x.id === f.cat) || {}).name || f.cat]);
      if (f.tag) c.push(['tag', f.tag, f.tag === 'nuevo' ? 'Novedades' : 'Más vendidos']);
      if (f.q) c.push(['q', f.q, '“' + f.q + '”']);
      $('#chips').innerHTML = c.map(([k, v, t]) => `<button class="chip" data-k="${k}" data-v="${v}">${t} <span aria-hidden="true">×</span></button>`).join('');
      $$('#chips .chip').forEach(b => b.addEventListener('click', () => {
        const k = b.dataset.k, v = b.dataset.v;
        if (Array.isArray(f[k])) { f[k] = f[k].filter(x => x !== v); const i = $(`#filters-body input[name="${k}"][value="${v}"]`); if (i) i.checked = false; }
        else f[k] = '';
        if (k === 'q') $('#q').value = '';
        render();
      }));
    }

    function render() {
      const r = list();
      const g1 = f.genero.length === 1 ? (f.genero[0] === 'mujer' ? 'Mujer' : f.genero[0] === 'hombre' ? 'Hombre' : 'Unisex') : '';
      const title = f.equipo.length === 1 ? 'Camisetas ' + window.TEAMS[f.equipo[0]] : f.prenda ? GARMENT_LABEL[f.prenda] + (g1 ? ' · ' + g1 : '') : f.cat ? (window.CATEGORIES.find(x => x.id === f.cat) || {}).name : f.tag === 'nuevo' ? 'Novedades' : f.tag === 'bestseller' ? 'Más vendidos' : f.genero.length === 1 ? (f.genero[0] === 'mujer' ? 'Mujer' : f.genero[0] === 'hombre' ? 'Hombre' : 'Unisex') : 'Catálogo';
      $('#cat-title').textContent = title;
      renderSizeFilter();
      $$('.view-toggle button').forEach(b => b.setAttribute('aria-pressed', b.dataset.view === f.view));
      chips();
      const view = f.view;
      grid.className = view === 'lista' ? 'quick' : 'grid';
      if (!r.length) { grid.innerHTML = `<div class="empty"><p>Ninguna prenda coincide con estos filtros.</p><button class="btn ghost" onclick="document.getElementById('clear-filters').click()">Quitar filtros</button></div>`; return; }
      if (view === 'grid') { grid.innerHTML = r.map(card).join(''); bindCards(grid); }
      else renderQuick(r);
    }

    // Pedido rápido: una fila por referencia y color, una columna por talla.
    function renderQuick(r) {
      grid.innerHTML = `<div class="quick-head">${tierMeter()}</div>` + r.map(p => `
        <section class="quick-item">
          <header><a href="producto.html?id=${p.id}"><b>${p.name}</b></a><code class="muted">${p.sku}</code><span class="price b2b">${cop(unitPrice(p))} c/u</span></header>
          <div class="matrix-wrap"><table class="matrix"><thead><tr><th scope="col">Color</th>${p.sizes.map(s => `<th scope="col">${s}</th>`).join('')}</tr></thead><tbody>
          ${p.colors.map(c => `<tr><th scope="row"><i class="sw" style="background:${swBg(c)}"></i>${C[c].name}</th>${p.sizes.map(s => {
            const st = window.stockFor(p.id, c, s);
            return `<td>${st ? `<input type="number" min="0" max="${st}" inputmode="numeric" value="${qtyInCart(p.id, c, s) || ''}" placeholder="0" data-p="${p.id}" data-c="${c}" data-s="${s}" aria-label="${p.name} ${C[c].name} talla ${s}" />${st < 10 ? `<small class="low">Quedan ${st}</small>` : ''}` : '<small class="out">Agotado</small>'}</td>`;
          }).join('')}</tr>`).join('')}
          </tbody></table></div>
        </section>`).join('');
      $$('.matrix input', grid).forEach(i => i.addEventListener('change', () => {
        const v = Math.max(0, Math.min(+i.max, parseInt(i.value || '0', 10) || 0));
        i.value = v || '';
        setLine(i.dataset.p, i.dataset.c, i.dataset.s, v);
        $('.quick-head', grid).innerHTML = tierMeter();
        $$('.quick-item .price', grid).forEach((el, k) => { el.textContent = cop(unitPrice(r[k])) + ' c/u'; });
      }));
    }

    render();
  }

  /* ---------- Página: producto ---------- */
  function initProduct() {
    const root = $('#pdp');
    if (!root) return;
    const p = byId(new URLSearchParams(location.search).get('id')) || P[0];
    document.title = p.name + ' · MARCA';
    let color = p.colors[0], size = null, qty = 1;

    root.innerHTML = `
      <nav class="crumbs small muted" aria-label="Ruta"><a href="index.html">Inicio</a> / <a href="catalogo.html?cat=${p.cat}">${(window.CATEGORIES.find(c => c.id === p.cat) || {}).name}</a> / <span>${p.name}</span></nav>
      <div class="pdp">
        <div class="gallery">
          <div class="g-stage" id="g-stage"></div>
          <div class="g-thumbs" id="g-thumbs">${p.colors.map(c => `<button data-c="${c}" aria-label="Ver en ${C[c].name}">${garmentSVG(p.garment, c, C[c].name)}</button>`).join('')}</div>
          <p class="small muted">Prototipo: aquí van 5–7 fotos reales por color (frente, espalda, detalle de tela, modelo en movimiento) y un video corto.</p>
        </div>
        <div class="buy">
          <p class="eyebrow">Línea ${LINE_LABEL[p.line].toLowerCase()} · ${p.gender === 'mujer' ? 'dama' : p.gender === 'hombre' ? 'caballero' : 'unisex'}${p.team ? ' · ' + window.TEAMS[p.team] : ''}</p>
          <h1>${p.name}</h1>
          <code class="muted">SKU ${p.sku}</code>
          <div id="price-area"></div>
          <div class="field"><span class="label">Color: <b id="color-name">${C[color].name}</b></span>
            <div class="swatches lg">${p.colors.map(c => `<button class="sw ${c === color ? 'on' : ''}" data-c="${c}" style="background:${swBg(c)}" aria-label="${C[c].name}" title="${C[c].name}"></button>`).join('')}</div>
          </div>
          <div id="buy-area"></div>
          <ul class="assure small">
            <li><b>Envío a toda Colombia</b> · despacho en ${B.dispatch}. Transportadora con número de guía.</li>
            <li><b>Pago seguro</b> · PSE, Nequi, Bancolombia y tarjeta procesados por la pasarela de pagos.</li>
            <li><b>Cambios</b> · [DATO REQUERIDO] política de cambios por talla y por defecto de fábrica.</li>
          </ul>
          <details open><summary>Composición y ajuste</summary><p>${p.comp}</p><p>${p.fit}</p></details>
          <details><summary>Guía de tallas</summary>${sizeGuide(p)}</details>
          <details><summary>Cuidado</summary><p>Lavar a máquina en frío, del revés. No usar blanqueador. Secar a la sombra. [VALIDAR con ficha técnica]</p></details>
          <details><summary>Envío y cambios</summary><p>Bogotá, Medellín, Cali y Barranquilla: 1–3 días hábiles. Resto del país: 2–5 días hábiles. [SUPUESTO]</p></details>
        </div>
      </div>
      <section class="wrap-inner"><h2 class="h2">Combínalo con</h2><div class="grid" id="related"></div></section>`;

    const stage = () => { $('#g-stage').innerHTML = garmentSVG(p.garment, color, p.name + ' ' + C[color].name); };
    const pickColor = c => {
      color = c; stage();
      $('#color-name').textContent = C[c].name;
      $$('.buy .swatches .sw').forEach(b => b.classList.toggle('on', b.dataset.c === c));
      if (state.tab === 'detal') renderBuy();
    };
    $$('.buy .swatches .sw').forEach(b => b.addEventListener('click', () => pickColor(b.dataset.c)));
    $$('#g-thumbs button').forEach(b => b.addEventListener('click', () => pickColor(b.dataset.c)));
    stage();

    // Los dos precios juntos; cada tarjeta es también la pestaña de compra.
    function renderPrice() {
      const pa = $('#price-area'), cur = currentTier(), d = state.tab === 'detal';
      pa.innerHTML = `
        <div class="buy-modes" role="tablist" aria-label="Tipo de compra">
          <button role="tab" class="bm ${d ? 'on' : ''}" data-tab="detal" aria-selected="${d}">
            <span class="bm-l">Al detal</span><span class="bm-p">${cop(p.price)}</span><span class="bm-s">1 a ${T[0].min - 1} piezas</span>
          </button>
          <button role="tab" class="bm b2b ${d ? '' : 'on'}" data-tab="mayor" aria-selected="${!d}">
            <span class="bm-l">Por mayor</span><span class="bm-p">${cop(wholesale(p, T[0].off))}</span><span class="bm-s">desde ${T[0].min} piezas · hasta ${cop(wholesale(p, T[T.length - 1].off))}</span>
          </button>
        </div>
        ${d ? '' : `<table class="tiers">
          <caption class="sr">Precio por cantidad</caption>
          <thead><tr><th scope="col">Precio</th><th scope="col">Piezas en tu pedido</th><th scope="col">Precio c/u</th></tr></thead>
          <tbody>
            <tr class="${cur ? '' : 'on'}"><td>Detal</td><td>1 – ${T[0].min - 1}</td><td>${cop(p.price)}</td></tr>
            ${T.map((t, i) => `<tr class="${cur && cur.id === t.id ? 'on' : ''}"><td>${t.name}</td><td>${t.min}${T[i + 1] ? ' – ' + (T[i + 1].min - 1) : ' o más'}</td><td><b>${cop(wholesale(p, t.off))}</b></td></tr>`).join('')}
          </tbody>
        </table>
        <p class="small muted">Las ${T[0].min} piezas se cuentan en todo el pedido: puedes mezclar esta prenda con otras referencias, tallas y colores.</p>`}`;
      $$('.bm', pa).forEach(b => b.addEventListener('click', () => { state.tab = b.dataset.tab; save(); renderPrice(); renderBuy(); }));
    }

    function renderBuy() {
      const ba = $('#buy-area');
      if (state.tab === 'detal') {
        ba.innerHTML = `
          <div class="field"><span class="label">Talla</span>
            <div class="sizes">${p.sizes.map(s => { const st = window.stockFor(p.id, color, s); return `<button class="size ${size === s ? 'on' : ''}" data-s="${s}" ${st ? '' : 'disabled'}>${s}${st && st < 10 ? '<small>Últimas</small>' : ''}</button>`; }).join('')}</div>
          </div>
          <div class="row">
            <span class="qty"><button id="q-dec" aria-label="Restar">−</button><output id="q-val">${qty}</output><button id="q-inc" aria-label="Sumar">+</button></span>
            <button class="btn grow" id="add">${size ? 'Agregar al pedido' : 'Elige una talla'}</button>
          </div>
          ${state.cart.length ? tierMeter() : `<p class="small muted">¿Tienes tienda? Desde ${T[0].min} piezas en tu pedido, todo pasa a precio por mayor (${cop(wholesale(p, T[0].off))} esta prenda). <button class="link" id="to-b2b">Comprar por mayor</button></p>`}`;
        const tb = $('#to-b2b');
        if (tb) tb.addEventListener('click', () => { state.tab = 'mayor'; save(); renderPrice(); renderBuy(); });
        $$('.size', ba).forEach(b => b.addEventListener('click', () => { size = b.dataset.s; renderBuy(); }));
        $('#q-dec').addEventListener('click', () => { qty = Math.max(1, qty - 1); $('#q-val').textContent = qty; });
        $('#q-inc').addEventListener('click', () => { qty++; $('#q-val').textContent = qty; });
        $('#add').addEventListener('click', () => {
          if (!size) { $('.sizes').classList.add('shake'); setTimeout(() => $('.sizes').classList.remove('shake'), 400); return; }
          addToCart(p.id, color, size, qty);
          toast(`Agregado: ${p.name} · ${C[color].name} · ${size} <button class="link" id="t-open">Ver pedido</button>`);
          $('#t-open').addEventListener('click', openCart);
          renderPrice(); renderBuy();
        });
      } else {
        ba.innerHTML = `
          <div class="field"><span class="label">Cantidades por color y talla</span>
            <div class="matrix-wrap"><table class="matrix"><thead><tr><th scope="col">Color</th>${p.sizes.map(s => `<th scope="col">${s}</th>`).join('')}<th scope="col">Total</th></tr></thead><tbody>
            ${p.colors.map(c => `<tr data-row="${c}"><th scope="row"><i class="sw" style="background:${swBg(c)}"></i>${C[c].name}</th>${p.sizes.map(s => {
              const st = window.stockFor(p.id, c, s);
              return `<td>${st ? `<input type="number" min="0" max="${st}" inputmode="numeric" placeholder="0" value="${qtyInCart(p.id, c, s) || ''}" data-c="${c}" data-s="${s}" aria-label="${C[c].name} talla ${s}" />${st < 10 ? `<small class="low">Quedan ${st}</small>` : ''}` : '<small class="out">Agotado</small>'}</td>`;
            }).join('')}<td class="rt" data-rt="${c}">0</td></tr>`).join('')}
            </tbody></table></div>
            <div class="curve"><span class="small muted">Atajo:</span>
              <button class="btn ghost sm" id="curve">Sumar curva completa en ${C[color].name} (1 por talla)</button>
            </div>
          </div>
          <div id="pdp-summary"></div>`;
        const upd = () => {
          p.colors.forEach(c => { $(`[data-rt="${c}"]`).textContent = p.sizes.reduce((a, s) => a + qtyInCart(p.id, c, s), 0); });
          const units = p.colors.reduce((a, c) => a + p.sizes.reduce((b, s) => b + qtyInCart(p.id, c, s), 0), 0);
          $('#pdp-summary').innerHTML = `
            <div class="pdp-sum"><span>${pz(units)} de esta referencia × ${cop(unitPrice(p))}</span><b>${cop(units * unitPrice(p))}</b></div>
            ${tierMeter()}
            <div class="row"><button class="btn btn-b2b grow" id="view-order">Ver pedido (${pz(cartUnits())})</button></div>
            <p class="small muted">¿Pides más de 100 unidades o quieres un surtido armado? <a target="_blank" rel="noopener" href="${waLink('Hola, quiero cotizar la referencia ' + p.sku + ' (' + p.name + ') por volumen.')}">Cotiza con un asesor</a>.</p>`;
          $('#view-order').addEventListener('click', openCart);
          renderPrice();
        };
        $$('.matrix input', ba).forEach(i => i.addEventListener('change', () => {
          const v = Math.max(0, Math.min(+i.max, parseInt(i.value || '0', 10) || 0));
          i.value = v || '';
          setLine(p.id, i.dataset.c, i.dataset.s, v);
          upd();
        }));
        $('#curve').addEventListener('click', () => {
          p.sizes.forEach(s => { if (window.stockFor(p.id, color, s)) addToCart(p.id, color, s, 1); });
          renderBuy();
          toast(`Curva agregada en ${C[color].name}`);
        });
        upd();
      }
    }

    function renderRelated() {
      const rel = P.filter(x => x.id !== p.id && (x.gender === p.gender || x.gender === 'unisex') && x.garment !== p.garment).slice(0, 4);
      $('#related').innerHTML = rel.map(card).join('');
      bindCards($('#related'));
    }
    renderPrice(); renderBuy(); renderRelated();
  }

  // Medidas orientativas del cuerpo en cm: [busto/pecho, cintura, cadera]. [VALIDAR con patronaje real]
  const SIZE_TABLE = {
    '6': ['84–88', '64–68', '90–94'], '8': ['88–92', '68–72', '94–98'], '10': ['92–96', '72–76', '98–102'], '12': ['96–100', '76–80', '102–106'],
    S: ['92–96', '76–80'], M: ['96–102', '80–86'], L: ['102–108', '86–92'], XL: ['108–114', '92–98'], XXL: ['114–120', '98–104']
  };
  function sizeGuide(p) {
    const note = '<p class="small muted">Medidas del cuerpo en centímetros. [VALIDAR con medidas reales de patronaje]</p>';
    if (p.sizes[0] === '28') return `<table class="tiers"><thead><tr><th>Talla</th><th>Cintura (cm)</th></tr></thead><tbody>${p.sizes.map((s, i) => `<tr><td>${s}</td><td>${72 + i * 5}–${76 + i * 5}</td></tr>`).join('')}</tbody></table>${note}`;
    const dama = p.sizes[0] === '6';
    const intro = dama ? 'Tallaje de dama en numeración colombiana.' : p.gender === 'unisex' ? 'Tallaje unisex en letras. La dama suele pedir una talla menos.' : 'Tallaje de caballero en letras.';
    return `<p class="small">${intro}</p>
      <table class="tiers"><thead><tr><th>Talla</th><th>${dama ? 'Busto' : 'Pecho'}</th><th>Cintura</th>${dama ? '<th>Cadera</th>' : ''}</tr></thead><tbody>
      ${p.sizes.map(s => { const r = SIZE_TABLE[s] || ['—', '—', '—']; return `<tr><td>${s}</td><td>${r[0]}</td><td>${r[1]}</td>${dama ? `<td>${r[2]}</td>` : ''}</tr>`; }).join('')}
      </tbody></table>${note}`;
  }

  /* ---------- Página: mayoristas ---------- */
  function initWholesale() {
    const form = $('#lead-form');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const d = new FormData(form);
      const txt = `Hola, soy ${d.get('nombre')} de ${d.get('negocio')} (${d.get('ciudad')}). Tipo de negocio: ${d.get('tipo')}. Me interesa: ${d.getAll('interes').join(', ') || 'catálogo completo'}.`;
      $('#lead-ok').hidden = false;
      $('#lead-wa').href = waLink(txt);
    });
  }

  /* ---------- Página: checkout ---------- */
  function initCheckout() {
    const root = $('#checkout');
    if (!root) return;
    const sum = () => {
      const t = cartTotals(), tier = currentTier();
      const w = isWholesale();
      const ship = w ? (cartUnits() >= B.wholesaleFreeShippingUnits ? 0 : 25000) : (t.total >= B.retailFreeShipping ? 0 : 14900);
      $('#co-summary').innerHTML = state.cart.length ? `
        <ul class="co-lines">${state.cart.map(i => { const p = byId(i.id); return `<li><i class="sw" style="background:${swBg(i.color)}"></i><span>${p.name}<br><small class="muted">${C[i.color].name} · ${i.size} · ${i.qty} u.</small></span><b>${cop(unitPrice(p) * i.qty)}</b></li>`; }).join('')}</ul>
        <dl class="totals">
          <div><dt>Piezas</dt><dd>${cartUnits()}</dd></div>
          <div><dt>Precio</dt><dd>${tier ? tier.name : 'Detal'}</dd></div>
          ${w ? `<div class="save"><dt>Ahorro vs. detal</dt><dd>−${cop(t.saving)}</dd></div>` : ''}
          <div><dt>Subtotal</dt><dd>${cop(t.total)}</dd></div>
          <div><dt>Envío [SUPUESTO]</dt><dd>${ship ? cop(ship) : 'Gratis'}</dd></div>
          <div class="grand"><dt>Total</dt><dd>${cop(t.total + ship)}</dd></div>
        </dl>` : '<p>Tu pedido está vacío. <a href="catalogo.html">Ir al catálogo</a></p>';
      $$('[data-only="detal"]').forEach(el => { el.hidden = w; });
      $$('[data-only="mayor"]').forEach(el => { el.hidden = !w; });
    };
    sum();
    document.addEventListener('cart:change', sum);
    $('#co-form').addEventListener('submit', e => {
      e.preventDefault();
      $('#co-done').hidden = false;
      $('#co-done').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- Arranque ---------- */
  header(); footer(); drawer(); waFloat();
  afterCartChange();
  initHome(); initCatalog(); initProduct(); initWholesale(); initCheckout();

  window.APP = { garmentSVG, cop, openCart };
})();
