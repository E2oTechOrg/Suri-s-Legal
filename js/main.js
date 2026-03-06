// Index
  const navbar=document.getElementById('lcNavbar'),backTop=document.getElementById('backTop');
window.addEventListener('scroll',()=>{navbar.classList.toggle('lc-navbar--scrolled',scrollY>50);backTop.classList.toggle('visible',scrollY>400)});
document.getElementById('navToggle').addEventListener('click',()=>navbar.classList.toggle('nav-open'));
document.querySelectorAll('.lc-navbar__nav-link').forEach(l=>l.addEventListener('click',()=>navbar.classList.remove('nav-open')));

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





// Header
fetch("header.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header").innerHTML = data;
  });

  fetch("footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  });



// Disclaimer Popup

(function () {
  // Locks scroll while popup is open
  document.body.style.overflow = 'hidden';

  // To show only ONCE per browser session, uncomment the two lines below:
  // if (sessionStorage.getItem('disc_agreed')) { document.body.style.overflow=''; return; }
  // document.getElementById('discOverlay').style.display = 'flex'; // already visible by default

  window.closeDisclaimer = function () {
    var overlay = document.getElementById('discOverlay');
    var modal   = document.getElementById('discModal');
    // sessionStorage.setItem('disc_agreed', '1'); // uncomment for once-per-session
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


