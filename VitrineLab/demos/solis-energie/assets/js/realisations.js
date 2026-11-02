(() => {
  const modal = document.getElementById('caseModal');
  const closeButton = document.getElementById('modalClose');
  if (!modal) return;

  const cases = {
    residence: {
      kicker: 'ÉTUDE CONCEPTUELLE 01 · HABITAT',
      title: 'Résidence solaire',
      description: 'Scénario illustratif pour une maison qui souhaite maintenir certains usages essentiels et exploiter une production photovoltaïque locale.',
      need: 'Éclairage, froid domestique, équipements numériques et confort quotidien pendant certaines périodes de coupure.',
      solution: "Une architecture hybride à étudier, avec production solaire, conversion et stockage. Les circuits prioritaires seraient identifiés pendant l’étude.",
      equipment: ['Panneaux photovoltaïques', 'Onduleur adapté à l’architecture retenue', 'Batteries de stockage', 'Protections et distribution électrique'],
      nodes: [['Solaire','production'],['Onduleur','conversion'],['Batteries','stockage'],['Usages','maison']]
    },
    professionnel: {
      kicker: 'ÉTUDE CONCEPTUELLE 02 · ENTREPRISE',
      title: 'Énergie professionnelle',
      description: 'Scénario illustratif pour un bureau ou une PME qui souhaite étudier la continuité de certaines activités et la coordination de plusieurs sources.',
      need: "Postes informatiques, réseau, éclairage, froid et équipements prioritaires selon les heures d’activité.",
      solution: 'Un système hybride à étudier qui coordonne production photovoltaïque, batteries et réseau. La gestion des priorités serait définie selon les usages.',
      equipment: ['Panneaux photovoltaïques', 'Onduleur ou système de conversion', 'Batteries de stockage', 'Réseau et protections adaptées'],
      nodes: [['Solaire','production'],['Onduleur','gestion'],['Réseau','appoint'],['Batteries','stockage'],['Usages','activité']]
    },
    hotel: {
      kicker: 'ÉTUDE CONCEPTUELLE 03 · HÉBERGEMENT',
      title: 'Autonomie énergétique',
      description: 'Scénario illustratif pour un hôtel situé dans une zone où la disponibilité du réseau est limitée. La photographie montre un environnement hôtelier tropical et non une réalisation SOLIS.',
      need: "Éclairage, réfrigération, pompage et équipements d’accueil, avec des profils d’utilisation répartis sur la journée et la nuit.",
      solution: 'Une architecture autonome à étudier, reposant sur production solaire, stockage et gestion rigoureuse des usages. Les besoins de réserve doivent être évalués.',
      equipment: ['Panneaux photovoltaïques', 'Onduleur et régulation', 'Batteries dimensionnées après étude', 'Protections et distribution électrique'],
      nodes: [['Solaire','production'],['Régulation','gestion'],['Batteries','réserve'],['Usages','hôtel']]
    }
  };

  const title = document.getElementById('modalTitle');
  const kicker = document.getElementById('modalKicker');
  const description = document.getElementById('modalDescription');
  const need = document.getElementById('modalNeed');
  const solution = document.getElementById('modalSolution');
  const equipment = document.getElementById('modalEquipment');
  const diagram = document.getElementById('modalDiagram');
  let lastFocused = null;

  function renderDiagram(nodes) {
    diagram.replaceChildren();
    const row = document.createElement('div');
    row.className = 'diagram-row';
    nodes.forEach((node, index) => {
      const box = document.createElement('div');
      box.className = 'diagram-node';
      const strong = document.createElement('strong');
      strong.textContent = node[0];
      const small = document.createElement('small');
      small.textContent = node[1];
      box.append(strong, small);
      row.append(box);
      if (index < nodes.length - 1) {
        const arrow = document.createElement('span');
        arrow.className = 'diagram-arrow';
        arrow.textContent = '→';
        arrow.setAttribute('aria-hidden', 'true');
        row.append(arrow);
      }
    });
    diagram.append(row);
  }

  function openCase(key, trigger) {
    const item = cases[key];
    if (!item) return;
    lastFocused = trigger;
    kicker.textContent = item.kicker;
    title.textContent = item.title;
    description.textContent = item.description;
    need.textContent = item.need;
    solution.textContent = item.solution;
    equipment.replaceChildren();
    item.equipment.forEach(label => {
      const li = document.createElement('li');
      li.textContent = label;
      equipment.append(li);
    });
    renderDiagram(item.nodes);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('[data-case]').forEach(button => {
    button.addEventListener('click', () => openCase(button.dataset.case, button));
  });
  closeButton.addEventListener('click', closeModal);
  modal.querySelectorAll('[data-close-modal]').forEach(node => node.addEventListener('click', closeModal));
  document.addEventListener('keydown', event => {
    if (!modal.classList.contains('is-open')) return;
    if (event.key === 'Escape') { closeModal(); return; }
    if (event.key === 'Tab') {
      const focusable = [...modal.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
})();
