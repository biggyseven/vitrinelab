document.addEventListener('DOMContentLoaded', () => {
  let step = 0;
  const data = { category: 'Visage', need: 'Routine simple', preference: 'Textures légères', budget: 'Signature' };
  const fields = [
    () => `<h2 style="font:600 36px var(--serif);color:var(--wine)">Quel univers souhaitez-vous explorer ?</h2><div class="form-grid">${['Visage','Maquillage','Parfums','Corps','Cheveux'].map(x => `<label class="panel"><input type="radio" name="category" value="${x}" ${data.category===x?'checked':''}> <b>${x}</b></label>`).join('')}</div>`,
    () => `<h2 style="font:600 36px var(--serif);color:var(--wine)">Quelles sont vos préférences ?</h2><div class="form-field"><label>Votre besoin ou envie</label><select class="form-control" name="need">${['Routine simple','Éclat et confort','Maquillage naturel','Fragrance discrète','Soin enveloppant','Routine capillaire','Découverte et plaisir'].map(x => `<option ${data.need===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="form-field" style="margin-top:15px"><label>Votre préférence</label><select class="form-control" name="preference">${['Textures légères','Textures riches','Nuances naturelles','Notes florales','Notes boisées','Selon les produits'].map(x => `<option ${data.preference===x?'selected':''}>${x}</option>`).join('')}</select></div>`,
    () => `<h2 style="font:600 36px var(--serif);color:var(--wine)">Quel budget souhaitez-vous consacrer à cette sélection ?</h2><div class="form-field"><label>Gamme budgétaire</label><select class="form-control" name="budget"><option ${data.budget==='Découverte'?'selected':''}>Découverte</option><option ${data.budget==='Signature'?'selected':''}>Signature</option><option ${data.budget==='Prestige'?'selected':''}>Prestige</option></select></div>`
  ];
  function draw() {
    document.getElementById('advisorStep').innerHTML = fields[step]();
    [1,2,3].forEach((n,i) => document.getElementById('s'+n).classList.toggle('active', i===step));
    document.getElementById('advisorBack').disabled = step===0;
    document.getElementById('advisorNext').textContent = step===2 ? 'Voir ma sélection ↗' : 'Continuer ↗';
  }
  draw();
  document.getElementById('advisorBack').onclick = () => { step=Math.max(0,step-1); draw(); };
  document.getElementById('advisorNext').onclick = () => {
    document.querySelectorAll('#advisorStep [name]').forEach(x => {
      if ((x.type!=='radio' || x.checked) && x.value) data[x.name]=x.value;
    });
    if (step<2) { step++; draw(); return; }
    const target = data.budget==='Découverte' ? 6500 : data.budget==='Signature' ? 16000 : 36000;
    let list = ELORIA_PRODUCTS.filter(p => p.category===data.category);
    list.sort((a,b) => Math.abs(ELORIA_STORE.getPrice(a)-target)-Math.abs(ELORIA_STORE.getPrice(b)-target));
    list = list.slice(0, data.budget==='Découverte' ? 2 : data.budget==='Signature' ? 4 : 5);
    document.getElementById('advisorResults').innerHTML = `<div class="section-head"><div><span class="eyebrow">VOTRE SÉLECTION INDICATIVE</span><h2>Votre rituel ${data.budget.toLowerCase()}.</h2><p>${data.category} · ${data.need} · ${data.preference}</p></div><button class="btn" id="addRoutine">Ajouter la sélection au panier ↗</button></div><div class="product-grid">${list.map(productCard).join('')}</div>`;
    document.getElementById('addRoutine').onclick = () => { list.forEach(p => ELORIA_STORE.add(p.id,1,p.variants[0])); ELORIA.renderCart(); };
    document.getElementById('advisorResults').scrollIntoView({behavior:'smooth'});
  };
});
