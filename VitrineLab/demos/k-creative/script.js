// Personnalisez les coordonnées et le contenu avant la mise en ligne.
const WHATSAPP_NUMBER = "237676055172"; // Numéro VitrineLab de démonstration.

const menuButton = document.querySelector(".menu-btn");
const menu = document.querySelector(".menu");

menuButton.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.querySelector("b").textContent = open ? "−" : "＋";
});
menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  menu.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.querySelector("b").textContent = "＋";
}));

document.getElementById("contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = [
    "Bonjour, je souhaite discuter d'un projet.",
    `Nom : ${data.get("name")}`,
    `E-mail : ${data.get("email")}`,
    `Type de projet : ${data.get("project")}`,
    `Besoin : ${data.get("message")}`
  ].join("\\n");
  document.getElementById("feedback").textContent = "Ouverture de WhatsApp avec votre demande…";
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});
