// AlbDev — interações do portfólio
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector("#menu-toggle");
const navMenu = document.querySelector("#nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

// Atualiza o fundo da navegação ao rolar a página.
function updateHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 24);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// Menu mobile acessível.
function closeMenu() {
  if (!menuToggle || !navMenu) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  navMenu.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  navMenu?.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

// Revela elementos conforme entram na tela.
const revealElements = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

// Destaca no menu a seção que está visível.
const sections = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isCurrent);
      });
    });
  }, { rootMargin: "-38% 0px -52% 0px" });

  sections.forEach((section) => sectionObserver.observe(section));
}

// Ano automático no rodapé.
const yearElement = document.querySelector("#current-year");
if (yearElement) yearElement.textContent = new Date().getFullYear();


/* Modal de contato do botão principal. */
const contactDialog = document.querySelector("#contact-dialog");
const openContactDialog = document.querySelector("#open-contact-dialog");
const closeContactDialog = document.querySelector("#close-contact-dialog");
openContactDialog?.addEventListener("click", () => {
  if (contactDialog && !contactDialog.open) contactDialog.showModal();
});
closeContactDialog?.addEventListener("click", () => contactDialog?.close());
contactDialog?.addEventListener("click", (event) => {
  if (event.target === contactDialog) contactDialog.close();
});


/* Formulário: prepara os dados e abre uma conversa no WhatsApp. */
const contactForm = document.querySelector("#contact-form");
const contactFormFeedback = document.querySelector("#contact-form-feedback");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "Contato pelo portfólio").trim();
  const message = String(formData.get("message") || "").trim();

  const whatsappMessage = [
    "Olá, Antony! Encontrei seu portfólio e gostaria de conversar.",
    "",
    `*Nome:* ${name}`,
    email ? `*E-mail:* ${email}` : null,
    `*Assunto:* ${subject}`,
    "",
    `*Mensagem:* ${message}`
  ].filter(Boolean).join("\n");

  const whatsappUrl = `https://wa.me/5534996954479?text=${encodeURIComponent(whatsappMessage)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");

  if (contactFormFeedback) {
    contactFormFeedback.textContent = "O WhatsApp foi aberto com sua mensagem. Revise os dados e toque em Enviar para concluir.";
  }
});
