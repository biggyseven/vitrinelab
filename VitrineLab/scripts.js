document.addEventListener("DOMContentLoaded", () => {
  const config = window.VITRINELAB_CONFIG || {};
  const whatsappNumber = String(config.whatsappNumber || "237676055172").replace(/\D/g, "");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
    mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }));
  }
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");
  buttons.forEach(button => button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    buttons.forEach(item => item.classList.toggle("active", item === button));
    cards.forEach(card => { card.hidden = !(filter === "all" || card.dataset.category === filter); });
  }));
  const year = document.getElementById("currentYear");
  if (year) year.textContent = new Date().getFullYear();
  const emailLink = document.getElementById("emailLink");
  if (emailLink && config.email) {
    emailLink.href = `mailto:${config.email}`;
    emailLink.textContent = config.email;
  }
  document.querySelectorAll("[data-offer]").forEach(link => link.addEventListener("click", () => {
    const select = document.getElementById("clientService");
    if (select) select.value = link.dataset.offer;
  }));
  const form = document.getElementById("quoteForm");
  if (form) form.addEventListener("submit", event => {
    event.preventDefault();
    if (!whatsappNumber) { alert("Le numéro WhatsApp n'est pas configuré."); return; }
    const data = {
      name: document.getElementById("clientName").value.trim(),
      business: document.getElementById("clientBusiness").value.trim(),
      service: document.getElementById("clientService").value,
      budget: document.getElementById("clientBudget").value,
      details: document.getElementById("clientDetails").value.trim()
    };
    const message = [
      "Bonjour VitrineLab, je souhaite demander un devis.",
      "", `Nom : ${data.name}`, `Activité : ${data.business}`,
      `Projet : ${data.service}`, `Budget : ${data.budget}`,
      data.details ? `Détails : ${data.details}` : ""
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
  // Reveal animations, with graceful fallback when IntersectionObserver is unavailable.
  const revealTargets = document.querySelectorAll(".service-card,.project-card,.price-card,.process-grid article,.faq-list details");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealTargets.forEach(el => el.classList.add("reveal"));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    revealTargets.forEach(el => observer.observe(el));
  }
});