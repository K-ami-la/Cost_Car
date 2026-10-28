// =====================================================
// 1. LES DONNÉES : la liste des modèles
// =====================================================
// Consommations indicatives (à remplacer plus tard par les données officielles de l'ADEME).
// "photo" : le fichier à mettre dans le dossier images/
// "credit" : l'auteur de la photo sur Wikimedia Commons (à remplir quand tu ajoutes la photo)
const modeles = [
  { nom: "Personnalisé (je remplis moi-même)", forme: "compacte", couleur: "#94a3b8" },
  { nom: "Renault Clio",    type: "essence",    conso: 5.5,  forme: "compacte", couleur: "#dc2626", photo: "images/clio.jpg",    credit: "" },
  { nom: "Peugeot 208",     type: "essence",    conso: 5.6,  forme: "citadine", couleur: "#eab308", photo: "images/208.jpg",     credit: "" },
  { nom: "Dacia Sandero",   type: "essence",    conso: 5.7,  forme: "compacte", couleur: "#ea580c", photo: "images/sandero.jpg", credit: "" },
  { nom: "Toyota Yaris",    type: "essence",    conso: 4.0,  forme: "citadine", couleur: "#0d9488", photo: "images/yaris.jpg",   credit: "" },
  { nom: "Volkswagen Golf", type: "diesel",     conso: 4.6,  forme: "compacte", couleur: "#2563eb", photo: "images/golf.jpg",    credit: "" },
  { nom: "Peugeot 308",     type: "diesel",     conso: 4.8,  forme: "compacte", couleur: "#475569", photo: "images/308.jpg",     credit: "" },
  { nom: "Renault Zoé",     type: "electrique", conso: 17.5, forme: "citadine", couleur: "#38bdf8", photo: "images/zoe.jpg",     credit: "" },
  { nom: "Peugeot e-208",   type: "electrique", conso: 15.5, forme: "citadine", couleur: "#16a34a", photo: "images/e208.jpg",    credit: "" },
  { nom: "Dacia Spring",    type: "electrique", conso: 14.0, forme: "citadine", couleur: "#7c3aed", photo: "images/spring.jpg",  credit: "" },
  { nom: "Tesla Model 3",   type: "electrique", conso: 14.5, forme: "berline",  couleur: "#111827", photo: "images/model3.jpg",  credit: "" }
];

// =====================================================
// DESSINS DES VOITURES (en SVG, faits maison)
// =====================================================
// Chaque forme : la carrosserie, les vitres, la position des roues, des phares et des feux.
const formes = {
  citadine: {
    caisse: "M38 90 L38 50 Q38 34 54 33 L136 32 Q147 32 155 40 L176 58 Q200 60 206 70 L206 90 Z",
    vitres: ["M50 40 Q50 38 54 38 L98 38 L98 58 L50 58 Z", "M104 38 L134 38 Q143 38 149 44 L163 58 L104 58 Z"],
    roues: [72, 176], phare: [196, 66], feu: [38, 48], porte: 101
  },
  compacte: {
    caisse: "M28 90 L28 64 Q30 54 42 52 L62 50 L84 34 Q90 30 100 30 L150 30 Q160 30 168 38 L188 56 Q212 58 216 70 L216 90 Z",
    vitres: ["M70 52 L88 38 Q92 35 98 35 L126 35 L126 52 Z", "M132 35 L148 35 Q156 35 162 41 L176 52 L132 52 Z"],
    roues: [64, 186], phare: [206, 66], feu: [28, 58], porte: 129
  },
  berline: {
    caisse: "M16 90 L16 64 Q16 56 28 56 L62 56 L84 34 Q90 31 100 31 L148 31 Q158 31 166 39 L184 56 Q214 58 222 68 L222 90 Z",
    vitres: ["M70 54 L88 38 Q91 36 96 36 L124 36 L124 54 Z", "M130 36 L150 36 Q156 36 162 42 L174 54 L130 54 Z"],
    roues: [56, 186], phare: [212, 64], feu: [16, 60], porte: 127
  }
};

function dessinVoiture(modele) {
  const f = formes[modele.forme] || formes.compacte;
  const roue = (x) => `
    <circle cx="${x}" cy="90" r="17" fill="#0f172a"/>
    <circle cx="${x}" cy="90" r="9" fill="#cbd5e1"/>
    <circle cx="${x}" cy="90" r="3" fill="#64748b"/>`;
  return `
    <svg viewBox="0 0 240 120" class="dessin" overflow="visible" aria-hidden="true">
      <rect x="-200" y="104" width="640" height="40" fill="#94a3b8" opacity="0.35"/>
      <ellipse cx="122" cy="106" rx="100" ry="5" fill="#0f172a" opacity="0.18"/>
      <path d="${f.caisse}" fill="${modele.couleur}"/>
      <path d="${f.caisse}" fill="url(#reflet)"/>
      ${f.vitres.map((v) => `<path d="${v}" fill="#1e293b" opacity="0.85"/>`).join("")}
      <line x1="${f.porte}" y1="60" x2="${f.porte}" y2="86" stroke="#0f172a" stroke-opacity="0.25" stroke-width="1.5"/>
      <rect x="${f.phare[0]}" y="${f.phare[1]}" width="10" height="5" rx="2" fill="#fde68a"/>
      <rect x="${f.feu[0]}" y="${f.feu[1]}" width="5" height="9" rx="2" fill="#ef4444"/>
      ${f.roues.map(roue).join("")}
      <defs>
        <linearGradient id="reflet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/>
          <stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/>
          <stop offset="1" stop-color="#000000" stop-opacity="0.15"/>
        </linearGradient>
      </defs>
    </svg>`;
}

const icones = { essence: "⛽ Essence", diesel: "🛢️ Diesel", electrique: "⚡ Électrique" };
const unites = { essence: "L", diesel: "L", electrique: "kWh" };
const prixParDefaut = { essence: 1.80, diesel: 1.70, electrique: 0.25 }; // valeurs indicatives

// =====================================================
// 2. PETITS OUTILS
// =====================================================
function el(id) {
  return document.getElementById(id);
}

function lire(id) {
  return Number(el(id).value);
}

const euros = (n) => Math.round(n).toLocaleString("fr-FR") + " €";

// Rassemble toutes les infos d'une voiture ("A" ou "B")
function lireVoiture(lettre) {
  const modele = modeles[el("modele" + lettre).value];
  return {
    nom: modele.type ? modele.nom : "Voiture " + lettre,
    prix: lire("prix" + lettre),
    conso: lire("conso" + lettre),
    energie: lire("energie" + lettre)
  };
}

// Coût de l'énergie sur une année
function coutAnnuel(voiture, km) {
  return (voiture.conso / 100) * voiture.energie * km;
}

// Coût total après un certain nombre d'années
function coutTotal(voiture, km, annees) {
  return voiture.prix + coutAnnuel(voiture, km) * annees;
}

// =====================================================
// 3. QUAND ON CHANGE DE MODÈLE OU DE TYPE
// =====================================================
function remplirListe(lettre) {
  const liste = el("modele" + lettre);
  modeles.forEach((modele, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = modele.nom;
    liste.appendChild(option);
  });
}

// Met à jour l'icône et les unités (L ou kWh) selon le type
function afficherType(lettre) {
  const type = el("type" + lettre).value;
  el("icone" + lettre).textContent = icones[type];
  el("icone" + lettre).className = "badge-type " + type;
  el("unite" + lettre).textContent = unites[type];
  el("unite2" + lettre).textContent = unites[type];
}

// Affiche la photo du modèle, ou un dessin si la photo n'existe pas
function afficherPhoto(lettre, modele) {
  const img = el("photo" + lettre);
  const vide = el("vide" + lettre);
  const credit = el("credit" + lettre);

  vide.innerHTML = dessinVoiture(modele);
  credit.textContent = modele.credit ? "Photo : " + modele.credit + " / Wikimedia Commons" : "";

  if (!modele.photo) {
    img.style.display = "none";
    vide.style.display = "flex";
    return;
  }
  img.onload = () => { img.style.display = "block"; vide.style.display = "none"; };
  img.onerror = () => { img.style.display = "none"; vide.style.display = "flex"; };
  img.alt = modele.nom;
  img.src = modele.photo;
}

function changerModele(lettre) {
  const modele = modeles[el("modele" + lettre).value];
  if (modele.type) {
    el("type" + lettre).value = modele.type;
    el("conso" + lettre).value = modele.conso;
    el("energie" + lettre).value = prixParDefaut[modele.type];
  }
  afficherType(lettre);
  afficherPhoto(lettre, modele);
  calculer();
}

function changerType(lettre) {
  const type = el("type" + lettre).value;
  el("energie" + lettre).value = prixParDefaut[type];
  afficherType(lettre);
  calculer();
}

// =====================================================
// 4. LE CALCUL ET L'AFFICHAGE DU RÉSULTAT
// =====================================================
function calculer() {
  const km = lire("km");
  const annees = lire("annees");
  const A = lireVoiture("A");
  const B = lireVoiture("B");

  const totalA = coutTotal(A, km, annees);
  const totalB = coutTotal(B, km, annees);
  const ecart = Math.abs(totalA - totalB);

  // Qui gagne ?
  let titre;
  if (Math.round(ecart) === 0) {
    titre = "Les deux voitures coûtent pareil";
  } else {
    const gagnante = totalA < totalB ? A : B;
    titre = `${gagnante.nom} est moins chère de <strong>${euros(ecart)}</strong> sur ${annees} ans`;
  }

  // Au bout de combien d'années les coûts s'égalisent ?
  let croisement = "";
  const t = (B.prix - A.prix) / (coutAnnuel(A, km) - coutAnnuel(B, km));
  if (isFinite(t) && t > 0) {
    croisement = `Les deux coûts s'égalisent après environ <strong>${t.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} ans</strong>.`;
  }

  el("resultat").innerHTML = `
    <p class="titre-resultat">🏆 ${titre}</p>
    <div class="chiffres">
      <div><span>${A.nom}</span><strong>${euros(totalA)}</strong></div>
      <div><span>${B.nom}</span><strong>${euros(totalB)}</strong></div>
    </div>
    <p class="croisement">${croisement}</p>
  `;

  // Badge sur la voiture gagnante
  el("carteA").classList.toggle("gagnante", Math.round(ecart) > 0 && totalA < totalB);
  el("carteB").classList.toggle("gagnante", Math.round(ecart) > 0 && totalB < totalA);

  dessinerGraphique(A, B, km, annees);
}

// =====================================================
// 5. LE GRAPHIQUE
// =====================================================
let graphique = null;

function dessinerGraphique(A, B, km, annees) {
  if (!window.Chart) return; // Chart.js pas chargé (pas d'Internet ?)

  const labels = [];
  const coutsA = [];
  const coutsB = [];
  for (let an = 0; an <= annees; an++) {
    labels.push("Année " + an);
    coutsA.push(Math.round(coutTotal(A, km, an)));
    coutsB.push(Math.round(coutTotal(B, km, an)));
  }

  if (graphique) graphique.destroy();

  graphique = new Chart(el("graphique"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        { label: A.nom, data: coutsA, borderColor: "#2563eb", backgroundColor: "#2563eb", tension: 0.2 },
        { label: B.nom, data: coutsB, borderColor: "#16a34a", backgroundColor: "#16a34a", tension: 0.2 }
      ]
    },
    options: {
      animation: false,
      locale: "fr-FR",
      scales: { y: { title: { display: true, text: "Coût total (€)" } } }
    }
  });
}

// =====================================================
// 6. AU DÉMARRAGE DE LA PAGE
// =====================================================
["A", "B"].forEach((lettre) => {
  remplirListe(lettre);
  el("modele" + lettre).addEventListener("change", () => changerModele(lettre));
  el("type" + lettre).addEventListener("change", () => changerType(lettre));
});

// Voitures choisies au départ : Clio contre Zoé
el("modeleA").value = 1;
el("modeleB").value = 7;
changerModele("A");
changerModele("B");

// Recalcule dès qu'on modifie une case (plus besoin de bouton !)
document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", calculer);
});
