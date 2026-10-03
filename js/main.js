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
      // Reject required fields that only contain spaces (native validation accepts them).
      const blank = [...form.querySelectorAll("[required]")].find((field) => !field.value.trim());
      if (blank) {
        blank.value = "";
        blank.reportValidity();
        return;
      }
      track("Formulaire", form.dataset.intro || "formulaire");
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

function track(eventName, label) {
  // Cookie-free analytics hook (e.g. Plausible). No-op until an analytics script is installed.
  if (typeof window.plausible === "function") window.plausible(eventName, { props: { label } });
}

function initConversionTracking() {
  document.querySelectorAll("a.whatsapp-link").forEach((link) => {
    link.addEventListener("click", () => track("WhatsApp", link.textContent.trim()));
  });
}

function initMapConsent() {
  document.querySelectorAll(".map-consent").forEach((box) => {
    const button = box.querySelector(".map-consent-btn");
    if (!button) return;
    button.addEventListener("click", () => {
      const iframe = document.createElement("iframe");
      iframe.title = "Localisation OWAN INTER LINK";
      iframe.src = box.dataset.mapSrc;
      iframe.width = "100%";
      iframe.height = "360";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.style.border = "0";
      box.replaceWith(iframe);
    });
  });
}

function initScrollReveal() {
  const items = document.querySelectorAll(".reveal-on-scroll");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  items.forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initWhatsAppForms();
  initWhatsAppLinks();
  initScrollReveal();
  initConversionTracking();
  initMapConsent();
});
