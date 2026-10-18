(function () {
  const fotky = Array.from(document.querySelectorAll(".galerie img"));
  if (!fotky.length) return;

  const okno = document.createElement("dialog");
  okno.className = "lightbox";
  okno.setAttribute("aria-label", "Zvětšená fotografie");
  okno.innerHTML =
    '<button class="lb-zavrit" type="button" aria-label="Zavřít">&times;</button>' +
    '<button class="sipka sipka-vlevo" type="button" aria-label="Předchozí fotografie">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>' +
    '</button>' +
    '<button class="sipka sipka-vpravo" type="button" aria-label="Další fotografie">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>' +
    '</button>' +
    '<figure class="lb-figure"><img class="lb-img" alt=""></figure>' +
    '<p class="lb-pocet"></p>';
  document.body.appendChild(okno);

  const velkaFotka = okno.querySelector(".lb-img");
  const pocet = okno.querySelector(".lb-pocet");
  const sipkaVlevo = okno.querySelector(".sipka-vlevo");
  const sipkaVpravo = okno.querySelector(".sipka-vpravo");
  const zavrit = okno.querySelector(".lb-zavrit");

  let skupina = [];
  let index = 0;

  function zobraz() {
    const f = skupina[index];
    velkaFotka.src = f.currentSrc || f.src;
    velkaFotka.alt = f.alt;
    pocet.textContent = skupina.length > 1 ? (index + 1) + " / " + skupina.length : "";
    const vic = skupina.length > 1;
    sipkaVlevo.style.display = vic ? "" : "none";
    sipkaVpravo.style.display = vic ? "" : "none";
  }

  function otevri(fotka) {
    const galerie = fotka.closest(".galerie");
    skupina = Array.from(galerie.querySelectorAll("img"));
    index = skupina.indexOf(fotka);
    zobraz();
    document.body.classList.add("lb-otevreno");
    okno.showModal();
  }

  function dalsi() {
    index = (index + 1) % skupina.length;
    zobraz();
  }

  function predchozi() {
    index = (index - 1 + skupina.length) % skupina.length;
    zobraz();
  }

  fotky.forEach(function (fotka) {
    const policko = fotka.closest("figure") || fotka;
    policko.tabIndex = 0;
    policko.setAttribute("role", "button");
    policko.setAttribute("aria-label", "Zvětšit fotografii");
    policko.addEventListener("click", function () { otevri(fotka); });
    policko.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        otevri(fotka);
      }
    });
  });

  sipkaVpravo.addEventListener("click", dalsi);
  sipkaVlevo.addEventListener("click", predchozi);
  zavrit.addEventListener("click", function () { okno.close(); });

  okno.addEventListener("click", function (e) {
    if (!e.target.closest(".lb-img, .sipka, .lb-zavrit")) okno.close();
  });

  okno.addEventListener("keydown", function (e) {
    if (skupina.length < 2) return;
    if (e.key === "ArrowRight") dalsi();
    if (e.key === "ArrowLeft") predchozi();
  });

  okno.addEventListener("close", function () {
    document.body.classList.remove("lb-otevreno");
  });

  // Přejetí prstem na mobilu
  let x0 = null;
  okno.addEventListener("touchstart", function (e) {
    x0 = e.touches[0].clientX;
  }, { passive: true });
  okno.addEventListener("touchend", function (e) {
    if (x0 === null || skupina.length < 2) return;
    const dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 40) {
      if (dx < 0) dalsi(); else predchozi();
    }
  });
})();
