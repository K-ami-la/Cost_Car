// Calcule le coût total d'une voiture : prix d'achat + énergie consommée
function coutTotal(prix, conso, prixEnergie, km, annees) {
  const coutParKm = (conso / 100) * prixEnergie;
  return prix + coutParKm * km * annees;
}

// Lit la valeur d'une case du formulaire et la transforme en nombre
function lire(id) {
  return Number(document.getElementById(id).value);
}

// Ce qui se passe quand on clique sur "Calculer"
document.getElementById("calculer").addEventListener("click", () => {
  const km = lire("km");
  const annees = lire("annees");

  const totalA = coutTotal(lire("prixA"), lire("consoA"), lire("energieA"), km, annees);
  const totalB = coutTotal(lire("prixB"), lire("consoB"), lire("energieB"), km, annees);

  const gagnante = totalA < totalB ? "A" : "B";
  const ecart = Math.abs(totalA - totalB);
  const euros = (n) => Math.round(n).toLocaleString("fr-FR") + " €";

  document.getElementById("resultat").textContent =
    `Voiture A : ${euros(totalA)} · Voiture B : ${euros(totalB)} → ` +
    `la voiture ${gagnante} est moins chère de ${euros(ecart)} sur ${annees} ans.`;

  dessinerGraphique(km, annees);
});

let graphique = null;

  // 🆕 Met le badge "Moins chère" sur la voiture gagnante
  document.getElementById("carteA").classList.toggle("gagnante", gagnante === "A");
  document.getElementById("carteB").classList.toggle("gagnante", gagnante === "B");

// Dessine l'évolution du coût de chaque voiture, année par année
function dessinerGraphique(km, annees) {
  const labels = [];
  const coutsA = [];
  const coutsB = [];

  for (let an = 0; an <= annees; an++) {
    labels.push("Année " + an);
    coutsA.push(Math.round(coutTotal(lire("prixA"), lire("consoA"), lire("energieA"), km, an)));
    coutsB.push(Math.round(coutTotal(lire("prixB"), lire("consoB"), lire("energieB"), km, an)));
  }

  // Efface l'ancien graphique avant d'en dessiner un nouveau
  if (graphique) graphique.destroy();

  graphique = new Chart(document.getElementById("graphique"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        { label: "Voiture A", data: coutsA, borderColor: "#2563eb" },
        { label: "Voiture B", data: coutsB, borderColor: "#16a34a" }
      ]
    },
    options: {
      scales: { y: { title: { display: true, text: "Coût total (€)" } } }
    }
  });


  // 🆕 Icône et prix de l'énergie selon le type de voiture
const icones = { essence: "⛽", diesel: "🛢️", electrique: "⚡" };
const prixParDefaut = { essence: 1.80, diesel: 1.70, electrique: 0.25 }; // valeurs indicatives

function changerType(lettre) {
  const type = document.getElementById("type" + lettre).value;
  document.getElementById("icone" + lettre).textContent = icones[type];
  document.getElementById("energie" + lettre).value = prixParDefaut[type];
}

document.getElementById("typeA").addEventListener("change", () => changerType("A"));
document.getElementById("typeB").addEventListener("change", () => changerType("B"));
}