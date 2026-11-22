/* Dane demonstracyjne – w WordPressie to będą produkty WooCommerce i wpisy bloga */
window.KV = window.KV || {};

KV.METHODS = {przelew:'Przelew', kawiarka:'Kawiarka', espresso:'Espresso', french:'French press'};
KV.TASTES = ['Owocowe','Czekoladowe','Orzechowe','Kwiatowe'];
KV.SIZES = [{id:'250',label:'250 g',mult:1},{id:'500',label:'500 g',mult:1.9},{id:'1000',label:'1 kg',mult:3.6}];
KV.GRINDS = [{id:'ziarno',label:'Ziarna'},{id:'espresso',label:'Pod espresso'},{id:'kawiarka',label:'Pod kawiarkę'},{id:'przelew',label:'Pod przelew'},{id:'french',label:'Pod french press'}];

KV.PRODUCTS = [
 {id:'etiopia-yirgacheffe',type:'kawa',name:'Etiopia Yirgacheffe',country:'Etiopia',proc:'myta',region:'Gedeo, Yirgacheffe',alt:'1900–2100 m n.p.m.',variety:'heirloom',badge:'Sezonowa',color:'#F3C86A',roast:1,acid:5,sweet:3,body:2,notes:['jaśmin','bergamotka','cytryna'],methods:['przelew','french'],tastes:['Kwiatowe','Owocowe'],price:54,pop:8,added:'2026-10-02',
  desc:'Lekka jak herbata, pachnąca jak ogród. Jeśli myślisz, że kawa musi być gorzka – ta zmieni zdanie.'},
 {id:'kolumbia-huila',type:'kawa',name:'Kolumbia Huila',country:'Kolumbia',proc:'myta',region:'Huila, Pitalito',alt:'1600–1800 m n.p.m.',variety:'caturra, castillo',badge:'Świeża partia',color:'#EC9F80',roast:3,acid:3,sweet:4,body:3,notes:['karmel','czerwone jabłko','kakao'],methods:['przelew','espresso','kawiarka'],tastes:['Owocowe','Czekoladowe'],price:49,pop:10,added:'2026-09-14',
  desc:'Nasza kawa „na każdą okazję”. Słodka, okrągła, wybacza błędy w parzeniu.'},
 {id:'brazylia-santos',type:'kawa',name:'Brazylia Santos',country:'Brazylia',proc:'naturalna',region:'Minas Gerais',alt:'1000–1200 m n.p.m.',variety:'mundo novo',color:'#C3CC7B',roast:4,acid:1,sweet:4,body:4,notes:['orzech laskowy','mleczna czekolada','toffi'],methods:['espresso','kawiarka','french'],tastes:['Orzechowe','Czekoladowe'],price:42,pop:9,added:'2026-06-01',
  desc:'Klasyk do mleka. Zero kwasowości, dużo czekolady – idealna na pierwszą kawę rano.'},
 {id:'kenia-nyeri',type:'kawa',name:'Kenia Nyeri AA',country:'Kenia',proc:'myta',region:'Nyeri',alt:'1700–1900 m n.p.m.',variety:'SL28, SL34',badge:'Nowość',color:'#A08FCB',roast:1,acid:5,sweet:3,body:3,notes:['czarna porzeczka','grejpfrut','rabarbar'],methods:['przelew'],tastes:['Owocowe'],price:59,pop:6,added:'2026-11-10',
  desc:'Soczysta, wyrazista, trochę jak sok z porzeczki. Dla tych, którzy lubią, jak kawa „żyje”.'},
 {id:'gwatemala-antigua',type:'kawa',name:'Gwatemala Antigua',country:'Gwatemala',proc:'myta',region:'Antigua',alt:'1500–1700 m n.p.m.',variety:'bourbon',color:'#E2652F',roast:3,acid:2,sweet:4,body:4,notes:['kakao','cynamon','brązowy cukier'],methods:['kawiarka','french','espresso'],tastes:['Czekoladowe'],price:47,pop:7,added:'2026-07-20',
  desc:'Pachnie jak świąteczne ciasto. Świetna z kawiarki, jeszcze lepsza z mlekiem.'},
 {id:'kavvusia-poranna',type:'kawa',name:'Kavvusia Poranna',country:'Mieszanka',proc:'Brazylia + Kolumbia',region:'Minas Gerais / Huila',alt:'1000–1800 m n.p.m.',variety:'mieszanka',badge:'Bestseller',color:'#D77B33',roast:5,acid:1,sweet:3,body:5,notes:['gorzka czekolada','karmel','prażony orzech'],methods:['espresso','kawiarka'],tastes:['Czekoladowe','Orzechowe'],price:44,pop:12,added:'2026-03-01',
  desc:'Nasza mieszanka domu. Mocna, pełna, robi robotę o 6:30.'},
 {id:'rwanda-nyamasheke',type:'kawa',name:'Rwanda Nyamasheke',country:'Rwanda',proc:'naturalna',region:'Nyamasheke',alt:'1700–1900 m n.p.m.',variety:'red bourbon',color:'#F4B6B0',roast:2,acid:4,sweet:4,body:2,notes:['hibiskus','malina','herbata'],methods:['przelew','french'],tastes:['Kwiatowe','Owocowe'],price:56,pop:5,added:'2026-10-20',
  desc:'Malinowa i kwiatowa. Najlepsza z przelewu, bez mleka i bez cukru.'},
 {id:'kolumbia-decaf',type:'kawa',name:'Kolumbia bez kofeiny',country:'Kolumbia',proc:'dekofeinizowana (EA)',region:'Caldas',alt:'1400–1700 m n.p.m.',variety:'castillo',badge:'Bez kofeiny',color:'#B9D3C2',roast:3,acid:2,sweet:4,body:3,notes:['mleczna czekolada','wanilia','orzech'],methods:['przelew','espresso','kawiarka','french'],tastes:['Czekoladowe','Orzechowe'],price:46,pop:4,added:'2026-05-12',
  desc:'Cały smak, zero kofeiny. Na wieczór, na noc i dla tych, którym serce bije za szybko.'},
 {id:'drip-v60',type:'akcesoria',name:'Drip V60 ceramiczny',country:'Akcesoria',color:'#F9E8DC',price:89,pop:6,added:'2026-04-02',methods:['przelew'],
  desc:'Ceramiczny dripper w rozmiarze 02 – parzy 1–2 kubki. Trzyma temperaturę i wygląda świetnie na blacie.'},
 {id:'filtry-v60',type:'akcesoria',name:'Filtry papierowe V60 (100 szt.)',country:'Akcesoria',color:'#FFFDF9',price:24,pop:5,added:'2026-04-02',methods:['przelew'],
  desc:'Białe filtry papierowe do drippera V60 02. Przed parzeniem przepłucz je gorącą wodą.'},
 {id:'mlynek-reczny',type:'akcesoria',name:'Młynek ręczny Kavvusia',country:'Akcesoria',badge:'Polecamy',color:'#C3CC7B',price:219,pop:7,added:'2026-08-08',methods:['przelew','kawiarka','french','espresso'],
  desc:'Stalowe żarna, 40 kroków regulacji – od espresso po french press. Świeżo zmielona kawa to połowa smaku.'},
 {id:'kubek-kavvusia',type:'akcesoria',name:'Kubek emaliowany Kavvusia',country:'Akcesoria',color:'#E2652F',price:59,pop:4,added:'2026-09-01',methods:[],
  desc:'Pomarańczowy kubek emaliowany 350 ml z naszym logo. Przetrwa kemping, zmywarkę i poniedziałek.'}
];
KV.PRODUCTS.forEach(p=>{p.img='produkty/'+p.id+'.png'; p.configurable = p.type==='kawa';});

KV.POSTS = [
 {id:'v60-krok-po-kroku',cat:'Przepisy',title:'V60 bez stresu: trzy zalania i gotowe',excerpt:'Ile zmielić, jak lać i co zrobić, gdy wychodzi kwaśno albo gorzko.',img:'grafiki/web/hero.png',color:'#F3C86A',date:'14 listopada 2026',read:5,
  body:[['p','Przelew to najprostszy sposób, żeby poczuć, czym różnią się kawy. Potrzebujesz drippera, filtra, wagi i czajnika – reszta to rytm.'],['h2','Proporcje na start'],['ul',['15 g kawy, mielenie średnie (jak sól kuchenna)','250 g wody o temperaturze 92–94°C','czas całkowity: 2:30–3:00']],['h2','Krok po kroku'],['ol',['Przepłucz filtr gorącą wodą i wylej ją z kubka.','Wsyp kawę, wyrównaj i zalej 40 g wody. Poczekaj 30 sekund – to preinfuzja.','Dolej do 150 g spokojnym, okrężnym ruchem.','Po minucie dolej do 250 g i pozwól kawie spłynąć.']],['h2','Coś nie gra?'],['p','<strong>Kwaśno i pusto?</strong> Zmiel drobniej. <strong>Gorzko i ściąga?</strong> Zmiel grubiej. Zmieniaj jedną rzecz naraz.']]},
 {id:'kawiarka-jak-u-babci',cat:'Przepisy',title:'Kawiarka jak u babci, tylko bez przypalenia',excerpt:'Gorąca woda na start, mały ogień i zdjęcie z palnika w dobrym momencie.',img:'grafiki/web/kawiarka.png',color:'#C3CC7B',date:'7 listopada 2026',read:4,
  body:[['p','Kawiarka to polski klasyk. Da się z niej wycisnąć świetną kawę – wystarczą trzy triki.'],['ol',['Do dolnego zbiornika wlej <strong>gorącą</strong> wodę – do zaworu, nie wyżej.','Kawę mielesz drobno, ale nie na pył. Nie ubijaj jej.','Mały ogień, otwarta pokrywka. Gdy kawa zaczyna „pluć” i jaśnieje – zdejmij z palnika i schłódź spód pod zimną wodą.']],['p','Najlepiej sprawdzą się kawy średnio i ciemno palone – np. <strong>Kavvusia Poranna</strong> albo <strong>Gwatemala Antigua</strong>.']]},
 {id:'jasne-czy-ciemne',cat:'Wiedza',title:'Jasne czy ciemne palenie? Czym się różnią',excerpt:'Krótko o tym, co dzieje się z ziarnem w bębnie i dlaczego to zmienia smak.',img:'grafiki/web/palarnia.png',color:'#A08FCB',date:'30 października 2026',read:4,
  body:[['p','Im dłużej palimy ziarno, tym więcej w nim goryczki i „palonych” nut, a mniej owoców i kwasowości.'],['h2','Jasne palenie'],['p','Owoce, kwiaty, herbaciana lekkość. Najlepsze do przelewu.'],['h2','Średnie palenie'],['p','Złoty środek: karmel, czekolada, trochę owoców. Pasuje do wszystkiego.'],['h2','Ciemne palenie'],['p','Gorzka czekolada, orzechy, pełne body. Królestwo espresso i kawiarki – zwłaszcza z mlekiem.']]},
 {id:'przechowywanie-kawy',cat:'Porady',title:'Jak przechowywać kawę, żeby nie straciła aromatu',excerpt:'Lodówka? Słoik? Zamrażarka? Rozwiewamy mity.',img:'grafiki/web/ziarna.png',color:'#EC9F80',date:'22 października 2026',read:3,
  body:[['p','Kawa ma czterech wrogów: powietrze, światło, wilgoć i ciepło.'],['ul',['Trzymaj ją w oryginalnej torebce z zaworkiem albo szczelnym, ciemnym pojemniku.','Nie w lodówce – kawa łapie zapachy i wilgoć.','Mielenie tuż przed parzeniem daje najwięcej smaku.','Najlepiej smakuje od 7 do 40 dni od palenia.']]]},
 {id:'french-press-dla-leniwych',cat:'Przepisy',title:'French press dla leniwych: 4 minuty i tłok',excerpt:'Najprostsza metoda na dzbanek kawy dla całej rodziny.',img:'grafiki/web/french-press.png',color:'#B9D3C2',date:'15 października 2026',read:3,
  body:[['ul',['30 g kawy, mielenie grube','500 g wody, 94°C','4 minuty i powolne wciśnięcie tłoka']],['p','Po wciśnięciu od razu przelej kawę do dzbanka lub kubków – inaczej dalej się parzy i robi gorzka.']]},
 {id:'dzien-w-palarni',cat:'Z palarni',title:'Dzień z życia palarni: co robimy w piątek',excerpt:'Od zielonego ziarna do paczki na kurierze – zajrzyj za kulisy.',img:'grafiki/web/paczka.png',color:'#F3C86A',date:'3 października 2026',read:5,
  body:[['p','Piątek to u nas dzień palenia. Zaczynamy o 7:00 od rozgrzania bębna, a kończymy na ważeniu i pakowaniu.'],['p','Każdą partię próbujemy (to się nazywa <em>cupping</em>), zanim trafi do sklepu. W poniedziałek wszystko jedzie do Was.'],['p','<em>To wpis demonstracyjny – Kavvusia to projekt studencki.</em>']]}
];

KV.DEMO_ORDERS = [
 {nr:'KV-10482',date:'2026-11-18',status:2,total:107.99,items:[['Kolumbia Huila · 250 g · Ziarna',1],['Kavvusia Poranna · 250 g · Pod kawiarkę',1]],ship:'Paczkomat InPost WAW123M'},
 {nr:'KV-10391',date:'2026-11-04',status:4,total:103.80,items:[['Brazylia Santos · 500 g · Pod espresso',1],['Filtry papierowe V60 (100 szt.)',1]],ship:'Kurier DPD'},
 {nr:'KV-10215',date:'2026-10-12',status:4,total:68.99,items:[['Etiopia Yirgacheffe · 250 g · Pod przelew',1]],ship:'Paczkomat InPost WAW123M'}
];
KV.STATUSES = ['Przyjęte','Palimy','Pakujemy','Wysłane','Doręczone'];
