/* =========================================================
   FELIPE — script.js
   ========================================================= */
(function () {
  "use strict";

  /* -------------------------------------------------------
     1. MENÚ MÓVIL con animación hamburguesa
  ------------------------------------------------------- */
  var burger = document.getElementById("burger");
  var nav    = document.getElementById("nav");

  function openMenu() {
    nav.classList.add("is-open");
    burger.classList.add("is-active");
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    nav.classList.remove("is-open");
    burger.classList.remove("is-active");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (burger && nav) {
    burger.addEventListener("click", function () {
      nav.classList.contains("is-open") ? closeMenu() : openMenu();
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Cierra al hacer scroll hacia abajo
    var lastY = window.scrollY;
    window.addEventListener("scroll", function () {
      if (window.scrollY > lastY + 20) closeMenu();
      lastY = window.scrollY;
    }, { passive: true });

    // Cierra con ESC
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* -------------------------------------------------------
     2. BOTÓN VOLVER ARRIBA — "back-top"
  ------------------------------------------------------- */
  var backTop = document.getElementById("back-top");

  if (backTop) {
    backTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* -------------------------------------------------------
     3. HEADER — sombra al hacer scroll
  ------------------------------------------------------- */
  var header = document.querySelector(".header");

  window.addEventListener("scroll", function () {
    if (!header) return;
    header.style.boxShadow = window.scrollY > 10
      ? "0 4px 24px rgba(0,0,0,0.4)"
      : "none";
  }, { passive: true });

  /* -------------------------------------------------------
     4. NAV ACTIVO — resalta el enlace de la sección visible
  ------------------------------------------------------- */
  var navLinks = document.querySelectorAll(".nav a[href^='#']");
  var sections = [];

  navLinks.forEach(function (link) {
    var id  = link.getAttribute("href").slice(1);
    var sec = document.getElementById(id);
    if (sec) sections.push({ link: link, section: sec });
  });

  function updateActiveNav() {
    var scrollY = window.scrollY + 120;
    var active  = null;

    sections.forEach(function (item) {
      if (item.section.offsetTop <= scrollY) active = item;
    });

    navLinks.forEach(function (l) { l.classList.remove("nav-active"); });
    if (active) active.link.classList.add("nav-active");
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  /* -------------------------------------------------------
     5. TABS — Cómo funciona
  ------------------------------------------------------- */
  var tabBtns     = document.querySelectorAll(".tab-btn");
  var tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-tab");

      tabBtns.forEach(function (b) { b.classList.remove("active"); });
      tabContents.forEach(function (c) { c.classList.remove("active"); });

      btn.classList.add("active");
      var content = document.getElementById("tab-" + target);
      if (content) content.classList.add("active");
    });
  });

  /* -------------------------------------------------------
     6. WHATSAPP FLOAT — aparece después de 3 segundos
  ------------------------------------------------------- */
  var waFloat = document.getElementById("wa-float");

  if (waFloat) {
    setTimeout(function () {
      waFloat.classList.add("visible");
    }, 3000);
  }

  /* -------------------------------------------------------
     7. SCROLL REVEAL — entradas suaves al hacer scroll
  ------------------------------------------------------- */
  var revealEls = document.querySelectorAll(
    ".service-card, .step, .portfolio-item, .price-card, .section-title, .section-sub"
  );

  revealEls.forEach(function (el) {
    el.style.opacity    = "0";
    el.style.transform  = "translateY(20px)";
    el.style.transition = "opacity 0.55s ease, transform 0.55s ease";
  });

  if ("IntersectionObserver" in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Delay escalonado para grupos de elementos
          var siblings = Array.from(entry.target.parentElement.children);
          var idx      = siblings.indexOf(entry.target);
          setTimeout(function () {
            entry.target.style.opacity   = "1";
            entry.target.style.transform = "translateY(0)";
          }, idx * 80);
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) {
      el.style.opacity   = "1";
      el.style.transform = "translateY(0)";
    });
  }

  /* -------------------------------------------------------
     8. FORMULARIO DE CONTACTO — validación por campo
  ------------------------------------------------------- */
  var form      = document.getElementById("contact-form");
  var btnSubmit = document.getElementById("btn-submit");
  var statusEl  = document.getElementById("form-status");

  var fields = {
    nombre:  { el: document.getElementById("nombre"),  err: document.getElementById("err-nombre"),  msg: "Por favor ingresá tu nombre." },
    correo:  { el: document.getElementById("correo"),  err: document.getElementById("err-correo"),  msg: "Ingresá un correo válido." },
    mensaje: { el: document.getElementById("mensaje"), err: document.getElementById("err-mensaje"), msg: "Escribí tu mensaje antes de enviar." }
  };

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function clearError(field) {
    field.err.textContent = "";
    field.el.style.borderColor = "";
  }

  function showError(field, msg) {
    field.err.textContent    = msg || field.msg;
    field.el.style.borderColor = "#FF6B6B";
  }

  function validateField(key) {
    var f = fields[key];
    if (!f) return true;
    var val = f.el.value.trim();

    if (!val) { showError(f); return false; }
    if (key === "correo" && !validateEmail(val)) { showError(f, "Ingresá un correo válido."); return false; }
    clearError(f);
    return true;
  }

  // Validación en tiempo real al salir de cada campo
  Object.keys(fields).forEach(function (key) {
    var f = fields[key];
    if (!f.el) return;

    f.el.addEventListener("blur", function () { validateField(key); });
    f.el.addEventListener("input", function () {
      if (f.err.textContent) validateField(key);
    });
  });

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var valid = true;
      Object.keys(fields).forEach(function (key) {
        if (!validateField(key)) valid = false;
      });

      if (!valid) {
        statusEl.textContent = "Por favor corregí los errores antes de enviar.";
        statusEl.style.color = "#FF6B6B";
        return;
      }

      // Deshabilitar botón mientras "envía"
      btnSubmit.disabled    = true;
      btnSubmit.textContent = "Enviando...";
      statusEl.textContent  = "";

      var nombre  = fields.nombre.el.value.trim();
      var correo  = fields.correo.el.value.trim();
      var mensaje = fields.mensaje.el.value.trim();
      var servicio = document.getElementById("servicio")
        ? document.getElementById("servicio").value
        : "";

      var asunto = encodeURIComponent("Contacto desde el sitio — " + nombre);
      var cuerpo = encodeURIComponent(
        "Nombre: "   + nombre  + "\n" +
        "Correo: "   + correo  + "\n" +
        "Servicio: " + (servicio || "No especificado") + "\n\n" +
        "Mensaje:\n" + mensaje
      );

      window.location.href =
        "mailto:tucorreo@email.com?subject=" + asunto + "&body=" + cuerpo;

      setTimeout(function () {
        statusEl.textContent  = "¡Listo! Se abrió tu cliente de correo para enviar el mensaje.";
        statusEl.style.color  = "";
        btnSubmit.disabled    = false;
        btnSubmit.textContent = "Enviar mensaje";
      }, 800);
    });
  }

  /* -------------------------------------------------------
     9. SMOOTH SCROLL con offset para el header fijo
  ------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = anchor.getAttribute("href");
      if (targetId === "#") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var offset = 80;
      var top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

})();