// Démo AFRO FUTURE : adaptez la date et le numéro WhatsApp avant publication.
const EVENT_DATE = new Date("2026-11-14T09:00:00+01:00").getTime();
const WHATSAPP_NUMBER = "237676055172"; // Remplacer par le numéro de l'organisateur.

const fields = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};

function updateCountdown() {
  const distance = EVENT_DATE - Date.now();
  if (distance <= 0) {
    Object.values(fields).forEach((field) => field.textContent = "00");
    document.querySelector(".countdown-band strong").textContent = "C'EST LE GRAND JOUR !";
    return;
  }
  fields.days.textContent = String(Math.floor(distance / 86400000)).padStart(2, "0");
  fields.hours.textContent = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, "0");
  fields.minutes.textContent = String(Math.floor((distance % 3600000) / 60000)).padStart(2, "0");
  fields.seconds.textContent = String(Math.floor((distance % 60000) / 1000)).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));

document.getElementById("registration-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = [
    "Bonjour, je souhaite demander une inscription à AFRO FUTURE.",
    `Nom : ${data.get("fullname")}`,
    `E-mail : ${data.get("email")}`,
    `Téléphone : ${data.get("phone")}`,
    `Pass : ${data.get("ticket")}`,
    "Merci de me communiquer les modalités de confirmation."
  ].join("\\n");
  document.getElementById("form-feedback").textContent = "Ouverture de WhatsApp avec votre demande…";
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});
