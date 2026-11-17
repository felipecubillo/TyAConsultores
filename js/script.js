
/* =========================================================
   GF DIGITAL — SCRIPT PRINCIPAL
   Menú, navegación, animaciones y formulario
   ========================================================= */

(function () {
  "use strict";

  /* =======================================================
     CONFIGURACIÓN
     ======================================================= */

  // Reemplazá este correo por el correo real de contacto.
  var EMAIL_CONTACTO = "tucorreo@email.com";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;


  /* =======================================================
     1. MENÚ MÓVIL
     ======================================================= */

  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");

  function abrirMenu() {
    if (!burger || !nav) {
      return;
    }

    nav.classList.add("is-open");
    burger.classList.add("is-active");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Cerrar menú");
  }

  function cerrarMenu() {
    if (!burger || !nav) {
      return;
    }

    nav.classList.remove("is-open");
    burger.classList.remove("is-active");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Abrir menú");
  }

  if (burger && nav) {
    burger.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) {
        cerrarMenu();
      } else {
        abrirMenu();
      }
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        cerrarMenu();
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        cerrarMenu();
      }
    });

    document.addEventListener("click", function (event) {
      if (
        nav.classList.contains("is-open") &&
        !nav.contains(event.target) &&
        !burger.contains(event.target)
      ) {
        cerrarMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        cerrarMenu();
      }
    });
  }


  /* =======================================================
     2. AÑO AUTOMÁTICO DEL FOOTER
     ======================================================= */

  var currentYear = document.getElementById("current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  /* =======================================================
     3. HEADER: EFECTO AL DESPLAZARSE
     ======================================================= */

  var header = document.querySelector(".header");

  function actualizarHeader() {
    if (!header) {
      return;
    }

    if (window.scrollY > 10) {
      header.style.boxShadow = "0 8px 28px rgba(0, 0, 0, 0.28)";
      header.style.background = "rgba(10, 10, 15, 0.96)";
    } else {
      header.style.boxShadow = "none";
      header.style.background = "rgba(10, 10, 15, 0.88)";
    }
  }

  window.addEventListener("scroll", actualizarHeader, {
    passive: true
  });

  actualizarHeader();


  /* =======================================================
     4. NAVEGACIÓN ACTIVA
     ======================================================= */

  var navLinks = document.querySelectorAll(".nav a[href^='#']");
  var navSections = [];

  navLinks.forEach(function (link) {
    var href = link.getAttribute("href");

    if (!href || href.length < 2) {
      return;
    }

    var section = document.getElementById(href.substring(1));

    if (section) {
      navSections.push({
        link: link,
        section: section
      });
    }
  });

  function actualizarNavegacion() {
    var position = window.scrollY + 150;
    var current = null;

    navSections.forEach(function (item) {
      if (item.section.offsetTop <= position) {
        current = item;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove("nav-active");
    });

    if (current) {
      current.link.classList.add("nav-active");
    }
  }

  window.addEventListener("scroll", actualizarNavegacion, {
    passive: true
  });

  actualizarNavegacion();


  /* =======================================================
     5. DESPLAZAMIENTO SUAVE
     ======================================================= */

  function desplazarseA(elemento) {
    if (!elemento) {
      return;
    }

    var headerHeight = header ? header.offsetHeight : 0;
    var margen = 16;

    var top =
      elemento.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      margen;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: reduceMotion ? "auto" : "smooth"
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      var href = anchor.getAttribute("href");

      if (!href || href === "#") {
        event.preventDefault();

        window.scrollTo({
          top: 0,
          behavior: reduceMotion ? "auto" : "smooth"
        });

        return;
      }

      var target = document.querySelector(href);

      if (!target) {
        return;
      }

      event.preventDefault();
      desplazarseA(target);
    });
  });


  /* =======================================================
     6. BOTÓN VOLVER ARRIBA
     ======================================================= */

  var backTop = document.getElementById("back-top");

  if (backTop) {
    backTop.addEventListener("click", function (event) {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });
  }


  /* =======================================================
     7. CANVAS: PARTÍCULAS DEL HERO
     ======================================================= */

  var canvas = document.getElementById("hero-canvas");

  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext("2d");

    if (ctx) {
      var particles = [];
      var particleCount = window.innerWidth <= 768 ? 30 : 55;
      var animationFrame = null;
      var canvasWidth = 0;
      var canvasHeight = 0;

      function ajustarCanvas() {
        var rect = canvas.getBoundingClientRect();
        var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        canvasWidth = rect.width;
        canvasHeight = rect.height;

        canvas.width = Math.floor(canvasWidth * pixelRatio);
        canvas.height = Math.floor(canvasHeight * pixelRatio);

        ctx.setTransform(
          pixelRatio,
          0,
          0,
          pixelRatio,
          0,
          0
        );
      }

      function crearParticula() {
        return {
          x: Math.random() * canvasWidth,
          y: Math.random() * canvasHeight,
          radius: Math.random() * 1.3 + 0.4,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          alpha: Math.random() * 0.35 + 0.12
        };
      }

      function iniciarParticulas() {
        particles = [];

        for (var i = 0; i < particleCount; i++) {
          particles.push(crearParticula());
        }
      }

      function dibujarParticulas() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        for (var i = 0; i < particles.length; i++) {
          var particle = particles[i];

          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < 0 || particle.x > canvasWidth) {
            particle.vx *= -1;
          }

          if (particle.y < 0 || particle.y > canvasHeight) {
            particle.vy *= -1;
          }

          ctx.beginPath();

          ctx.arc(
            particle.x,
            particle.y,
            particle.radius,
            0,
            Math.PI * 2
          );

          ctx.fillStyle =
            "rgba(108, 99, 255, " + particle.alpha + ")";

          ctx.fill();
        }

        var maxDistance = window.innerWidth <= 768 ? 75 : 110;

        for (var a = 0; a < particles.length; a++) {
          for (var b = a + 1; b < particles.length; b++) {
            var dx = particles[a].x - particles[b].x;
            var dy = particles[a].y - particles[b].y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
              var opacity =
                0.075 * (1 - distance / maxDistance);

              ctx.beginPath();
              ctx.moveTo(particles[a].x, particles[a].y);
              ctx.lineTo(particles[b].x, particles[b].y);

              ctx.strokeStyle =
                "rgba(108, 99, 255, " + opacity + ")";

              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }

        animationFrame = window.requestAnimationFrame(
          dibujarParticulas
        );
      }

      function reiniciarCanvas() {
        ajustarCanvas();
        iniciarParticulas();
      }

      reiniciarCanvas();
      dibujarParticulas();

      window.addEventListener("resize", function () {
        particleCount = window.innerWidth <= 768 ? 30 : 55;
        reiniciarCanvas();
      }, {
        passive: true
      });

      document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
          if (animationFrame !== null) {
            window.cancelAnimationFrame(animationFrame);
            animationFrame = null;
          }
        } else if (animationFrame === null) {
          dibujarParticulas();
        }
      });
    }
  }


  /* =======================================================
     8. CONTADOR ANIMADO DEL HERO
     ======================================================= */

  var countElements = document.querySelectorAll("[data-count]");

  function animarContador(element) {
    var target = parseInt(element.getAttribute("data-count"), 10);

    if (isNaN(target)) {
      return;
    }

    if (reduceMotion) {
      element.textContent = target;
      return;
    }

    var duration = 1300;
    var startTime = null;

    function actualizarContador(timestamp) {
      if (startTime === null) {
        startTime = timestamp;
      }

      var progress = Math.min(
        (timestamp - startTime) / duration,
        1
      );

      var eased = 1 - Math.pow(1 - progress, 3);

      element.textContent = Math.floor(target * eased);

      if (progress < 1) {
        window.requestAnimationFrame(actualizarContador);
      } else {
        element.textContent = target;
      }
    }

    window.requestAnimationFrame(actualizarContador);
  }

  if ("IntersectionObserver" in window && countElements.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animarContador(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    countElements.forEach(function (element) {
      counterObserver.observe(element);
    });
  } else {
    countElements.forEach(function (element) {
      animarContador(element);
    });
  }


  /* =======================================================
     9. BOTÓN FLOTANTE DE WHATSAPP
     ======================================================= */

  var waFloat = document.getElementById("wa-float");

  if (waFloat) {
    function mostrarWhatsApp() {
      if (window.scrollY > 250) {
        waFloat.classList.add("visible");
      } else {
        waFloat.classList.remove("visible");
      }
    }

    window.addEventListener("scroll", mostrarWhatsApp, {
      passive: true
    });

    mostrarWhatsApp();
  }


  /* =======================================================
     10. ANIMACIONES DE ENTRADA
     ======================================================= */

  var revealElements = document.querySelectorAll(
    ".service-card, .step, .portfolio-item, .price-card, " +
    ".section-title, .section-sub, .contact-info, .contact-form"
  );

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach(function (element) {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
  } else {
    revealElements.forEach(function (element) {
      element.style.opacity = "0";
      element.style.transform = "translateY(18px)";
      element.style.transition =
        "opacity 500ms ease, transform 500ms ease";
    });

    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -25px 0px"
      }
    );

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  }


  /* =======================================================
     11. FORMULARIO: VALIDACIÓN
     ======================================================= */

  var form = document.getElementById("contact-form");
  var submitButton = document.getElementById("btn-submit");
  var statusElement = document.getElementById("form-status");

  var fields = {
    nombre: {
      element: document.getElementById("nombre"),
      error: document.getElementById("err-nombre"),
      message: "Por favor, escribí tu nombre."
    },
    correo: {
      element: document.getElementById("correo"),
      error: document.getElementById("err-correo"),
      message: "Ingresá un correo electrónico válido."
    },
    mensaje: {
      element: document.getElementById("mensaje"),
      error: document.getElementById("err-mensaje"),
      message: "Escribí un mensaje antes de continuar."
    }
  };

  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function limpiarError(field) {
    if (!field.element) {
      return;
    }

    if (field.error) {
      field.error.textContent = "";
    }

    field.element.removeAttribute("aria-invalid");
  }

  function mostrarError(field, message) {
    if (!field.element) {
      return;
    }

    if (field.error) {
      field.error.textContent = message || field.message;
    }

    field.element.setAttribute("aria-invalid", "true");
  }

  function validarCampo(key) {
    var field = fields[key];

    if (!field || !field.element) {
      return true;
    }

    var value = field.element.value.trim();

    if (!value) {
      mostrarError(field);
      return false;
    }

    if (key === "correo" && !validarEmail(value)) {
      mostrarError(field, "Ingresá un correo electrónico válido.");
      return false;
    }

    limpiarError(field);
    return true;
  }

  Object.keys(fields).forEach(function (key) {
    var field = fields[key];

    if (!field.element) {
      return;
    }

    field.element.addEventListener("blur", function () {
      validarCampo(key);
    });

    field.element.addEventListener("input", function () {
      if (
        field.error &&
        field.error.textContent.trim() !== ""
      ) {
        validarCampo(key);
      }

      if (statusElement) {
        statusElement.textContent = "";
      }
    });
  });


  /* =======================================================
     12. FORMULARIO: PREPARAR CORREO
     ======================================================= */

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var valid = true;

      Object.keys(fields).forEach(function (key) {
        if (!validarCampo(key)) {
          valid = false;
        }
      });

      if (!valid) {
        if (statusElement) {
          statusElement.textContent =
            "Revisá los campos marcados antes de continuar.";

          statusElement.style.color = "#FF6B6B";
        }

        var firstInvalid = form.querySelector(
          '[aria-invalid="true"]'
        );

        if (firstInvalid) {
          firstInvalid.focus();
        }

        return;
      }

      if (
        !EMAIL_CONTACTO ||
        EMAIL_CONTACTO === "tucorreo@email.com"
      ) {
        if (statusElement) {
          statusElement.textContent =
            "Configurá EMAIL_CONTACTO en script.js con tu correo real.";

          statusElement.style.color = "#FF6B6B";
        }

        return;
      }

      var nombre = fields.nombre.element.value.trim();
      var correo = fields.correo.element.value.trim();
      var mensaje = fields.mensaje.element.value.trim();

      var servicioElement = document.getElementById("servicio");
      var servicio = servicioElement
        ? servicioElement.value
        : "";

      var subject = encodeURIComponent(
        "Consulta desde GF Digital — " + nombre
      );

      var body = encodeURIComponent(
        "Nombre: " + nombre + "\n" +
        "Correo: " + correo + "\n" +
        "Servicio: " + (servicio || "No especificado") + "\n\n" +
        "Mensaje:\n" + mensaje
      );

      var mailtoUrl =
        "mailto:" + EMAIL_CONTACTO +
        "?subject=" + subject +
        "&body=" + body;

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Abriendo correo...";
      }

      if (statusElement) {
        statusElement.textContent =
          "Intentando abrir tu aplicación de correo...";

        statusElement.style.color = "";
      }

      // Abre la aplicación de correo del visitante.
      window.location.href = mailtoUrl;

      window.setTimeout(function () {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Enviar mensaje";
        }

        if (statusElement) {
          statusElement.textContent =
            "Si no se abrió tu correo, revisá la configuración de tu dispositivo.";
        }
      }, 1800);
    });
  }

})();
