document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Menú móvil ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var mainNav   = document.getElementById("main-nav");

  function closeNav() {
    mainNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.classList.remove("is-active");
  }

  function openNav() {
    mainNav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.classList.add("is-active");
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      mainNav.classList.contains("is-open") ? closeNav() : openNav();
    });

    // Cierra al hacer clic en un enlace
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    // Cierra al hacer scroll hacia abajo
    var lastScrollY = window.scrollY;
    window.addEventListener("scroll", function () {
      if (window.scrollY > lastScrollY + 10) closeNav();
      lastScrollY = window.scrollY;
    }, { passive: true });
  }

  /* ---------- Header: sombra al hacer scroll ---------- */
  var header = document.querySelector(".site-header");

  window.addEventListener("scroll", function () {
    if (header) {
      header.style.boxShadow = window.scrollY > 8
        ? "0 2px 12px rgba(13,31,38,0.10)"
        : "none";
    }
  }, { passive: true });

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    ".section-head, .service-block, .col-content, .col-label, .clients-group, .vendii-card"
  );

  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Formulario de contacto ---------- */
  var form   = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  if (form && status) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nombre  = form.nombre.value.trim();
      var correo  = form.correo.value.trim();
      var mensaje = form.mensaje.value.trim();
      var empresa = form.empresa.value.trim();

      if (!nombre || !correo || !mensaje) {
        status.textContent = "Por favor complete los campos obligatorios.";
        return;
      }

      var asunto = encodeURIComponent("Contacto desde el sitio web — " + nombre);
      var cuerpo = encodeURIComponent(
        "Nombre: " + nombre + "\n" +
        "Correo: " + correo + "\n" +
        "Empresa: " + (empresa || "No especificada") + "\n\n" +
        "Mensaje:\n" + mensaje
      );

      window.location.href =
        "mailto:contacto@tyaconsultoresca.com?subject=" + asunto + "&body=" + cuerpo;

      status.textContent = "Abriendo su cliente de correo...";
    });
  }

});