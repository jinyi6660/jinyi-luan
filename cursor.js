(function(){
  if (window.matchMedia && !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

  var ZOOM = 2.2;
  var LENS_SIZE = 160;

  var lens = document.createElement('canvas');
  lens.className = 'img-lens';
  lens.width = LENS_SIZE;
  lens.height = LENS_SIZE;
  lens.setAttribute('aria-hidden', 'true');
  var ctx = lens.getContext('2d');

  function mount(){ document.body.appendChild(lens); }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  function place(e){
    lens.style.left = e.clientX + 'px';
    lens.style.top = e.clientY + 'px';
  }

  function update(img, e){
    var r = img.getBoundingClientRect();
    if (!r.width || !r.height || !img.naturalWidth) return;
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    var scaleX = img.naturalWidth / r.width;
    var scaleY = img.naturalHeight / r.height;
    var sampleW = (LENS_SIZE / ZOOM) * scaleX;
    var sampleH = (LENS_SIZE / ZOOM) * scaleY;
    var sx = Math.min(Math.max(x * scaleX - sampleW / 2, 0), Math.max(img.naturalWidth - sampleW, 0));
    var sy = Math.min(Math.max(y * scaleY - sampleH / 2, 0), Math.max(img.naturalHeight - sampleH, 0));
    try{
      ctx.imageSmoothingEnabled = true;
      ctx.clearRect(0, 0, LENS_SIZE, LENS_SIZE);
      ctx.drawImage(img, sx, sy, sampleW, sampleH, 0, 0, LENS_SIZE, LENS_SIZE);
    } catch (err) { /* ignore draw errors */ }
  }

  function bind(img){
    img.setAttribute('data-lensable', '');
    img.addEventListener('mouseenter', function(){ lens.classList.add('is-active'); });
    img.addEventListener('mousemove', function(e){ place(e); update(img, e); });
    img.addEventListener('mouseleave', function(){ lens.classList.remove('is-active'); });
  }

  function scan(){
    document.querySelectorAll('img:not([data-lensable])').forEach(bind);
  }
  if (document.body) scan(); else document.addEventListener('DOMContentLoaded', scan);

  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
})();
