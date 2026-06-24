// =========================================================
// T&A CONSULTORES — script.js
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Menú móvil ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Cierra el menú al elegir una opción (en móvil)
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Header: sombra al hacer scroll ---------- */
  var header = document.querySelector(".site-header");
  var lastScroll = 0;

  window.addEventListener("scroll", function () {
    var current = window.scrollY;
    if (header) {
      header.style.boxShadow = current > 8
        ? "0 1px 0 rgba(11,31,58,0.08)"
        : "none";
    }
    lastScroll = current;
  }, { passive: true });

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    ".section-head, .service-block, .col-content, .col-label, .clients-group"
  );

  revealTargets.forEach(function (el) {
    el.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: sin soporte para IntersectionObserver, mostrar todo
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Formulario de contacto ---------- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  if (form && status) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var nombre = form.nombre.value.trim();
      var correo = form.correo.value.trim();
      var mensaje = form.mensaje.value.trim();

      if (!nombre || !correo || !mensaje) {
        status.textContent = "Por favor complete los campos obligatorios.";
        return;
      }

      // Construye un mailto: como entrega simple sin backend.
      // Si en el futuro se conecta un servicio de envío (Formspree, backend propio, etc.),
      // sustituir este bloque por la llamada correspondiente.
      var empresa = form.empresa.value.trim();
      var asunto = encodeURIComponent("Contacto desde el sitio web — " + nombre);
      var cuerpo = encodeURIComponent(
        "Nombre: " + nombre + "\n" +
        "Correo: " + correo + "\n" +
        "Empresa: " + (empresa || "No especificada") + "\n\n" +
        "Mensaje:\n" + mensaje
      );

      window.location.href = "mailto:contacto@tyaconsultoresca.com?subject=" + asunto + "&body=" + cuerpo;

      status.textContent = "Abriendo su cliente de correo para enviar el mensaje...";
    });
  }

});