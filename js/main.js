const WHATSAPP_NUMBER = "225XXXXXXXXX";

function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function buildWhatsAppMessage(form) {
  const intro = form.dataset.intro || "Bonjour OWAN,";
  const lines = [intro];
  const fields = form.querySelectorAll("input[name], select[name], textarea[name]");
  fields.forEach((field) => {
    const value = field.value.trim();
    if (!value) return;
    const label = form.querySelector(`label[for="${field.id}"]`);
    const labelText = label ? label.textContent.trim() : field.name;
    lines.push(`${labelText} : ${value}`);
  });
  return lines.join("\n");
}

function whatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function initWhatsAppForms() {
  document.querySelectorAll("form.whatsapp-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = buildWhatsAppMessage(form);
      window.location.href = whatsAppUrl(message);
    });
  });
}

function initWhatsAppLinks() {
  document.querySelectorAll("a.whatsapp-link").forEach((link) => {
    const message = link.dataset.message || "Bonjour OWAN,";
    link.href = whatsAppUrl(message);
    link.target = "_blank";
    link.rel = "noopener";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initWhatsAppForms();
  initWhatsAppLinks();
});
