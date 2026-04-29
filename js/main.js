// Index
//   const navbar=document.getElementById('lcNavbar'),backTop=document.getElementById('backTop');
// window.addEventListener('scroll',()=>{navbar.classList.toggle('lc-navbar--scrolled',scrollY>50);backTop.classList.toggle('visible',scrollY>400)});
// document.getElementById('navToggle').addEventListener('click',()=>navbar.classList.toggle('nav-open'));
// document.querySelectorAll('.lc-navbar__nav-link').forEach(l=>l.addEventListener('click',()=>navbar.classList.remove('nav-open')));

// Carousel engine
const C={};
function initC(id,trackId,dotsId,total){
    C[id]={cur:0,total,trackId,dotsId};
    const el=document.getElementById(dotsId);
    if(!el)return;
    el.innerHTML='';
    for(let i=0;i<total;i++){
        const d=document.createElement('button');
        d.className='mob-carousel__dot'+(i===0?' active':'');
        d.onclick=()=>goC(id,i);
        el.appendChild(d);
    }
    updateC(id);
}
function updateC(id){
    const{cur,trackId,dotsId}=C[id];
    const track=document.getElementById(trackId);
    if(!track)return;
    const w=track.parentElement.offsetWidth;
    track.style.transform=`translateX(-${cur*w}px)`;
    document.querySelectorAll(`#${dotsId} .mob-carousel__dot`).forEach((d,i)=>d.classList.toggle('active',i===cur));
}
function goC(id,i){C[id].cur=Math.max(0,Math.min(i,C[id].total-1));updateC(id)}
function nextC(id){const c=C[id];goC(id,c.cur===c.total-1?0:c.cur+1)}
function prevC(id){const c=C[id];goC(id,c.cur===0?c.total-1:c.cur-1)}

document.querySelectorAll('.mob-carousel__btn').forEach(btn=>{
    btn.addEventListener('click',()=>{const id=btn.dataset.cid;btn.dataset.dir==='next'?nextC(id):prevC(id)});
});

// Swipe
function addSwipe(trackId,id){
    const el=document.getElementById(trackId);if(!el)return;
    let sx=0;
    el.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
    el.addEventListener('touchend',e=>{const d=sx-e.changedTouches[0].clientX;if(Math.abs(d)>40)d>0?nextC(id):prevC(id)});
}

initC('svc','svcTrack','svcDots',6);
initC('appr','apprTrack','apprDots',4);
initC('ind','indTrack','indDots',5);
initC('test','testTrack','testDots',3);
initC('blog','blogTrack','blogDots',3);

addSwipe('svcTrack','svc');addSwipe('apprTrack','appr');addSwipe('indTrack','ind');
addSwipe('testTrack','test');addSwipe('blogTrack','blog');

window.addEventListener('resize',()=>Object.keys(C).forEach(id=>updateC(id)));

window.addEventListener('scroll', () => {
  const backTop = document.getElementById('backTop');
  if (backTop) {
    backTop.classList.toggle('visible', window.scrollY > 400);
  }
});


// Header
fetch("header.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header").innerHTML = data;
  });

fetch("navbar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;

    initNavbar(); // ✅ call after DOM injection
  });

function initNavbar() {
  const navbar = document.getElementById('lcNavbar');
  const toggle = document.getElementById('navToggle');

  if (!navbar) {
    console.error("Navbar not found!");
    return;
  }

  // ✅ Scroll effect
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // run once initially

  function handleNavbarScroll() {
    navbar.classList.toggle('lc-navbar--scrolled', window.scrollY > 50);
  }

  // ✅ Toggle menu
  if (toggle) {
    toggle.addEventListener('click', () => {
      navbar.classList.toggle('nav-open');
    });
  }

  // ✅ Close menu on link click
  document.querySelectorAll('.lc-navbar__nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('nav-open');
    });
  });
}

  fetch("footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  });



// Disclaimer Popup

(function () {
  // Locks scroll while popup is open
  if (!sessionStorage.getItem('disc_agreed')) {
  document.body.style.overflow = 'hidden';
} else {
  var overlay = document.getElementById('discOverlay');
  if (overlay) overlay.style.display = 'none';
}

  // To show only ONCE per browser session, uncomment the two lines below:
  // if (sessionStorage.getItem('disc_agreed')) { document.body.style.overflow=''; return; }
  // document.getElementById('discOverlay').style.display = 'flex'; // already visible by default

  window.closeDisclaimer = function () {
  var overlay = document.getElementById('discOverlay');
  var modal   = document.getElementById('discModal');

  if (!overlay || !modal) return;

  sessionStorage.setItem('disc_agreed', '1'); // ✅ ADD THIS

  modal.style.animation   = 'discSlideDown 0.35s ease forwards';
  overlay.style.animation = 'discFadeOut 0.4s ease 0.15s forwards';

  setTimeout(function () {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }, 550);
};

  var s = document.createElement('style');
  s.textContent =
    '@keyframes discSlideDown{to{opacity:0;transform:translateY(30px) scale(0.97)}}' +
    '@keyframes discFadeOut{to{opacity:0}}';
  document.head.appendChild(s);
})();


const track = document.getElementById("blogDeskTrack");
const nextBtn = document.getElementById("blogNext");
const prevBtn = document.getElementById("blogPrev");

let cards = Array.from(track.children);
const visible = 3; // number of visible cards
let index = visible;

// ✅ STEP 1: Clone slides (for infinite loop)
const firstClones = cards.slice(0, visible).map(card => card.cloneNode(true));
const lastClones = cards.slice(-visible).map(card => card.cloneNode(true));

// prepend last clones
lastClones.reverse().forEach(clone => {
  track.insertBefore(clone, track.firstChild);
});

// append first clones
firstClones.forEach(clone => {
  track.appendChild(clone);
});

// update cards list after cloning
cards = Array.from(track.children);

// ✅ STEP 2: Get card width
function getCardWidth() {
  return cards[0].offsetWidth + 24; // 24 = gap
}

// ✅ STEP 3: Set initial position
function setPosition() {
  track.style.transform = `translateX(-${index * getCardWidth()}px)`;
}

// wait for layout
window.addEventListener("load", setPosition);
window.addEventListener("resize", setPosition);

// ✅ STEP 4: Slide function
function slide() {
  track.style.transition = "transform 0.4s ease";
  track.style.transform = `translateX(-${index * getCardWidth()}px)`;
}

// ✅ STEP 5: Button controls
nextBtn.addEventListener("click", () => {
  index++;
  slide();
});

prevBtn.addEventListener("click", () => {
  index--;
  slide();
});

// ✅ STEP 6: Infinite loop reset (seamless)
track.addEventListener("transitionend", () => {
  // reached cloned end → jump to real start
  if (index >= cards.length - visible) {
    track.style.transition = "none";
    index = visible;
    setPosition();
  }

  // reached cloned start → jump to real end
  if (index < visible) {
    track.style.transition = "none";
    index = cards.length - (visible * 2);
    setPosition();
  }
});

// ✅ OPTIONAL: Auto scroll (remove if not needed)
setInterval(() => {
  nextBtn.click();
}, 4000);
