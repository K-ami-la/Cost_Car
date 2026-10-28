// =====================================================
// 1. LES DONNÉES : la liste des modèles
// =====================================================
// Consommations indicatives (à remplacer plus tard par les données officielles de l'ADEME).
// "photo" : le fichier à mettre dans le dossier images/
// "credit" : l'auteur de la photo sur Wikimedia Commons (à remplir quand tu ajoutes la photo)
const modeles = [
  { nom: "Personnalisé (je remplis moi-même)" },
  { nom: "Renault Clio",      type: "essence",    conso: 5.5,  photo: "images/clio.jpg",     credit: "" },
  { nom: "Peugeot 208",       type: "essence",    conso: 5.6,  photo: "images/208.jpg",      credit: "" },
  { nom: "Dacia Sandero",     type: "essence",    conso: 5.7,  photo: "images/sandero.jpg",  credit: "" },
  { nom: "Toyota Yaris",      type: "essence",    conso: 4.0,  photo: "images/yaris.jpg",    credit: "" },
  { nom: "Volkswagen Golf",   type: "diesel",     conso: 4.6,  photo: "images/golf.jpg",     credit: "" },
  { nom: "Peugeot 308",       type: "diesel",     conso: 4.8,  photo: "images/308.jpg",      credit: "" },
  { nom: "Renault Zoé",       type: "electrique", conso: 17.5, photo: "images/zoe.jpg",      credit: "" },
  { nom: "Peugeot e-208",     type: "electrique", conso: 15.5, photo: "images/e208.jpg",     credit: "" },
  { nom: "Dacia Spring",      type: "electrique", conso: 14.0, photo: "images/spring.jpg",   credit: "" },
  { nom: "Tesla Model 3",     type: "electrique", conso: 14.5, photo: "images/model3.jpg",   credit: "" }
];

const icones = { essence: "⛽", diesel: "🛢️", electrique: "⚡" };
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
  el("unite" + lettre).textContent = unites[type];
  el("unite2" + lettre).textContent = unites[type];
}

// Affiche la photo du modèle, ou un dessin si la photo n'existe pas
function afficherPhoto(lettre, modele) {
  const img = el("photo" + lettre);
  const vide = el("vide" + lettre);
  const credit = el("credit" + lettre);

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
