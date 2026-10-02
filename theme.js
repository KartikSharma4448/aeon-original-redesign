// The presentation layer does not replace or rewrite source content.
const progress=document.createElement('div');
progress.className='theme-progress';
progress.setAttribute('aria-hidden','true');
document.body.append(progress);
let pending=false;
addEventListener('scroll',()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;pending=false;});},{passive:true});
if(matchMedia('(prefers-reduced-motion: reduce)').matches){
  addEventListener('load',()=>setTimeout(()=>{
    window.gsap?.globalTimeline.pause();
    document.querySelectorAll('[data-count]').forEach(el=>{
      el.textContent=Number(el.dataset.count).toFixed(Number(el.dataset.decimals||0))+(el.dataset.suffix||'');
    });
  },2200));
}
