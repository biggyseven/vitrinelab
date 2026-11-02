(() => {
  const form = document.getElementById('energyForm');
  if (!form) return;
  const steps = [...form.querySelectorAll('.form-step')];
  const prev = document.getElementById('prevStep');
  const next = document.getElementById('nextStep');
  const submit = document.getElementById('submitForm');
  const label = document.getElementById('stepLabel');
  const percent = document.getElementById('stepPercent');
  const bar = document.getElementById('progressBar');
  const dots = [...document.querySelectorAll('.step-dots i')];
  const success = document.getElementById('formSuccess');
  const summary = document.getElementById('summaryBox');
  const restart = document.getElementById('restartForm');
  let current = 0;

  const buildingChoices = document.getElementById('buildingChoices');
  const buildingOptions = {
    Particulier: [
      ['Maison individuelle','⌂','Maison'], ['Appartement','▤','Appartement'], ['Autre bâtiment','◇','Autre']
    ],
    Entreprise: [
      ['Bureau / PME','▦','Bureau / PME'], ['Commerce / hôtel','⌑','Commerce / hôtel'], ['Atelier / entrepôt','▥','Atelier / entrepôt'], ['Autre bâtiment','◇','Autre']
    ]
  };

  function updateBuildingChoices(profile) {
    if (!buildingChoices || !profile) return;
    const currentChoice = form.querySelector('input[name="building"]:checked')?.value;
    const options = buildingOptions[profile] || buildingOptions.Particulier;
    buildingChoices.replaceChildren();
    options.forEach(([value, icon, title]) => {
      const item = document.createElement('label');
      item.className = 'choice-card';
      const radio = document.createElement('input');
      radio.type = 'radio'; radio.name = 'building'; radio.value = value; radio.required = true;
      if (currentChoice === value) radio.checked = true;
      const mark = document.createElement('span'); mark.className = 'choice-icon'; mark.textContent = icon;
      const text = document.createElement('strong'); text.textContent = title;
      item.append(radio, mark, text);
      buildingChoices.append(item);
    });
  }
  form.querySelectorAll('input[name="profile"]').forEach(input => input.addEventListener('change', () => updateBuildingChoices(input.value)));

  function showStep(index) {
    current = index;
    steps.forEach((step, i) => step.classList.toggle('active', i === current));
    const count = steps.length;
    const pct = Math.round(((current + 1) / count) * 100);
    label.textContent = `ÉTAPE ${String(current + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
    percent.textContent = `${pct}%`;
    bar.style.width = `${pct}%`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i <= current));
    prev.disabled = current === 0;
    next.hidden = current === count - 1;
    submit.hidden = current !== count - 1;
    const err = steps[current].querySelector('.field-error');
    if (err) err.textContent = '';
  }

  function validateCurrent() {
    const step = steps[current];
    const error = step.querySelector('.field-error');
    if (error) error.textContent = '';
    const requiredFields = [...step.querySelectorAll('[required]')];
    let invalid = false;

    const radioNames = [...new Set(requiredFields.filter(el => el.type === 'radio').map(el => el.name))];
    radioNames.forEach(name => {
      if (!step.querySelector(`input[name="${CSS.escape(name)}"]:checked`)) invalid = true;
    });
    requiredFields.filter(el => el.type !== 'radio' && el.type !== 'checkbox').forEach(field => {
      if (!field.value.trim() || !field.checkValidity()) invalid = true;
    });
    const optionalEmail = step.querySelector('input[type="email"]');
    if (optionalEmail && optionalEmail.value.trim() && !optionalEmail.checkValidity()) invalid = true;
    requiredFields.filter(el => el.type === 'checkbox').forEach(field => { if (!field.checked) invalid = true; });

    if (invalid) {
      if (error) error.textContent = current === 4
        ? 'Complétez les champs requis et confirmez le caractère fictif de cette simulation.'
        : 'Choisissez une réponse ou complétez le champ requis pour continuer.';
      const first = requiredFields.find(field => field.type !== 'radio' && field.type !== 'checkbox' && (!field.value.trim() || !field.checkValidity()));
      if (first) first.focus();
      else requiredFields.find(field => field.type === 'radio')?.focus();
      return false;
    }
    return true;
  }

  next.addEventListener('click', () => { if (validateCurrent()) showStep(Math.min(current + 1, steps.length - 1)); });
  prev.addEventListener('click', () => showStep(Math.max(current - 1, 0)));

  function escapeText(value) {
    return String(value || 'Non renseigné').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  }
  function addSummary(labelText, value) {
    const item = document.createElement('div'); item.className = 'summary-item';
    const labelNode = document.createElement('span'); labelNode.textContent = labelText;
    const valueNode = document.createElement('strong'); valueNode.textContent = value || 'Non renseigné';
    item.append(labelNode, valueNode); summary.append(item);
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validateCurrent()) return;
    const data = new FormData(form);
    const appliances = data.getAll('appliances');
    summary.replaceChildren();
    addSummary('PROFIL', data.get('profile'));
    addSummary('LOCALITÉ', data.get('city'));
    addSummary('BÂTIMENT', data.get('building'));
    addSummary('BESOIN', data.get('need'));
    addSummary('ÉQUIPEMENTS', appliances.join(', ') || 'À préciser');
    addSummary('AUTONOMIE', data.get('autonomy'));
    addSummary('CONTACT DE DÉMO', data.get('name'));
    addSummary('TÉLÉPHONE SAISI', data.get('phone'));
    if (data.get('email')) addSummary('E-MAIL SAISI', data.get('email'));
    form.hidden = true;
    document.querySelector('.form-progress').hidden = true;
    success.hidden = false;
    const mobileCta = document.querySelector('.mobile-cta');
    if (mobileCta) mobileCta.classList.add('is-hidden');
    success.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });

  restart.addEventListener('click', () => {
    form.reset();
    form.hidden = false;
    document.querySelector('.form-progress').hidden = false;
    success.hidden = true;
    if (buildingChoices) updateBuildingChoices('Particulier');
    showStep(0);
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  showStep(0);
})();
