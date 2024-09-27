"use strict";

window.addEventListener("load", function() {
  var canv = document.getElementById("monCanvas");
  var ctx = canv.getContext("2d");
  var maxx = window.innerWidth - 16;
  var maxy = window.innerHeight - 50;
  var toggle = true; // ordre marche / arrêt
  var togglesync = true; // rdre marche / arrêt exécuté

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //

  function uneFleur() {
    var xRacine, yRacine, hTige, xHaut, yHaut, xP1, yP1, xP2, yP2;

    // racine
    xRacine = Math.floor(maxx * Math.random());
    yRacine = maxy - 1;
    // paramètres de la tige
    // hauteur totale : 40 à 70% de la hauteur du canvas
    hTige = (0.4 + 0.3 * Math.random()) * maxy;
    yHaut = yRacine - hTige;
    // décalage horizontal du haut entre 5 et 15% de la hauteur, côté aléatoire
    let dech = (0.05 + 0.1 * Math.random()) * hTige;
    if (Math.random() > 0.5) dech = -dech;
    xHaut = xRacine + dech;
    // point de contrôle à 5 à 10 degrés de la tige, côté aléatoire, distance 40 à 60 % de hTige
    let thRacine = (5 + 10 * Math.random()) * Math.PI / 180; // pour avoir radians
    let thHaut = (5 + 10 * Math.random()) * Math.PI / 180; // pour avoir radians
    if (Math.random() > 0.5) {
      // pour côté aléatoire
      thRacine = -thRacine;
      thHaut = -thHaut;
    }
    let lRacine = (0.4 + 0.2 * Math.random()) * hTige;
    let lHaut = (0.4 + 0.2 * Math.random()) * hTige;

    let angleTige = Math.atan2(hTige, dech);
    xP1 = xRacine + lRacine * Math.cos(angleTige + thRacine);
    yP1 = yRacine - lRacine * Math.sin(angleTige + thRacine);

    xP2 = xHaut - lHaut * Math.cos(angleTige + thHaut);
    yP2 = yHaut + lRacine * Math.sin(angleTige + thHaut);

    pousseTige();
    return;

    // La fleur


    function pousseTige() {
      /* on va faire pousser la tige d'environ 5 pix / image
  le nombre du pas du tracé va donc être d'environ hTige/5
*/
      function pousseTige1() {
        // fonction qui va être appelée répétitivement

        let t = kPas / nPas;
        let unmt = 1 - t;
        // algorithme de Casteljau à la main
        // entre Racine et P1
        let xP4 = xRacine * unmt + xP1 * t;
        let yP4 = yRacine * unmt + yP1 * t;
        // entre P1 et P2
        let xP5 = xP1 * unmt + xP2 * t;
        let yP5 = yP1 * unmt + yP2 * t;
        // entre P2 et haut
        let xP6 = xP2 * unmt + xHaut * t;
        let yP6 = yP2 * unmt + yHaut * t;

        // entre P4 et P5
        let xP7 = xP4 * unmt + xP5 * t;
        let yP7 = yP4 * unmt + yP5 * t;
        // entre P5 et P6
        let xP8 = xP5 * unmt + xP6 * t;
        let yP8 = yP5 * unmt + yP6 * t;

        // enfin, entre P7 et P8
        let xP = xP7 * unmt + xP8 * t;
        let yP = yP7 * unmt + yP8 * t;

        ctx.beginPath();
        ctx.moveTo(xP, yP);

        // point du pas suivant
        ++kPas;

        t = kPas / nPas;
        unmt = 1 - t;
        // algorithme de Casteljau à la main
        // entre Racine et P1
        xP4 = xRacine * unmt + xP1 * t;
        yP4 = yRacine * unmt + yP1 * t;
        // entre P1 et P2
        xP5 = xP1 * unmt + xP2 * t;
        yP5 = yP1 * unmt + yP2 * t;
        // entre P2 et haut
        xP6 = xP2 * unmt + xHaut * t;
        yP6 = yP2 * unmt + yHaut * t;

        // entre P4 et P5
        xP7 = xP4 * unmt + xP5 * t;
        yP7 = yP4 * unmt + yP5 * t;
        // entre P5 et P6
        xP8 = xP5 * unmt + xP6 * t;
        yP8 = yP5 * unmt + yP6 * t;

        // enfin, entre P7 et P8
        xP = xP7 * unmt + xP8 * t;
        yP = yP7 * unmt + yP8 * t;

        ctx.lineTo(xP, yP);
        ctx.stroke();

        if (kPas >= nPas) {
          pousseFleur();
          return;
        } // terminé, enchaîner sur la fleur
        setTimeout(pousseTige1, 10); // pas terminé, suite de la pousse
      }

      var kPas = 0; // compteur de pas de tracé
      var nPas = Math.round(hTige / 5);

      ctx.lineWidth = 1 + 5 * Math.random();
      let hue = 80 + 80 * Math.random();
      let sat = 80 + 20 * Math.random();
      let lum = 30 + 40 * Math.random();
      //    console.log (`hsl(${hue},100%,50%)`);
      ctx.strokeStyle = `hsl(${hue},${sat}%,${lum}%)`;
      pousseTige1(); // lancement de la fonction de dessin
    } // pousseTige

    function pousseFleur() {
      function pousseFleur1() {
        for (let ncons = 0; ncons < 10; ncons++) {
          let av = kPas / nPas;
          let unmav = 1 - av;
          let r = 1.5 + kPas * 0.5;
          // on découpe le tour pour avoir un nombre entier de pas par pétale
          let npp = Math.round(2 * r / nPetales); // nombre de points par pétale
          /* ce nombre de points est calculé pour que le bord du pétale ne soit pas trop polygonal */

          ctx.beginPath();
          ctx.moveTo(xHaut, yHaut);
          for (let kpet = 0; kpet < nPetales; kpet++) {
            let thPet = thPetale + 2 * Math.PI / nPetales * kpet;

            for (let kdp = 1; kdp <= npp; kdp++) {
              // ne dessine pas le premier point mais dessine le dernier
              let thdp = kdp / npp * Math.PI; // 0 à pi
              let rdp = r * Math.sin(thdp);
              let thp = thPet + 2 * Math.PI / nPetales * kdp / npp;
              ctx.lineTo(
                xHaut + rdp * Math.cos(thp),
                yHaut + rdp * Math.sin(thp)
              );
            } // boucle sur points dans un pétale
          } // boucle sur tous les pétales

          ctx.lineWidth = 1;
          let hue = (h0 * unmav + h1 * av + 160) % 360;
          let sat = s0 * unmav + s1 * av;
          let lum = l0 * unmav + l1 * av;
          ctx.strokeStyle = `hsl(${hue},${sat}%,${lum}%)`;
          ctx.stroke();

          if (++kPas > nPas) {
            enchaine();
            return;
          } // terminé, enchaîner sur la fleur suivante
        } // for ncons;
        setTimeout(pousseFleur1, 10); // pas terminé, suite de la pousse
      } // pousseFleur1

      var rayon = (0.1 + 0.3 * Math.random()) * maxy; // dimension

      // nombre de pétales
      var nPetales = 4 + Math.floor(10 * Math.random());
      // angle du premier pétale
      var thPetale = Math.random() * Math.PI * 2;

      // détermination des couleurs de cœur et de bordure
      // la couleur allant de 0 à 360, on souhaite exclure la plage des verts de 80 à 160 (étendue 80)
      // on choisit aléatoirement dans une plage de 0 à 280, puis on ajoute 160 et on prend le modulo 360
      // le résultat est bien 0..80 + 160..360
      // pour éviter de passer par le vert lors des interpolations, l'interpolation se
      //   fait dans l'étendue 0..280, avant d'ajouter le 160
      // de plus, pour éviter les fleurs arc-en-ciel, on limite l'écart entre les couleurs de début et de fin à 100
      // enfin, la distribution uniforme donne trop de fleurs bleues/rouges - violettes.
      //    On prend une distribution modifiée qui favorise les extrémités de la plage

      var h1 = Math.random() * Math.PI / 2; // bord
      h1 = Math.sin(h1 * h1) * 280;
      var h0 = h1;
      while (true) {
        h0 = Math.random() * 280; // bord
        if (Math.abs(h1 - h0) < 100) break;
      } // recherche couleur pas trop éloignée

      var s0 = 90 + 10 * Math.random();
      var s1 = 90 + 10 * Math.random();

      var l0 = 40 + 20 * Math.random();
      var l1 = 40 + 20 * Math.random();

      /* on va dessiner par rayons croissants de 1.5 à rayon, avec un incrément de 1.5 sur le rayon
*/
      var nPas = Math.round((rayon - 1.5) / 0.5);
      var kPas = 0; // pour compter les pas de dessin

      pousseFleur1(); // on y va
      return;
    } // pousseFleur
  } // uneFleur

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function clickCanvas() {
    toggle = !toggle;
    if (toggle && !togglesync) {
      togglesync = true; // demande prise en compte
      enchaine();
    }
  } // clickCanvas
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // début d'exécution

  canv.width = maxx;
  canv.height = maxy;
  canv.style.backgroundColor = "#FFE";
  canv.addEventListener("click", clickCanvas);

  function enchaine() {
    if (!toggle && togglesync) {
      // demande d'arrêt
      togglesync = false;
      return; // on enregistre demande et on arrête
    }

    uneFleur();
    //    setTimeout(enchaine,200);
  }
  enchaine();
}); // window load listener
