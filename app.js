/* Kreator wyceny projektu ogrzewania podlogowego.
   Ceny (zl brutto) odczytane 22.10.2026 z wariantow produktu w sklepie projekt-ogrzewania.pl
   (Projekt instalacji ogrzewania podlogowego - podlogowki). Klucz = gorna granica przedzialu m2. */
const CENNIK={"piwnica-parter-pietro-poddasze":{"std":{"500":1300,"450":1350,"400":1400,"350":1100,"300":1050,"250":900,"200":850,"150":900,"100":800},"eks":{"500":1600,"450":1650,"400":1150,"350":1400,"300":1350,"250":1200,"200":1150,"150":1200,"100":1100}},"piwnica-parter-pietro":{"std":{"500":1250,"450":1250,"400":1350,"350":1000,"300":1000,"250":850,"200":800,"150":800,"100":700},"eks":{"500":1550,"450":1550,"400":1100,"350":1300,"300":1300,"250":1150,"200":1100,"150":1100,"100":1000}},"piwnica-parter":{"std":{"500":1150,"450":1150,"400":1350,"350":950,"300":950,"250":750,"200":700,"50":540,"150":700,"100":600},"eks":{"500":1450,"450":1450,"400":1050,"350":1250,"300":1250,"250":1050,"200":1000,"50":840,"150":1000,"100":900}},"parter-poddasze":{"std":{"500":1150,"450":1150,"400":1400,"350":950,"300":950,"250":750,"50":540,"200":750,"150":700,"100":600},"eks":{"500":1450,"450":1450,"400":1050,"350":1250,"300":1250,"250":1050,"50":840,"200":950,"150":1000,"100":900}},"parter-pietro-poddasze":{"std":{"500":1350,"450":1200,"400":1350,"350":1050,"300":1000,"250":800,"200":850,"150":800,"100":700},"eks":{"500":1650,"450":1400,"400":1100,"350":1350,"300":1300,"250":1100,"200":1150,"150":1100,"100":1050}},"parter-pietro":{"std":{"500":1250,"450":1250,"400":1050,"350":1000,"300":950,"250":750,"50":540,"200":750,"150":700,"100":600},"eks":{"500":1550,"450":1550,"400":1050,"350":1300,"300":1250,"250":1050,"50":840,"200":950,"150":1000,"100":950}},"parter":{"std":{"500":1150,"450":1150,"400":950,"350":950,"300":900,"250":700,"200":650,"150":600,"100":540,"50":400},"eks":{"500":1450,"450":1450,"400":1250,"350":1250,"300":1200,"250":1000,"200":950,"150":900,"100":850,"50":700}}};
(function(){
  const $=s=>document.querySelector(s);
  const NAZWY={
    typ:{nowy:'Nowy dom',modern:'Modernizacja domu',mieszk:'Mieszkanie',inny:'Inny budynek'},
    kond:{'parter':'Parter','parter-pietro':'Parter + Piętro','parter-poddasze':'Parter + Poddasze','parter-pietro-poddasze':'Parter + Piętro + Poddasze','piwnica-parter':'Piwnica + Parter','piwnica-parter-pietro':'Piwnica + Parter + Piętro','piwnica-parter-pietro-poddasze':'Piwnica + Parter + Piętro + Poddasze'},
    zrodlo:{pc:'Pompa ciepła',gaz:'Kocioł gazowy',inne:'Inne źródło',kilka:'Kilka źródeł',brak:'Do wyboru'},
    uklad:{podl:'Tylko podłogówka',miesz:'Podłogówka + grzejniki'},
    etap:{plan:'Przed budową',sso:'Stan surowy',wylewki:'Przed wylewkami',gotowy:'Dom zamieszkały'},
    czas:{std:'Standard, ok. 7 dni rob.',eks:'Ekspres, 48 h'}
  };
  const st={typ:'nowy',kond:'parter',zrodlo:'pc',uklad:'podl',etap:'sso',czas:'std',pow:140};
  const zl=n=>n.toLocaleString('pl-PL').replace(/ /g,' ')+' zł';
  const progi=[50,100,150,200,250,300,350,400,450,500];
  const przedzial=m=>progi.find(p=>m<=p)||null;

  function cena(czas){
    const p=przedzial(st.pow);if(!p)return null;
    const t=CENNIK[st.kond]&&CENNIK[st.kond][czas];
    if(!t)return null;
    if(t[p]!=null)return {kw:t[p],p:p};
    /* np. 50 m2 przy 3 kondygnacjach - w sklepie najmniejszy wariant to 100 m2 */
    const wyz=progi.filter(x=>x>=p&&t[x]!=null)[0];
    return wyz?{kw:t[wyz],p:wyz,podniesiony:true}:null;
  }

  function licz(){
    const p=przedzial(st.pow);
    $('#przedzial').innerHTML=p?'Przedział cennika: <b>do '+p+' m²</b>':'<b>Powyżej 500 m²</b> - wycena indywidualna';
    const cs=cena('std'),ce=cena('eks');
    $('#cStd').textContent=cs?zl(cs.kw):'-';
    $('#cEks').textContent=ce?zl(ce.kw):'-';
    const c=st.czas==='eks'?ce:cs;
    $('#dTyp').textContent=NAZWY.typ[st.typ];
    $('#dKond').textContent=NAZWY.kond[st.kond];
    $('#dPow').textContent=st.pow+' m²'+(c?' (do '+c.p+')':'');
    $('#dZr').textContent=NAZWY.zrodlo[st.zrodlo]+(st.uklad==='miesz'?' + grzejniki':'');
    $('#dEtap').textContent=NAZWY.etap[st.etap];
    $('#dCzas').textContent=NAZWY.czas[st.czas];
    const el=$('#cena');
    const rr=$('#pow');rr.style.setProperty('--p',((+rr.value-rr.min)/(rr.max-rr.min)*100)+'%');
    const nowa=c?zl(c.kw):'Wycena indywidualna';
    if(el.textContent!=='-'&&el.textContent!==nowa){el.classList.remove('mig');void el.offsetWidth;el.classList.add('mig')}
    if(c){
      el.textContent=zl(c.kw);el.classList.remove('ind');
      $('#cenaOpis').textContent='brutto, z cennika sklepu'+(c.podniesiony?' (najmniejszy wariant dla tylu kondygnacji: do '+c.p+' m²)':'');
      $('#odl').innerHTML='Kupujesz rury, rozdzielacze i szafki z wyceny? Odliczamy <b>do '+zl(c.kw)+'</b> od materiałów.';
    }else{
      el.textContent='Wycena indywidualna';el.classList.add('ind');
      $('#cenaOpis').textContent='budynek powyżej 500 m² - cena po obejrzeniu rzutów';
      $('#odl').innerHTML='Koszt projektu może zostać <b>odliczony</b> przy zakupie materiałów z wyceny.';
    }

    const u=[];
    if(st.typ==='modern'||st.typ==='inny')u.push(['w','Modernizacja lub budynek nietypowy: zadzwoń przed zamówieniem, potwierdzimy zakres i cenę.']);
    if(st.uklad==='miesz')u.push(['w','Podłogówka z grzejnikami to układ mieszany - skonsultuj go przed zakupem, może wymagać osobnej wyceny.']);
    if(st.zrodlo==='kilka')u.push(['w','Kilka źródeł ciepła: ustalmy przed zamówieniem, jak mają ze sobą współpracować.']);
    if(st.zrodlo==='pc')u.push(['i','Pod pompę ciepła liczymy możliwie niską temperaturę zasilania - to ona decyduje o rachunkach.']);
    if(st.zrodlo==='brak')u.push(['i','Nie masz jeszcze źródła ciepła? Obliczenia OZC pokażą, jakiej mocy urządzenia naprawdę potrzebujesz.']);
    if(st.zrodlo==='gaz'||st.zrodlo==='inne')u.push(['i','Parametry wody dobierzemy do Twojego źródła ciepła i rodzaju podłóg.']);
    if(st.etap==='wylewki'&&st.czas==='std')u.push(['w','Wylewki tuż-tuż? Rozważ ekspres 48 h ('+(ce?zl(ce.kw):'cena indywidualna')+'), żeby ekipa nie czekała.']);
    if(st.etap==='plan')u.push(['i','Dobry moment: projekt przed warstwami podłogi i wyborem źródła ciepła daje najwięcej swobody.']);
    if(st.etap==='gotowy')u.push(['w','W zamieszkałym domu w grę wchodzi zwykle system suchy - zapytaj przed zamówieniem.']);
    if(st.typ==='mieszk')u.push(['i','Dla mieszkania wybierz jedną kondygnację; potrzebny będzie rzut lokalu z wymiarami.']);
    $('#uwagi').innerHTML=u.map(x=>'<li class="'+(x[0]==='w'?'wazne':'')+'">'+x[1]+'</li>').join('');

    const n=NAZWY.kond[st.kond].split(' + ').length;
    const L=['Rzuty '+(n>1?'wszystkich '+n+' kondygnacji':'kondygnacji')+' (PDF, JPG, DWG lub zdjęcie z wymiarami)','Lokalizacja budynku (strefa klimatyczna)','Izolacja ścian, dachu i podłogi','Parametry okien i drzwi','Planowane źródło ciepła'+(st.zrodlo==='brak'?' (jeśli jeszcze nie wiesz - zaznacz w ankiecie)':''),'Rodzaj wylewki i okładzin: panele, płytki, deska','Preferowane miejsca rozdzielaczy'];
    $('#lista').innerHTML=L.map(x=>'<li>'+x+'</li>').join('');

    const base='https://projekt-ogrzewania.pl/produkt/projekt-instalacji-ogrzewania-podlogowego-podlogowki/';
    const sk=$('#doSklepu');
    if(c){
      sk.href=base+'?attribute_pa_powierzchnia='+c.p+'&attribute_pa_kondygnacja='+st.kond+'&attribute_pa_czas-realizacji='+(st.czas==='eks'?'ekspresowy-termin-realizacji':'standardowy-czas-realizacji');
      sk.target='_blank';sk.textContent='Zamów ten wariant - '+zl(c.kw);
    }else{sk.href='tel:+48783212175';sk.removeAttribute('target');sk.textContent='Zadzwoń po wycenę';}
    const txt='Dzień dobry, proszę o projekt ogrzewania podłogowego.\n'+
      'Inwestycja: '+NAZWY.typ[st.typ]+'\nKondygnacje: '+NAZWY.kond[st.kond]+'\nPowierzchnia: ok. '+st.pow+' m2\n'+
      'Źródło ciepła: '+NAZWY.zrodlo[st.zrodlo]+(st.uklad==='miesz'?' + grzejniki':'')+'\nEtap budowy: '+NAZWY.etap[st.etap]+'\n'+
      'Termin: '+NAZWY.czas[st.czas]+'\nCena z kreatora: '+(c?zl(c.kw):'wycena indywidualna');
    $('#doWa').href='https://wa.me/48794358367?text='+encodeURIComponent(txt);
    $('#mobCta').dataset.cena=c?zl(c.kw):'wycena indywidualna';if(wKreatorze)mobCta();
    $('#doMail').href='mailto:biuro@projekt-ogrzewania.pl?subject='+encodeURIComponent('Projekt podłogówki - '+st.pow+' m2, '+NAZWY.kond[st.kond])+'&body='+encodeURIComponent(txt+'\n\nRzuty w załączniku.');
  }

  /* na telefonie: gdy uzytkownik jest w kreatorze, pasek dolny pokazuje aktualna cene i prowadzi do podsumowania */
  let wKreatorze=false;
  function mobCta(){const b=$('#mobCta');if(wKreatorze){b.textContent='Podsumowanie: '+b.dataset.cena;b.setAttribute('href','#wynik')}else{b.textContent='Sprawdź cenę projektu';b.setAttribute('href','#wycena')}}
  if('IntersectionObserver' in window)new IntersectionObserver(w=>w.forEach(x=>{wKreatorze=x.isIntersecting;mobCta()}),{threshold:0,rootMargin:'0px 0px -40% 0px'}).observe(document.querySelector('.kreator'));
  function zaznacz(grupa,v){document.querySelectorAll('[data-p="'+grupa+'"] button').forEach(x=>{x.classList.toggle('on',x.dataset.v===v);x.setAttribute('aria-pressed',x.dataset.v===v)})}
  document.querySelectorAll('#kreator [data-p]').forEach(g=>{
    g.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x.classList.contains('on')));
    g.addEventListener('click',e=>{
      const b=e.target.closest('button');if(!b)return;
      st[g.dataset.p]=b.dataset.v;zaznacz(g.dataset.p,b.dataset.v);
      if(g.dataset.p==='typ'&&b.dataset.v==='mieszk'){st.kond='parter';zaznacz('kond','parter');if(st.pow>150)ustawPow(70)}
      licz();
    });
  });
  const r=$('#pow'),num=$('#powNum');
  function ustawPow(v){st.pow=v;r.value=Math.min(600,Math.max(30,v));num.value=v}
  r.addEventListener('input',()=>{st.pow=+r.value;num.value=r.value;licz()});
  num.addEventListener('input',()=>{const v=Math.round(+num.value);if(v>=20&&v<=2000){st.pow=v;r.value=Math.min(600,Math.max(30,v));licz()}});
  num.addEventListener('blur',()=>{num.value=st.pow});
  licz();

  /* menu */
  const ham=$('.ham'),menu=$('#menu');
  ham.addEventListener('click',()=>{const o=menu.classList.toggle('otw');ham.setAttribute('aria-expanded',o);ham.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu')});
  menu.addEventListener('click',e=>{if(e.target.closest('a')){menu.classList.remove('otw');ham.setAttribute('aria-expanded',false)}});

  /* dolny pasek na telefonie - dopiero po przewinieciu za CTA w hero */
  const m=$('.mob'),t=$('.hero-cta');
  if(m){
    if(!t||!('IntersectionObserver' in window))m.classList.add('widac');
    else new IntersectionObserver(w=>w.forEach(x=>m.classList.toggle('widac',!x.isIntersecting&&x.boundingClientRect.top<0)),{threshold:0}).observe(t);
    /* przy przyciskach karty wyceny pasek sie chowa, zeby nie dublowac akcji */
    if('IntersectionObserver' in window)new IntersectionObserver(w=>w.forEach(x=>m.classList.toggle('schowaj',x.isIntersecting)),{threshold:0}).observe($('.tb-akcje'));
  }
})();
