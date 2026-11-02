document.addEventListener('DOMContentLoaded', () => {
  const initial = ELORIA_STORE.get();
  let step = 0;
  const form = {name:'',phone:'',city:'Douala',district:'',address:'',payment:'MTN Mobile Money',code:''};
  if (!initial.cart.length) {
    document.getElementById('checkoutStep').innerHTML = '<div class="empty">Votre panier est vide. <a href="boutique.html">Découvrir la boutique</a>.</div>';
    document.getElementById('coNext').disabled = true;
    return;
  }
  function totals() {
    const sub = ELORIA_STORE.subtotal();
    const credit = ELORIA_STORE.get().rewardCredit || 0;
    const codeOff = ELORIA_STORE.discount(form.code, sub);
    const off = codeOff + Math.min(credit, Math.max(0, sub-codeOff));
    const ship = ELORIA_STORE.delivery(form.city, sub-off);
    return {sub, off, ship, total:Math.max(0,sub-off+ship)};
  }
  function summary() {
    const t = totals();
    document.getElementById('checkoutSummary').innerHTML = initial.cart.map(i => {
      const p = ELORIA_STORE.product(i.id);
      return `<div class="summary-row"><span>${p.name} × ${i.qty}</span><b>${ELORIA_STORE.money((i.unitPrice||ELORIA_STORE.getPrice(p,i.variant))*i.qty)}</b></div>`;
    }).join('') + `<div class="summary-row"><span>Sous-total</span><b>${ELORIA_STORE.money(t.sub)}</b></div><div class="summary-row"><span>Réductions & fidélité</span><b>− ${ELORIA_STORE.money(t.off)}</b></div><div class="summary-row"><span>Livraison</span><b>${t.ship?ELORIA_STORE.money(t.ship):'Gratuite'}</b></div><div class="summary-row total"><span>Total</span><b>${ELORIA_STORE.money(t.total)}</b></div><p class="notice">Livraison gratuite dès 50 000 FCFA après réductions. Paiement entièrement simulé.</p>`;
  }
  function draw() {
    [1,2,3].forEach((n,i) => document.getElementById('co'+n).classList.toggle('active',step===i));
    document.getElementById('coBack').disabled = step===0;
    document.getElementById('coNext').textContent = step===2 ? 'Confirmer la commande simulée' : 'Continuer ↗';
    if (step===0) {
      document.getElementById('checkoutStep').innerHTML = `<h2 style="font:600 33px var(--serif);color:var(--wine)">Vos coordonnées.</h2><div class="form-grid"><div class="form-field"><label>Nom et prénom fictifs</label><input class="form-control" name="name" required value="${form.name}"></div><div class="form-field"><label>Téléphone fictif</label><input class="form-control" name="phone" required value="${form.phone}" placeholder="6XX XXX XXX"></div><div class="form-field"><label>Ville</label><select class="form-control" name="city"><option ${form.city==='Douala'?'selected':''}>Douala</option><option ${form.city==='Yaoundé'?'selected':''}>Yaoundé</option></select></div><div class="form-field"><label>Quartier fictif</label><input class="form-control" name="district" required value="${form.district}"></div><div class="form-field full"><label>Adresse de livraison fictive</label><input class="form-control" name="address" required value="${form.address}"></div></div>`;
    } else if (step===1) {
      document.getElementById('checkoutStep').innerHTML = `<h2 style="font:600 33px var(--serif);color:var(--wine)">Livraison & paiement.</h2><p class="detail-copy">Livraison de démonstration à Douala ou Yaoundé.</p><div class="form-field"><label>Ville de livraison</label><select class="form-control" name="city"><option ${form.city==='Douala'?'selected':''}>Douala</option><option ${form.city==='Yaoundé'?'selected':''}>Yaoundé</option></select></div><div class="form-field" style="margin-top:14px"><label>Mode de paiement</label><select class="form-control" name="payment"><option ${form.payment==='MTN Mobile Money'?'selected':''}>MTN Mobile Money</option><option ${form.payment==='Orange Money'?'selected':''}>Orange Money</option><option ${form.payment==='Paiement à la livraison'?'selected':''}>Paiement à la livraison</option></select></div><div class="form-field" style="margin-top:14px"><label>Code promotionnel (facultatif)</label><input class="form-control" name="code" value="${form.code}" placeholder="ELORIA10"></div><div class="notice" style="margin-top:16px">Aucun numéro Mobile Money ne sera demandé. Aucun transfert réel ne sera effectué.</div>`;
    } else {
      const t = totals();
      document.getElementById('checkoutStep').innerHTML = `<h2 style="font:600 33px var(--serif);color:var(--wine)">Vérifiez votre commande.</h2><p>Client : <b>${form.name}</b><br>Téléphone fictif : ${form.phone}<br>Adresse : ${form.district}, ${form.city} · ${form.address}<br>Paiement : ${form.payment}</p><p>Total : <b>${ELORIA_STORE.money(t.total)}</b></p><div class="notice">En confirmant, vous créez uniquement une commande fictive dans ce navigateur. Aucun paiement ni livraison réelle.</div>`;
    }
    document.querySelectorAll('#checkoutStep [name]').forEach(el => el.addEventListener('input', () => { form[el.name]=el.value; summary(); }));
    summary();
  }
  document.getElementById('coBack').onclick = () => { step=Math.max(0,step-1); draw(); };
  document.getElementById('coNext').onclick = () => {
    document.querySelectorAll('#checkoutStep [name]').forEach(el => { form[el.name]=el.value; });
    if (step===0 && (!form.name || !form.phone || !form.city || !form.district || !form.address)) { ELORIA.toast('Complétez les informations obligatoires.'); return; }
    if (step<2) { step++; draw(); return; }
    try {
      const order = ELORIA_STORE.placeOrder(form);
      document.querySelector('.stepper').remove();
      document.querySelector('.form-grid').innerHTML = `<div class="panel" style="grid-column:1/-1;text-align:center;padding:45px"><div style="font-size:55px;color:#789875">✓</div><span class="eyebrow">COMMANDE DE DÉMONSTRATION</span><h1 style="font:600 50px var(--serif);color:var(--wine)">Merci ${form.name}.</h1><p>Votre commande fictive <b>${order.id}</b> a été créée localement.</p><p>Total : <b>${ELORIA_STORE.money(order.total)}</b></p><p>Statut : ${order.status}</p><a class="btn" href="compte.html">Voir mon compte ↗</a> <button class="btn btn-light" id="invoiceBtn">Télécharger le reçu PDF démo</button> <a class="btn btn-light" href="index.html">Retour à l'accueil</a><p class="notice" style="margin-top:20px">Aucun paiement réel, aucune transmission externe et aucune livraison n'ont été effectués. Document sans valeur comptable ou fiscale.</p></div>`;
      document.getElementById('invoiceBtn').onclick = () => makeInvoice(order);
    } catch (err) { ELORIA.toast(err.message); }
  };
  function makeInvoice(order) {
    const clean = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\x20-\x7E]/g,' ');
    const lines = ['ELORIA BEAUTY - DOCUMENT DE DEMONSTRATION','Sans valeur comptable ou fiscale','Commande : '+order.id,'Date : '+new Date(order.date).toLocaleString('fr-FR'),'Client : '+clean(order.customer.name),'Ville : '+clean(order.customer.city),'Paiement : '+clean(order.customer.payment),'','DETAIL DE LA COMMANDE',...order.items.map(i => clean(i.product.name)+' x '+i.qty+' ('+clean(i.variant)+') : '+(i.unitPrice*i.qty)+' FCFA'),'','Sous-total : '+order.subtotal+' FCFA','Remise : '+order.discount+' FCFA','Livraison : '+order.shipping+' FCFA','TOTAL : '+order.total+' FCFA','','Aucune transaction ni livraison reelle n a ete effectuee.'];
    const esc = s => s.replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
    let stream = 'BT\n/F1 12 Tf\n50 790 Td\n16 TL\n';
    lines.forEach((line,i) => { if (i) stream += 'T*\n'; stream += '('+esc(line)+') Tj\n'; });
    stream += 'ET';
    const objects = ['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`];
    let pdf='%PDF-1.4\n', offsets=[0];
    objects.forEach((obj,i) => { offsets.push(pdf.length); pdf+=(i+1)+' 0 obj\n'+obj+'\nendobj\n'; });
    const xref=pdf.length;
    pdf+='xref\n0 '+(objects.length+1)+'\n0000000000 65535 f \n';
    for(let i=1;i<offsets.length;i++) pdf+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';
    pdf+='trailer\n<< /Size '+(objects.length+1)+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF';
    const blob=new Blob([pdf],{type:'application/pdf'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=order.id+'-demo.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
});
