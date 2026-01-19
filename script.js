// Initialize EmailJS with your own keys from the EmailJS dashboard.
const emailPublicKey = "YOUR_EMAILJS_PUBLIC_KEY";
const emailServiceId = "YOUR_EMAILJS_SERVICE_ID";
const emailTemplateId = "YOUR_EMAILJS_TEMPLATE_ID";
const fallbackEmail = "gebawak@gmail.com"; // mailto fallback target

const emailConfigured = ![
  emailPublicKey,
  emailServiceId,
  emailTemplateId,
].some((v) => typeof v === "string" && v.startsWith("YOUR_"));

document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.getElementById("nav-menu");

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (navMenu.classList.contains("open")) {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
});

const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");

// If EmailJS script failed to load, prevent errors and surface a message.
const emailJsAvailable = typeof emailjs !== "undefined";

if (emailJsAvailable && emailConfigured) {
  emailjs.init(emailPublicKey);
} else {
  statusEl.textContent = "Email not configured yet. Using email fallback.";
}

const sendMailtoFallback = () => {
  const name = form.user_name.value.trim();
  const email = form.user_email.value.trim();
  const message = form.message.value.trim();
  const subject = `Portfolio contact from ${name || "Visitor"}`;
  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const mailto = `mailto:${fallbackEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  statusEl.textContent = "Opening your email app...";
  window.location.href = mailto;
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!emailJsAvailable || !emailConfigured) {
    sendMailtoFallback();
    return;
  }

  statusEl.textContent = "Sending...";

  emailjs
    .sendForm(emailServiceId, emailTemplateId, form)
    .then(() => {
      statusEl.textContent = "Message sent! I’ll reply soon.";
      form.reset();
    })
    .catch((error) => {
      console.error(error);
      statusEl.textContent = "Could not send. Please try again or email me directly.";
    });
});
