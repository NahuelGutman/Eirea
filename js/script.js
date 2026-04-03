// Scrol Mobile

const nav = document.querySelector(".navbar");
const toggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

const isCatalogo = document.body.classList.contains("catalogo-page");

window.addEventListener("scroll", () => {

  if (isCatalogo) {
    // catálogo SIEMPRE blanco
    nav.style.background = "white";
    nav.style.color = "black";
    return;
  }

  //  home normal
  if (window.scrollY > 50) {
    nav.style.background = "white";
    nav.style.color = "black";
  } else {
    nav.style.background = "transparent";
    nav.style.color = "white";
  }
});

if (toggle) {
  toggle.onclick = () => {
    navLinks.classList.toggle("active");
  };
}

// Catalogo

const catalogo = document.getElementById("catalogo");

if (catalogo) {
  fetch("data/productos.json")
    .then(res => res.json())
    .then(productos => {

      productos.forEach(prod => {
        let index = 0;

        const card = document.createElement("div");
        card.classList.add("producto");

        const coloresHTML = prod.colores
          .map(c => `<div class="color" style="background:${c}"></div>`)
          .join("");

        const primeraImagen = prod.imagenes?.[0] || "assets/placeholder.png";

        card.innerHTML = `
        <div class="carousel">
            <img src="${primeraImagen}" alt= "${prod.nombre}" loading="lazy" draggable="false">

            ${prod.imagenes.length > 1 ? `
                <button class="nav prev"><span>‹</span></button>
                <button class="nav next"><span>›</span></button>

                <div class="dots">
                    ${prod.imagenes.map((_, i) => `
                        <span class="dot ${i === 0 ? "active" : ""}" data-index="${i}"></span>
                    `).join("")}
                </div>
            ` : ""}
        </div>

        <div class="info">
            <h3>${prod.nombre}</h3>
            <p class="precio">$${prod.precio}</p>
            <p class="extra">${prod.material || ""}</p>
            <div class="colores">${coloresHTML}</div>

            <button class="whatsapp">
                <img src="assets/icons/whatsapp.ico">
                Consultar
            </button>
        </div>
        `;

        const img = card.querySelector("img");
        const prev = card.querySelector(".prev");
        const next = card.querySelector(".next");
        const carousel = card.querySelector(".carousel");

        // Carrousel

        if (prod.imagenes.length > 1) {

          const dots = card.querySelectorAll(".dot");

          const updateDots = () => {
            dots.forEach(dot => dot.classList.remove("active"));
            if (dots[index]) dots[index].classList.add("active");
          };

          const updateImage = () => {
            img.style.opacity = "0";

            setTimeout(() => {
              img.src = prod.imagenes[index];
              img.style.opacity = "1";
              updateDots();
            }, 150);
          };

          prev.onclick = () => {
            index = (index - 1 + prod.imagenes.length) % prod.imagenes.length;
            updateImage();
          };

          next.onclick = () => {
            index = (index + 1) % prod.imagenes.length;
            updateImage();
          };

          dots.forEach(dot => {
            dot.onclick = () => {
              index = parseInt(dot.dataset.index);
              updateImage();
            };
          });

          // Swipe

          let startX = 0;
          let endX = 0;

          carousel.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
          });

          carousel.addEventListener("touchmove", (e) => {
            endX = e.touches[0].clientX;
          });

          carousel.addEventListener("touchend", () => {
            let diff = startX - endX;

            if (Math.abs(diff) > 50) {
              if (diff > 0) {
                index = (index + 1) % prod.imagenes.length;
              } else {
                index = (index - 1 + prod.imagenes.length) % prod.imagenes.length;
              }
              updateImage();
            }
          });
        }

        //Zoom

        carousel.addEventListener("mousemove", (e) => {
          const rect = carousel.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;

          img.style.transformOrigin = `${x}% ${y}%`;
          img.style.transform = "scale(1.8)";
        });

        carousel.addEventListener("mouseleave", () => {
          img.style.transform = "scale(1)";
          img.style.transformOrigin = "center";
        });

        // Contactos

        card.querySelector(".whatsapp").onclick = () => {
          const mensaje = `Hola! Estoy interesado en ${prod.nombre} (Cod. ${prod.codigo})`;
          const url = `https://wa.me/5492954300445?text=${encodeURIComponent(mensaje)}`;
          window.open(url, "_blank");
        };

        catalogo.appendChild(card);
      });

    })
    .catch(err => {
      console.error("Error cargando productos:", err);
    });
}

// ScrolAnimation

const faders = document.querySelectorAll(".fade-in");

const appearOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.2 });

faders.forEach(el => appearOnScroll.observe(el));

// Modal

const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const closeModal = document.querySelector(".close-modal");

if (modal && modalImg && closeModal) {

  document.addEventListener("click", (e) => {
    if (e.target.closest(".carousel img")) {
      modal.classList.add("active");
      modalImg.src = e.target.src;
    }
  });

  closeModal.onclick = () => {
    modal.classList.remove("active");
  };

  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  };
}

//BackTop

const backToTop = document.getElementById("backToTop");

if (backToTop) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  backToTop.onclick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}

// Productos destacados

const destacadosContainer = document.getElementById("destacados");

if (destacadosContainer) {
  fetch("data/productos.json")
    .then(res => res.json())
    .then(productos => {

      // 🔥 filtrar destacados
      const destacados = productos.filter(p => p.destacado);

      destacados.slice(0, 3).forEach(prod => {

        const card = document.createElement("div");
        card.classList.add("producto");

        const imagen = prod.imagenes?.[0] || "assets/placeholder.png";

        card.innerHTML = `
          <div class="carousel">
            <img src="${imagen}" loading="lazy">
          </div>

          <div class="info">
            <h3>${prod.nombre}</h3>
            <p class="precio">$${prod.precio}</p>
          </div>
        `;

        // 🔥 click → ir al catálogo
        card.onclick = () => {
          window.location.href = "catalogo.html";
        };

        destacadosContainer.appendChild(card);
      });

    })
    .catch(err => console.error("Error destacados:", err));
}