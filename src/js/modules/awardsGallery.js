import gsap from 'gsap';
import { MOTION } from './homeMotion.js';

// A single photo stage and a selectable, wheel-driven awards index.
export default class AwardsGallery {
  constructor(owner) {
    this.owner = owner;
    this.slide = document.querySelector('[data-hash="premios"]');
    if (!this.slide) return;
    this.items = [...this.slide.querySelectorAll('.premio')].map(row => ({
      year: row.querySelector('.texto-premio span').textContent.trim(),
      title: row.querySelector('h3').textContent.trim(),
      result: row.querySelector('.texto-premio p').textContent.trim(),
      image: row.querySelector('.imagem__premio img').getAttribute('src'),
      href: row.querySelector('.button__premio a')?.getAttribute('href')
    }));
    if (!this.items.length) return;
    this.index = 0; this.desired = 0; this.busy = false; this.lastWheel = -Infinity;
    this.lastEvent = 0; this.accumulated = 0; this.settledAt = -Infinity;
    this.media = matchMedia('(prefers-reduced-motion: reduce)');
    const root = this.slide.querySelector('.studio');
    root.classList.add('awards-editorial', 'swiper-no-swiping');
    root.innerHTML = '<div class="awards-index"><h2 class="premios__title">Prêmios</h2><div class="awards-list" role="group" aria-label="Selecionar prêmio"></div></div><div class="awards-viewer"><a class="awards-stage" id="award-photo"></a><div class="awards-caption" aria-live="polite"><div class="awards-placement"></div><div><h3></h3><p></p></div></div><div class="awards-controls"><button type="button" class="awards-prev" aria-label="Prêmio anterior"><img src="./img/logo-r.svg" alt="" aria-hidden="true"></button><span class="awards-counter"></span><button type="button" class="awards-next" aria-label="Próximo prêmio"><img src="./img/logo-r.svg" alt="" aria-hidden="true"></button></div></div>';
    this.root = root; this.list = root.querySelector('.awards-list'); this.stage = root.querySelector('.awards-stage');
    this.stage.addEventListener('click', event => {
      if (performance.now() < (this.suppressPhotoClickUntil || 0)) event.preventDefault();
    });
    this.caption = root.querySelector('.awards-caption');
    root.querySelector('.awards-index').append(this.caption);
    this.buttons = this.items.map((item, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'awards-item';
      b.setAttribute('aria-controls', 'award-photo');
      const year = document.createElement('span'); year.className = 'awards-year'; year.textContent = item.year;
      const text = document.createElement('span'); text.className = 'awards-item-text';
      const title = document.createElement('span'); title.className = 'awards-name'; title.textContent = item.title;
      const result = document.createElement('span'); result.className = 'awards-result'; result.textContent = item.result;
      const arrow = document.createElement('img'); arrow.src = './img/logo-r.svg'; arrow.alt = ''; arrow.className = 'awards-arrow';
      text.append(title, result); b.append(year, text, arrow);
      b.addEventListener('click', () => this.select(i)); this.list.append(b); return b;
    });
    this.layer = this.makeLayer(this.items[0]); this.stage.append(this.layer);
    this.update();
    root.querySelector('.awards-prev').addEventListener('click', () => this.step(-1));
    root.querySelector('.awards-next').addEventListener('click', () => this.step(1));
    this.key = event => {
      if (!this.active() || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.altKey || event.ctrlKey || event.metaKey) return;
      const direction = ['ArrowDown','ArrowRight','PageDown'].includes(event.key) ? 1 : ['ArrowUp','ArrowLeft','PageUp'].includes(event.key) ? -1 : 0;
      if (!direction) return;
      event.preventDefault(); event.stopImmediatePropagation();
      if (!event.repeat) this.step(direction);
    };
    document.addEventListener('keydown', this.key, true);
    let touch = null;
    root.addEventListener('pointerdown', e => { if (e.pointerType === 'touch') touch = {x:e.clientX,y:e.clientY}; });
    root.addEventListener('pointerup', e => {
      if (!touch) return;
      const dy = touch.y-e.clientY, dx = touch.x-e.clientX; touch = null;
      if (Math.abs(dy)>45 && Math.abs(dy)>Math.abs(dx)) { this.suppressPhotoClickUntil = performance.now()+500; this.step(Math.sign(dy)); }
    });
    root.addEventListener('pointercancel', () => {touch=null;});
    this.onMedia = () => { this.timeline?.progress(1); };
    this.media.addEventListener('change', this.onMedia);
    this.observer = new MutationObserver(() => { if (!this.slide.isConnected) this.destroy(); });
    this.observer.observe(this.slide.parentElement, {childList:true});
    owner.awardsGallery = this;
    this.preload();
  }
  active() {
    const s = this.owner.swiper;
    return this.slide.isConnected && s?.enabled && s.slides[s.activeIndex] === this.slide && !this.owner.categoryBusy;
  }
  makeLayer(item) {
    const layer = document.createElement('div'); layer.className = 'awards-photo';
    const image = document.createElement('img'); image.src = item.image; image.alt = item.title; image.decoding = 'async';
    layer.append(image); return layer;
  }
  update() {
    const item = this.items[this.index];
    this.buttons.forEach((b,i) => { b.classList.toggle('is-selected',i===this.index); b.setAttribute('aria-pressed',String(i===this.index)); });
    this.caption.querySelector('h3').textContent = item.title;
    this.caption.querySelector('.awards-placement').textContent = item.result;
    this.caption.querySelector('p').textContent = item.year;
    const link = this.stage;
    link.setAttribute('aria-label', 'Ver projeto: ' + item.title);
    if (item.href) link.setAttribute('href',item.href); else link.removeAttribute('href');
    this.root.querySelector('.awards-counter').textContent = String(this.index+1).padStart(2,'0') + ' / ' + String(this.items.length).padStart(2,'0');
    const b = this.buttons[this.index];
    this.list.scrollTo({top:Math.max(0,b.offsetTop-(this.list.clientHeight-b.clientHeight)/2),behavior:this.media.matches?'instant':'smooth'});
  }
  preload() {
    [this.index-1,this.index+1].forEach(i => { if(this.items[i]) {const img=new Image();img.src=this.items[i].image;} });
  }
  wheel(event) {
    if (!this.active() || event.ctrlKey || !event.deltaY || Math.abs(event.deltaX)>Math.abs(event.deltaY)) return false;
    event.preventDefault(); event.stopImmediatePropagation();
    if (this.owner.swiper.animating) return true;
    const now = performance.now(), direction = Math.sign(event.deltaY);
    if (now-this.lastEvent>180 || Math.sign(this.accumulated)!==direction) this.accumulated=0;
    this.lastEvent=now;
    this.accumulated += event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
    if (Math.abs(this.accumulated)<18 || now-this.lastWheel<180) return true;
    this.accumulated=0; this.lastWheel=now; this.step(direction); return true;
  }
  step(direction) {
    if (!this.active() || this.owner.swiper.animating) return;
    const target = this.desired + direction;
    if (target<0 || target>=this.items.length) {
      // A distinct tick after settling exits the section; inertia cannot skip the last award.
      if (this.busy || performance.now()-this.settledAt<550) return;
      this.owner.pendingWheelDirection=0;
      this.owner.swiper.slideTo(this.owner.swiper.activeIndex+direction);
      return;
    }
    this.select(target);
  }
  select(index) {
    this.desired = Math.max(0,Math.min(this.items.length-1,index));
    if (this.busy) { this.timeline?.timeScale(1.35); return; }
    if (this.desired!==this.index) this.show(this.desired);
  }
  async show(index) {
    this.busy=true;
    const incoming=this.makeLayer(this.items[index]), image=incoming.firstElementChild;
    // Keep the old photo visible until the next image has decoded.
    let timer;
    await Promise.race([image.decode().catch(()=>{}),new Promise(resolve=>{timer=setTimeout(resolve,5000);})]);
    clearTimeout(timer);
    if (!this.slide.isConnected) return;
    if (this.desired!==index) {this.busy=false;this.select(this.desired);return;}
    const old=this.layer, direction=index>this.index?1:-1;
    if (!image.naturalWidth) {
      incoming.textContent='Imagem indisponível'; incoming.classList.add('awards-photo-unavailable');
    }
    this.stage.append(incoming);
    this.index=index; this.update();
    const finish=()=>{
      old.remove();this.layer=incoming;this.timeline=null;this.busy=false;this.settledAt=performance.now();this.preload();
      if(this.desired!==this.index)this.select(this.desired);
    };
    if(this.media.matches){finish();return;}
    gsap.set(incoming,{clipPath:direction>0?'inset(100% 0 0 0)':'inset(0 0 100% 0)'});
    this.timeline=gsap.timeline({onComplete:finish})
      .fromTo(image,{scale:1.12},{scale:1,duration:MOTION.zoomDuration,ease:'portfolio-zoom'},0)
      .to(old.querySelector('img'),{scale:1.1,duration:MOTION.edgeDuration,ease:'portfolio-zoom'},0)
      .to(incoming,{clipPath:'inset(0% 0 0% 0)',duration:MOTION.edgeDuration,ease:'portfolio-edge'},0)
      .fromTo(this.caption,{opacity:0,y:direction*8},{opacity:1,y:0,duration:.35,ease:'power2.out'},.2);
  }
  destroy() {
    this.timeline?.kill();this.observer.disconnect();document.removeEventListener('keydown',this.key,true);
    this.media.removeEventListener('change',this.onMedia);
    if(this.owner.awardsGallery===this)this.owner.awardsGallery=null;
  }
}
