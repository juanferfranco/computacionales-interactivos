(() => {
 const key='computacionales-interactivos-theme';
 let saved;try{saved=localStorage.getItem(key);}catch{}
 let theme=['dark','light'].includes(saved)?saved:(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
 function apply(){document.documentElement.dataset.theme=theme;document.querySelectorAll('[data-theme-toggle]').forEach(b=>{b.textContent=theme==='dark'?'Tema claro':'Tema oscuro';b.setAttribute('aria-label','Cambiar a tema '+(theme==='dark'?'claro':'oscuro'));});}
 apply();
 document.querySelectorAll('[data-theme-toggle]').forEach(b=>b.addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';try{localStorage.setItem(key,theme);}catch{}apply();}));
})();
