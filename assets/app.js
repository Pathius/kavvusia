/* Kavvusia – logika prototypu */
(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const page=document.body.dataset.page||'';
const params=new URLSearchParams(location.search);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const zl=n=>n.toFixed(2).replace('.',',')+' zł';
const zl0=n=>Number.isInteger(n)?n+' zł':zl(n);

/* ── bezpieczne localStorage ── */
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

/* ── plamy ── */
const SHAPES=['M40 24c40-30 112-20 140 22s20 104-20 130-110 24-140-10S0 54 40 24z','M30 50C44 10 120-4 162 26s38 98 6 136-104 40-140 8S16 90 30 50z','M56 14c44-16 110 4 128 50s-2 104-44 124-108 6-130-36S12 30 56 14z','M24 70C26 24 92 0 140 16s60 80 36 124-84 60-126 36S22 116 24 70z'];
const blob=(c,style,i=0)=>`<svg class="blob" style="${style}" viewBox="0 0 200 200" aria-hidden="true"><path fill="${c}" d="${SHAPES[i%4]}"/></svg>`;
KV.stage=(img,alt,c1='#C3CC7B',c2='#A08FCB',seed=0)=>`<div class="stage">${blob(c1,'left:0;top:4%;width:70%',seed)}${blob(c2,'right:0;bottom:2%;width:62%',seed+1)}<img src="${img}" alt="${esc(alt)}" onerror="this.style.visibility='hidden'"></div>`;

/* ── produkty ── */
const P=KV.PRODUCTS, byId=id=>P.find(p=>p.id===id);
const unitPrice=(p,size)=>{if(!p.configurable)return p.price;const s=KV.SIZES.find(x=>x.id===size)||KV.SIZES[0];return Math.round(p.price*s.mult)};
const dots=(n,label='palenie')=>`<span class="dots" aria-label="${label} ${n} na 5">${label} ${[1,2,3,4,5].map(i=>`<i class="${i<=n?'on':''}"></i>`).join('')}</span>`;
const pimg=(p,cls='pimg')=>`<a class="${cls}" href="produkt.html?id=${p.id}" style="background:${p.color}">${p.badge?`<span class="tag">${esc(p.badge)}</span>`:''}<img src="${p.img}" alt="${esc(p.name)}" loading="lazy" onerror="this.parentNode.classList.add('noimg');this.remove()"><span class="fb"><small>${esc(p.type==='kawa'?p.country+' · '+p.proc:'Akcesoria')}</small><strong>${esc(p.name)}</strong></span></a>`;
KV.card=p=>`<article class="card">${pimg(p)}<div class="cbody"><span class="meta">${esc(p.type==='kawa'?p.country+' · '+p.proc:'Akcesoria')}</span><h3><a href="produkt.html?id=${p.id}">${esc(p.name)}</a></h3>${p.type==='kawa'?`<p class="notes">${p.notes.join(', ')}</p>${dots(p.roast)}`:`<p class="notes">${esc(p.desc.split('.')[0])}.</p>`}<div class="buy"><span class="price">${p.configurable?'<small>od </small>':''}${zl0(p.price)}${p.configurable?' <small>/ 250 g</small>':''}</span>${p.configurable?`<a class="btn sm" href="produkt.html?id=${p.id}">Wybierz</a>`:`<button class="btn sm" data-add="${p.id}">Do koszyka</button>`}</div></div></article>`;

/* ── koszyk ── */
const CART='kv_cart';
const cart={items(){return store.get(CART,[])},save(a){store.set(CART,a);updateBadge()},
  add(id,qty=1,size='250',grind='ziarno'){const p=byId(id);if(!p)return;if(!p.configurable){size='';grind=''}const key=[id,size,grind].join('|');const a=cart.items();const f=a.find(x=>x.key===key);f?f.qty+=qty:a.push({key,id,size,grind,qty});cart.save(a)},
  setQty(key,q){let a=cart.items();a=a.map(x=>x.key===key?{...x,qty:Math.max(1,Math.min(20,q))}:x);cart.save(a)},
  remove(key){cart.save(cart.items().filter(x=>x.key!==key))},
  clear(){cart.save([])},
  count(){return cart.items().reduce((s,x)=>s+x.qty,0)},
  lines(){return cart.items().map(x=>{const p=byId(x.id);if(!p)return null;const unit=unitPrice(p,x.size);const v=p.configurable?[KV.SIZES.find(s=>s.id===x.size)?.label,KV.GRINDS.find(g=>g.id===x.grind)?.label].join(' · '):'';return{...x,p,unit,variant:v,sum:unit*x.qty}}).filter(Boolean)},
  subtotal(){return cart.lines().reduce((s,l)=>s+l.sum,0)}};
KV.cart=cart;
const COUPONS={KAVVUSIA10:{pct:10,label:'−10% na pierwsze zamówienie'}};
KV.coupon={get(){return store.get('kv_coupon',null)},set(c){store.set('kv_coupon',c)}};
KV.SHIP={paczkomat:{label:'Paczkomat InPost',price:12.99},kurier:{label:'Kurier DPD',price:16.99},odbior:{label:'Odbiór w palarni (Warszawa)',price:0}};
const FREE=99;
KV.totals=(ship='paczkomat')=>{const sub=cart.subtotal();const c=KV.coupon.get();const disc=c&&COUPONS[c]?Math.round(sub*COUPONS[c].pct)/100:0;const after=sub-disc;const sh=sub===0?0:(ship==='odbior'||after>=FREE?0:KV.SHIP[ship].price);return{sub,disc,ship:sh,total:after+sh,coupon:c}};
function updateBadge(){const n=cart.count();$$('[data-cart-n]').forEach(e=>e.textContent=n)}

/* ── toast ── */
function toast(t,link){let el=$('#toast');el.innerHTML=`<span>${t}</span>${link?`<a href="${link[1]}">${link[0]}</a>`:''}`;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),3200)}
KV.toast=toast;
document.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(!b)return;cart.add(b.dataset.add,1);const p=byId(b.dataset.add);toast(`„${esc(p.name)}” w koszyku.`,['Zobacz koszyk','koszyk.html'])});

/* ── layout: pasek demo, nagłówek, stopka ── */
const NAV=[['sklep.html','Sklep','sklep'],['poradnik.html','Poradnik','poradnik'],['blog.html','Blog','blog'],['o-nas.html','O nas','o-nas'],['kontakt.html','Kontakt','kontakt']];
const ico={search:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/></svg>',
 user:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.4-3.6 4.3-5.5 7.5-5.5s6.1 1.9 7.5 5.5"/></svg>',
 bag:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M5 8h14l-1.3 12H6.3z"/><path d="M9 8V7a3 3 0 0 1 6 0v1"/></svg>',
 menu:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'};
KV.ico=ico;
const header=`<div class="demo" role="note"><b>Sklep demonstracyjny</b><span class="d-long"> · projekt studencki – produkty są fikcyjne, zamówień nie realizujemy, płatności nie pobieramy.</span><span class="d-short"> · nic tu naprawdę nie kupisz</span></div>
<header class="site-h"><div class="wrap"><div class="nav">
 <a class="brand" href="index.html"><img src="logo-poziome.png" alt="Kavvusia – strona główna"></a>
 <nav class="menu" aria-label="Główna">${NAV.map(([h,l,k])=>`<a href="${h}"${page===k||(k==='sklep'&&page==='produkt')||(k==='blog'&&page==='wpis')?' aria-current="page"':''}>${l}</a>`).join('')}</nav>
 <div class="tools">
  <form class="search" action="sklep.html" role="search"><label class="vh" for="hq">Szukaj kawy</label>${ico.search}<input id="hq" name="q" type="search" placeholder="Szukaj kawy…" autocomplete="off" value="${esc(page==='sklep'?params.get('q')||'':'')}"></form>
  <a class="icon-b light" href="konto.html" aria-label="Moje konto">${ico.user}</a>
  <a class="icon-b" href="koszyk.html" aria-label="Koszyk">${ico.bag}<span class="n" data-cart-n>0</span></a>
  <button class="icon-b light burger" aria-label="Menu" aria-expanded="false" id="burger">${ico.menu}</button>
 </div></div>
 <nav class="mobile-menu" id="mmenu" aria-label="Menu mobilne"><form action="sklep.html"><div class="field"><label class="vh" for="mq">Szukaj</label><input id="mq" name="q" type="search" placeholder="Szukaj kawy…"></div></form>${NAV.map(([h,l])=>`<a href="${h}">${l}</a>`).join('')}<a href="sledzenie.html">Śledź zamówienie</a></nav>
</div></header>`;
const footer=`<footer class="site-f"><div class="wrap"><div class="foot">
 <div><a class="brand" href="index.html"><img src="logo-poziome-jasne.png" alt="Kavvusia"></a><p style="margin-top:14px;max-width:30ch">Mała palarnia kawy dla domowych kawoszy. Bez snobizmu, z uśmiechem.</p></div>
 <div><h4>Sklep</h4><ul><li><a href="sklep.html?kat=kawa">Kawy</a></li><li><a href="sklep.html?kat=akcesoria">Akcesoria</a></li><li><a href="sklep.html?sort=nowosci">Nowości</a></li><li><a href="koszyk.html">Koszyk</a></li></ul></div>
 <div><h4>Wiedza</h4><ul><li><a href="poradnik.html">Poradnik dla początkujących</a></li><li><a href="blog.html">Blog</a></li><li><a href="o-nas.html">O nas</a></li></ul></div>
 <div><h4>Pomoc</h4><ul><li><a href="sledzenie.html">Śledź zamówienie</a></li><li><a href="konto.html">Moje konto</a></li><li><a href="regulamin.html">Regulamin</a></li><li><a href="kontakt.html">Kontakt</a></li></ul></div>
 <div><h4>Kontakt</h4><ul><li>kontakt@kavvusia.pl</li><li>ul. Przykładowa 1, Warszawa</li><li>pn–pt 9:00–17:00</li></ul></div>
</div><div class="legal"><span>© 2026 Kavvusia · projekt zaliczeniowy „Zarządzanie Treścią (CMS)”, PJATK</span><span><b>Sklep demonstracyjny</b> – nie prowadzimy sprzedaży, dane kontaktowe są fikcyjne.</span></div></div></footer>
<div class="toast" id="toast" role="status"></div>`;
document.body.insertAdjacentHTML('afterbegin',header);
document.body.insertAdjacentHTML('beforeend',footer);
$('#burger').onclick=e=>{const m=$('#mmenu');const o=m.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)};
updateBadge();

/* ════════ STRONY ════════ */
const init={};

/* strona główna: polecane */
init.home=()=>{const el=$('#featured');if(el)el.innerHTML=P.filter(p=>p.type==='kawa').sort((a,b)=>b.pop-a.pop).slice(0,4).map(KV.card).join('');
  const bl=$('#home-blog');if(bl)bl.innerHTML=KV.POSTS.slice(0,3).map(postCard).join('')};

/* katalog */
init.sklep=()=>{
  const F={kat:params.get('kat')||'all',method:params.get('metoda')||'all',roast:new Set(),taste:new Set(),country:new Set(),max:250,q:params.get('q')||'',sort:params.get('sort')||'polecane'};
  const countries=[...new Set(P.filter(p=>p.type==='kawa').map(p=>p.country))];
  $('#f-country').innerHTML=countries.map(c=>`<label class="check"><input type="checkbox" value="${c}"> ${c}</label>`).join('');
  $('#q').value=F.q; $('#sort').value=F.sort;
  const sync=()=>{$$('[data-f="kat"] .chip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===F.kat));$$('[data-f="method"] .chip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===F.method))};
  function render(){
    const q=F.q.trim().toLowerCase();
    let L=P.filter(p=>(F.kat==='all'||p.type===F.kat)&&(F.method==='all'||p.methods.includes(F.method))
      &&(!F.roast.size||(p.type==='kawa'&&F.roast.has(p.roast<=2?'jasne':p.roast===3?'srednie':'ciemne')))
      &&(!F.taste.size||(p.tastes||[]).some(t=>F.taste.has(t)))&&(!F.country.size||F.country.has(p.country))&&p.price<=F.max
      &&(!q||[p.name,p.country,p.proc||'',...(p.notes||[]),...(p.tastes||[]),p.desc].join(' ').toLowerCase().includes(q)));
    const S={polecane:(a,b)=>b.pop-a.pop,'cena-rosnaco':(a,b)=>a.price-b.price,'cena-malejaco':(a,b)=>b.price-a.price,nowosci:(a,b)=>b.added.localeCompare(a.added),nazwa:(a,b)=>a.name.localeCompare(b.name,'pl')};
    L.sort(S[F.sort]||S.polecane);
    $('#cnt').textContent=L.length; $('#maxv').textContent=F.max+' zł';
    $('#grid').innerHTML=L.length?L.map(KV.card).join(''):`<div class="empty" style="grid-column:1/-1"><img src="grafiki/web/szukam.png" alt="Baristka zagląda z latarką do pustej torebki"><div><h3>Hmm, pusta torebka.</h3><p>Nic nie pasuje do tych filtrów${q?` i frazy „${esc(F.q)}”`:''}. Spróbuj poluzować wybór.</p><button class="btn" id="clear2">Wyczyść filtry</button></div></div>`;
    const c2=$('#clear2'); if(c2)c2.onclick=clear;
    const u=new URLSearchParams();if(F.kat!=='all')u.set('kat',F.kat);if(F.method!=='all')u.set('metoda',F.method);if(F.q)u.set('q',F.q);if(F.sort!=='polecane')u.set('sort',F.sort);
    history.replaceState(null,'','sklep.html'+(u.toString()?'?'+u:''));
  }
  function clear(){F.kat='all';F.method='all';F.roast.clear();F.taste.clear();F.country.clear();F.max=250;F.q='';$('#q').value='';$('#hq')&&($('#hq').value='');$('#max').value=250;$$('.filters input[type=checkbox]').forEach(c=>c.checked=false);$$('[data-f="roast"] .chip,[data-f="taste"] .chip').forEach(b=>b.setAttribute('aria-pressed','false'));sync();render()}
  $$('[data-f="kat"],[data-f="method"]').forEach(g=>g.addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;F[g.dataset.f]=b.dataset.v;sync();render()}));
  $$('[data-f="roast"],[data-f="taste"]').forEach(g=>g.addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;const set=F[g.dataset.f];const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);on?set.add(b.dataset.v):set.delete(b.dataset.v);render()}));
  $('#f-country').addEventListener('change',e=>{e.target.checked?F.country.add(e.target.value):F.country.delete(e.target.value);render()});
  $('#max').oninput=e=>{F.max=+e.target.value;render()};
  $('#q').oninput=e=>{F.q=e.target.value;render()};
  $('#sort').onchange=e=>{F.sort=e.target.value;render()};
  $('#clear').onclick=clear;
  $('#ftoggle').onclick=e=>{const f=$('.filters');const o=f.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)};
  sync();render();
};

/* produkt */
init.produkt=()=>{
  const p=byId(params.get('id'))||P[1];
  document.title=p.name+' – Kavvusia';
  $('#crumb-name').textContent=p.name;
  $('#crumb-cat').innerHTML=`<a href="sklep.html?kat=${p.type}">${p.type==='kawa'?'Kawy':'Akcesoria'}</a>`;
  $('#gallery').innerHTML=pimg(p,'pimg big');
  let size='250',grind='ziarno',qty=1;
  const info=$('#pinfo');
  info.innerHTML=`<span class="meta">${esc(p.type==='kawa'?p.country+' · '+p.proc:'Akcesoria')}</span><h1 class="h2">${esc(p.name)}</h1>
   ${p.type==='kawa'?`<p class="notes big">${p.notes.join(' / ')}</p>`:''}
   <p class="pdesc">${esc(p.desc)}</p>
   <div class="price big" id="pprice"></div>
   ${p.configurable?`<div class="opts"><div><span class="f-l">Waga</span><div class="chips" role="radiogroup" aria-label="Waga" id="sizes">${KV.SIZES.map(s=>`<button class="chip" role="radio" data-v="${s.id}" aria-checked="${s.id===size}">${s.label}</button>`).join('')}</div></div>
   <div><span class="f-l">Mielenie</span><div class="chips" role="radiogroup" aria-label="Mielenie" id="grinds">${KV.GRINDS.map(g=>`<button class="chip" role="radio" data-v="${g.id}" aria-checked="${g.id===grind}">${g.label}</button>`).join('')}</div></div></div>`:''}
   <div class="addrow"><div class="qty" aria-label="Ilość"><button id="qm" aria-label="Mniej">−</button><span id="qv">1</span><button id="qp" aria-label="Więcej">+</button></div><button class="btn" id="addb">Dodaj do koszyka</button></div>
   <p class="ship-note">Palimy w piątek, wysyłamy w poniedziałek. Darmowa dostawa od ${FREE} zł.</p>`;
  const price=()=>{$('#pprice').innerHTML=zl0(unitPrice(p,size)*qty)+(p.configurable?` <small>· ${KV.SIZES.find(s=>s.id===size).label}</small>`:'')};
  const radio=(id,set)=>{const g=$('#'+id);if(!g)return;g.addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;$$('.chip',g).forEach(c=>c.setAttribute('aria-checked',c===b));set(b.dataset.v);price()})};
  radio('sizes',v=>size=v); radio('grinds',v=>grind=v);
  $('#qm').onclick=()=>{qty=Math.max(1,qty-1);$('#qv').textContent=qty;price()};
  $('#qp').onclick=()=>{qty=Math.min(20,qty+1);$('#qv').textContent=qty;price()};
  $('#addb').onclick=()=>{cart.add(p.id,qty,size,grind);toast(`Dodano: ${esc(p.name)}${p.configurable?` (${KV.SIZES.find(s=>s.id===size).label}, ${KV.GRINDS.find(g=>g.id===grind).label.toLowerCase()})`:''}.`,['Zobacz koszyk','koszyk.html'])};
  price();
  const det=$('#pdetails');
  if(p.type==='kawa'){det.innerHTML=`<div class="spec panel"><h3>Profil</h3>${[['Palenie',p.roast],['Kwasowość',p.acid],['Słodycz',p.sweet],['Body',p.body]].map(([l,v])=>`<div class="row"><span>${l}</span>${dots(v,'')}</div>`).join('')}</div>
   <div class="spec panel"><h3>Pochodzenie</h3>${[['Kraj',p.country],['Region',p.region],['Wysokość',p.alt],['Odmiana',p.variety],['Obróbka',p.proc]].map(([l,v])=>`<div class="row"><span>${l}</span><b>${esc(v)}</b></div>`).join('')}</div>
   <div class="spec panel"><h3>Do czego</h3><p>${p.methods.map(m=>KV.METHODS[m]).join(', ')}.</p><p style="margin-top:10px">Nie wiesz, jak zacząć? Zajrzyj do <a class="u" href="poradnik.html">poradnika dla początkujących</a>.</p></div>`}
  else det.innerHTML=`<div class="spec panel"><h3>Szczegóły</h3><p>${esc(p.desc)}</p></div>`;
  $('#related').innerHTML=P.filter(x=>x.id!==p.id&&x.type===p.type).sort((a,b)=>b.pop-a.pop).slice(0,4).map(KV.card).join('');
};

/* koszyk */
init.koszyk=()=>{
  const el=$('#cartbox');
  function render(){
    const L=cart.lines();
    if(!L.length){el.innerHTML=`<div class="empty"><img src="grafiki/web/koszyk-pusty.png" alt="" onerror="this.src='grafiki/web/szukam.png'"><div><h3>Koszyk świeci pustkami.</h3><p>Zajrzyj do sklepu – na pewno coś Ci zasmakuje.</p><a class="btn" href="sklep.html">Idę do sklepu</a></div></div>`;return}
    const t=KV.totals('paczkomat'); const left=Math.max(0,FREE-(t.sub-t.disc));
    el.innerHTML=`<div class="cart-grid"><div class="lines">${L.map(l=>`<div class="line">${pimg(l.p,'pimg thumb')}<div class="li"><a href="produkt.html?id=${l.p.id}"><h3>${esc(l.p.name)}</h3></a>${l.variant?`<p>${l.variant}</p>`:''}<p class="unit">${zl(l.unit)} / szt.</p></div>
      <div class="qty sm"><button data-q="-1" data-k="${l.key}" aria-label="Mniej">−</button><span>${l.qty}</span><button data-q="1" data-k="${l.key}" aria-label="Więcej">+</button></div><b class="lsum">${zl(l.sum)}</b><button class="rm" data-rm="${l.key}" aria-label="Usuń ${esc(l.p.name)}">Usuń</button></div>`).join('')}
      <a class="u" href="sklep.html" style="display:inline-block;margin-top:18px">← Kontynuuj zakupy</a></div>
     <aside class="panel peach sum"><h3>Podsumowanie</h3>
      <div class="row"><span>Produkty</span><b>${zl(t.sub)}</b></div>
      ${t.disc?`<div class="row"><span>Kupon ${t.coupon}</span><b>−${zl(t.disc)}</b></div>`:''}
      <div class="row"><span>Dostawa (od)</span><b>${t.ship?zl(t.ship):'gratis'}</b></div>
      <div class="row total"><span>Razem</span><span>${zl(t.total)}</span></div>
      <p class="freebar">${left>0?`Brakuje <b>${zl(left)}</b> do darmowej dostawy.`:'Masz darmową dostawę!'}</p>
      <form id="cform" class="coupon"><div class="field"><label for="cc">Kod rabatowy</label><div style="display:flex;gap:8px"><input id="cc" placeholder="np. KAVVUSIA10" value="${t.coupon||''}"><button class="btn sm">${t.coupon?'Zmień':'Użyj'}</button></div><span class="err" id="cerr">Nie znamy takiego kodu. Spróbuj KAVVUSIA10.</span></div>${t.coupon?'<button type="button" class="u" id="crm" style="margin-top:8px">Usuń kupon</button>':''}</form>
      <a class="btn block" href="zamowienie.html" style="margin-top:18px">Przejdź do zamówienia</a>
      <p class="note-demo" style="margin-top:14px">Sklep demonstracyjny – zamówienie nie zostanie zrealizowane.</p></aside></div>`;
    $$('[data-q]',el).forEach(b=>b.onclick=()=>{const it=cart.items().find(x=>x.key===b.dataset.k);cart.setQty(b.dataset.k,it.qty+ +b.dataset.q);render()});
    $$('[data-rm]',el).forEach(b=>b.onclick=()=>{cart.remove(b.dataset.rm);render();toast('Usunięto z koszyka.')});
    $('#cform').onsubmit=e=>{e.preventDefault();const v=$('#cc').value.trim().toUpperCase();if(COUPONS[v]){KV.coupon.set(v);render();toast('Kupon '+v+' dodany: '+COUPONS[v].label)}else{$('#cc').closest('.field').classList.add('invalid')}};
    const crm=$('#crm');if(crm)crm.onclick=()=>{KV.coupon.set(null);render()};
  }
  render();
};

/* zamówienie (checkout) */
init.zamowienie=()=>{
  if(!cart.count()){$('#checkout').innerHTML=`<div class="empty"><img src="grafiki/web/szukam.png" alt=""><div><h3>Nie ma czego zamawiać.</h3><p>Twój koszyk jest pusty.</p><a class="btn" href="sklep.html">Wróć do sklepu</a></div></div>`;return}
  let step=1; const data=store.get('kv_checkout',{ship:'paczkomat',pay:'blik'});
  const steps=['Dane i dostawa','Płatność','Podsumowanie'];
  function side(){const t=KV.totals(data.ship);$('#co-sum').innerHTML=`<h3>Twoje zamówienie</h3>${cart.lines().map(l=>`<div class="row"><span>${l.qty}× ${esc(l.p.name)}${l.variant?`<br><small>${l.variant}</small>`:''}</span><b>${zl(l.sum)}</b></div>`).join('')}
    <div class="row" style="border-top:var(--b);margin-top:8px;padding-top:12px"><span>Produkty</span><b>${zl(t.sub)}</b></div>${t.disc?`<div class="row"><span>Kupon ${t.coupon}</span><b>−${zl(t.disc)}</b></div>`:''}<div class="row"><span>Dostawa</span><b>${t.ship?zl(t.ship):'gratis'}</b></div><div class="row total"><span>Razem</span><span>${zl(t.total)}</span></div>`}
  function render(){
    $('#stepper').innerHTML=steps.map((s,i)=>`<li class="${i+1===step?'cur':i+1<step?'done':''}"><span>${i+1}</span>${s}</li>`).join('');
    const f=$('#co-form');
    if(step===1)f.innerHTML=`<h2 class="h3">Dane do wysyłki</h2><div class="fgrid">
      ${fld('imie','Imię','text','given-name')}${fld('nazwisko','Nazwisko','text','family-name')}${fld('email','E-mail','email','email','Na ten adres wyślemy potwierdzenie (w demo – nie wyślemy).')}${fld('tel','Telefon','tel','tel')}
      ${fld('ulica','Ulica i numer','text','street-address','',true)}${fld('kod','Kod pocztowy','text','postal-code')}${fld('miasto','Miasto','text','address-level2')}</div>
      <h2 class="h3" style="margin-top:34px">Dostawa</h2><div class="opts-col">${Object.entries(KV.SHIP).map(([k,s])=>`<label class="opt"><input type="radio" name="ship" value="${k}" ${data.ship===k?'checked':''}><b>${s.label}</b><span class="r">${s.price?zl(s.price):'0 zł'}</span></label>`).join('')}</div>
      <p class="small-note">Darmowa dostawa od ${FREE} zł.</p><div class="co-nav"><a class="u" href="koszyk.html">← Wróć do koszyka</a><button class="btn" id="next">Dalej: płatność</button></div>`;
    if(step===2)f.innerHTML=`<h2 class="h3">Płatność</h2><p class="note-demo" style="margin:10px 0 20px">To tryb testowy – żadne pieniądze nie zostaną pobrane, nie podawaj prawdziwych danych karty.</p>
      <div class="opts-col">${[['blik','BLIK (test)'],['karta','Karta płatnicza (test)'],['przelew','Przelew tradycyjny']].map(([k,l])=>`<label class="opt"><input type="radio" name="pay" value="${k}" ${data.pay===k?'checked':''}><b>${l}</b></label>`).join('')}</div>
      <div class="co-nav"><button class="u" id="back">← Wstecz</button><button class="btn" id="next">Dalej: podsumowanie</button></div>`;
    if(step===3){const t=KV.totals(data.ship);f.innerHTML=`<h2 class="h3">Sprawdź i zamów</h2><div class="review"><div class="panel"><h3>Dostawa</h3><p>${esc(data.imie)} ${esc(data.nazwisko)}<br>${esc(data.ulica)}<br>${esc(data.kod)} ${esc(data.miasto)}<br>${esc(data.email)} · ${esc(data.tel)}</p><p style="margin-top:8px"><b>${KV.SHIP[data.ship].label}</b></p></div><div class="panel"><h3>Płatność</h3><p>${{blik:'BLIK (test)',karta:'Karta (test)',przelew:'Przelew tradycyjny'}[data.pay]}</p><p style="margin-top:8px">Do zapłaty: <b>${zl(t.total)}</b></p></div></div>
      <label class="check" style="margin-top:22px"><input type="checkbox" id="ack"> <span>Rozumiem, że Kavvusia to <b>sklep demonstracyjny</b> – zamówienie nie zostanie zrealizowane ani opłacone.</span></label>
      <label class="check" style="margin-top:10px"><input type="checkbox" id="terms"> <span>Akceptuję <a class="u" href="regulamin.html" target="_blank">regulamin</a>.</span></label>
      <p class="err-line" id="ackerr" hidden>Zaznacz oba pola, żeby złożyć zamówienie.</p>
      <div class="co-nav"><button class="u" id="back">← Wstecz</button><button class="btn" id="place">Złóż zamówienie (demo)</button></div>`}
    side(); bind();
  }
  function fld(n,l,t,ac,hint='',full=false){return`<div class="field${full?' full':''}"><label for="${n}">${l}</label><input id="${n}" name="${n}" type="${t}" autocomplete="${ac}" value="${esc(data[n]||'')}" required>${hint?`<small>${hint}</small>`:''}<span class="err">Uzupełnij to pole${t==='email'?' poprawnym adresem e-mail':''}.</span></div>`}
  function bind(){
    $$('input[name=ship]').forEach(r=>r.onchange=()=>{data.ship=r.value;side()});
    $$('input[name=pay]').forEach(r=>r.onchange=()=>{data.pay=r.value});
    const b=$('#back');if(b)b.onclick=()=>{step--;render();scrollTo(0,0)};
    const n=$('#next');if(n)n.onclick=()=>{
      if(step===1){let ok=true;$$('#co-form .field input').forEach(i=>{const v=i.value.trim();const bad=!v||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(v))||(i.id==='kod'&&!/^\d{2}-?\d{3}$/.test(v));i.closest('.field').classList.toggle('invalid',bad);if(bad&&ok){ok=false;i.focus()}data[i.id]=v});if(!ok)return}
      store.set('kv_checkout',data);step++;render();scrollTo(0,0)};
    const pl=$('#place');if(pl)pl.onclick=()=>{if(!$('#ack').checked||!$('#terms').checked){$('#ackerr').hidden=false;return}
      const t=KV.totals(data.ship);const nr='KV-'+(10500+Math.floor(Math.random()*400));
      const orders=store.get('kv_orders',[]);orders.unshift({nr,date:new Date().toISOString().slice(0,10),status:0,total:t.total,items:cart.lines().map(l=>[l.p.name+(l.variant?' · '+l.variant:''),l.qty]),ship:KV.SHIP[data.ship].label,email:data.email});
      store.set('kv_orders',orders);cart.clear();KV.coupon.set(null);location.href='potwierdzenie.html?nr='+nr};
  }
  render();
};

const allOrders=()=>[...store.get('kv_orders',[]),...KV.DEMO_ORDERS];
const findOrder=nr=>allOrders().find(o=>o.nr.toUpperCase()===String(nr||'').trim().toUpperCase());
const timeline=o=>`<ol class="timeline">${KV.STATUSES.map((s,i)=>`<li class="${i<o.status?'done':i===o.status?'cur':''}"><span></span><b>${s}</b></li>`).join('')}</ol>`;

init.potwierdzenie=()=>{const o=findOrder(params.get('nr'));if(!o)return;$('#nr').textContent=o.nr;$('#total').textContent=zl(o.total);$('#track').href='sledzenie.html?nr='+o.nr};

init.sledzenie=()=>{
  const show=nr=>{const o=findOrder(nr);const r=$('#result');
    if(!o){r.innerHTML=`<div class="panel"><h3>Nie znaleźliśmy zamówienia „${esc(nr)}”.</h3><p>Sprawdź numer w mailu z potwierdzeniem. Dla demo spróbuj <b>KV-10482</b>.</p></div>`;return}
    r.innerHTML=`<div class="panel"><div class="sec-head" style="margin-bottom:10px"><h3 style="margin:0">Zamówienie ${o.nr}</h3><span class="pill">${KV.STATUSES[o.status]}</span></div><p>Złożone ${o.date} · ${esc(o.ship)} · ${zl(o.total)}</p>${timeline(o)}<ul class="olist">${o.items.map(([n,q])=>`<li>${q}× ${esc(n)}</li>`).join('')}</ul></div>`};
  $('#tform').onsubmit=e=>{e.preventDefault();const v=$('#tnr').value;if(!v.trim()){$('#tnr').closest('.field').classList.add('invalid');return}show(v)};
  if(params.get('nr')){$('#tnr').value=params.get('nr');show(params.get('nr'))}
};

init.konto=()=>{
  const tabs=$$('[role=tab]');const sel=id=>{tabs.forEach(t=>t.setAttribute('aria-selected',t.dataset.t===id));$$('[role=tabpanel]').forEach(p=>p.hidden=p.id!=='t-'+id);history.replaceState(null,'','#'+id)};
  tabs.forEach(t=>t.onclick=()=>sel(t.dataset.t));
  const O=allOrders();
  $('#t-zamowienia').innerHTML=`<h2 class="h3">Zamówienia</h2><div class="otable">${O.map(o=>`<div class="orow"><b>${o.nr}</b><span>${o.date}</span><span class="pill">${KV.STATUSES[o.status]}</span><span>${zl(o.total)}</span><a class="btn ghost sm" href="sledzenie.html?nr=${o.nr}">Śledź</a></div>`).join('')}</div>`;
  const last=O[0];$('#last').innerHTML=last?`<h3>Ostatnie zamówienie</h3><p><b>${last.nr}</b> · ${zl(last.total)}</p>${timeline(last)}<a class="btn sm" href="sledzenie.html?nr=${last.nr}" style="margin-top:14px">Szczegóły</a>`:'';
  $('#dform').onsubmit=e=>{e.preventDefault();toast('Zapisano (demo – dane nigdzie nie trafiają).')};
  $('#logout').onclick=()=>toast('Wylogowanie w demo nic nie robi – to tylko widok.');
  sel((location.hash||'#pulpit').slice(1));
};

/* blog */
const postCard=b=>`<a class="post" href="wpis.html?id=${b.id}"><div class="cover" style="background:${b.color}"><img src="${b.img}" alt="" loading="lazy" onerror="this.style.visibility='hidden'"></div><div class="pb"><span class="cat">${b.cat} · ${b.read} min</span><h3>${esc(b.title)}</h3><p>${esc(b.excerpt)}</p><span class="more">Czytaj →</span></div></a>`;
init.blog=()=>{let cat='all';const r=()=>{$('#posts').innerHTML=KV.POSTS.filter(b=>cat==='all'||b.cat===cat).map(postCard).join('')};
  const cats=[...new Set(KV.POSTS.map(b=>b.cat))];$('#bcats').innerHTML=['all',...cats].map(c=>`<button class="chip" data-v="${c}" aria-pressed="${c==='all'}">${c==='all'?'Wszystko':c}</button>`).join('');
  $('#bcats').onclick=e=>{const b=e.target.closest('.chip');if(!b)return;cat=b.dataset.v;$$('#bcats .chip').forEach(c=>c.setAttribute('aria-pressed',c===b));r()};r()};
init.wpis=()=>{const b=KV.POSTS.find(x=>x.id===params.get('id'))||KV.POSTS[0];document.title=b.title+' – Blog Kavvusia';
  $('#post-head').innerHTML=`<nav class="crumbs"><a href="index.html">Start</a><span>/</span><a href="blog.html">Blog</a><span>/</span>${esc(b.cat)}</nav><span class="cat-l">${b.cat} · ${b.date} · ${b.read} min czytania</span><h1 class="h2" style="margin-top:10px">${esc(b.title)}</h1><p class="lead" style="margin-top:16px">${esc(b.excerpt)}</p>`;
  $('#post-cover').innerHTML=`<div class="cover-big" style="background:${b.color}"><img src="${b.img}" alt="" onerror="this.style.visibility='hidden'"></div>`;
  $('#post-body').innerHTML=b.body.map(([t,c])=>t==='ul'||t==='ol'?`<${t}>${c.map(i=>`<li>${i}</li>`).join('')}</${t}>`:`<${t}>${c}</${t}>`).join('');
  $('#more-posts').innerHTML=KV.POSTS.filter(x=>x.id!==b.id).slice(0,3).map(postCard).join('');
  const rec=P.filter(p=>p.type==='kawa').slice(0,2);$('#post-shop').innerHTML=rec.map(KV.card).join('')};

/* kontakt */
init.kontakt=()=>{$('#kform').onsubmit=e=>{e.preventDefault();let ok=true;$$('#kform [required]').forEach(i=>{const bad=!i.value.trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value))||(i.type==='checkbox'&&!i.checked);i.closest('.field,.check').classList.toggle('invalid',bad);if(bad)ok=false});
  if(!ok){toast('Popraw zaznaczone pola.');return}$('#kform').hidden=true;$('#ksent').hidden=false}};

if(init[page])init[page]();
})();
