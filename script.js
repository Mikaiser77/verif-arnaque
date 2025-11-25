// Liste de mots suspects
const mots_suspects = [
    "urgent", "bloqué", "verifiez", "compte suspendu", "clickez",
    "colis", "douane", "amende", "remboursement", "impots",
    "banque", "sécuriser", "confirmer", "code", "pénalité"
];

// Domaines suspects
const domaines_suspects = [".xyz", ".top", ".click", ".shop", ".win", ".loan"];

function detecter_liens(message) {
    return message.match(/https?:\/\/\S+/gi) || [];
}

function analyser_message(message) {
    let score = 0;
    let raisons = [];
    let msg = message.toLowerCase();

    // Mots suspects
    mots_suspects.forEach(mot => {
        if (msg.includes(mot)) {
            score++;
            raisons.push(`Mot suspect détecté : ${mot}`);
        }
    });

    // Liens
    const liens = detecter_liens(msg);
    if (liens.length > 0) {
        score += 2;
        raisons.push(`Lien détecté : ${liens[0]}`);
        domaines_suspects.forEach(domaine => {
            if (liens[0].includes(domaine)) {
                score += 2;
                raisons.push(`Domaine suspect : ${domaine}`);
            }
        });
    }

    // Numéros
    if (/^\+?[0-9\s]{10,15}$/.test(msg)) {
        raisons.push("Numéro détecté.");
        if (msg.startsWith("07")) raisons.push("Numéro suspect : 07 utilisé dans de nombreuses arnaques.");
    }

    // Emails
    if (msg.includes("@")) {
        raisons.push("Email détecté.");
        if (/\d{5,}/.test(msg)) raisons.push("Email suspect contenant beaucoup de chiffres.");
    }

    // Résultat
    let niveau = "Probablement sûr";
    if (score >= 4) niveau = "⚠️ DANGER";
    else if (score >= 2) niveau = "⚠️ Suspect";

    return { niveau, raisons };
}

function check() {
    const input = document.getElementById("input").value.trim();
    const resultDiv = document.getElementById("result");
    if (!input) {
        resultDiv.className = "";
        resultDiv.innerHTML = "<p>Veuillez entrer un texte à analyser.</p>";
        return;
    }

    const analysis = analyser_message(input);
    let className = analysis.niveau === "⚠️ DANGER" ? "danger" :
                    analysis.niveau === "⚠️ Suspect" ? "suspect" : "safe";

    resultDiv.className = "result " + className;
    resultDiv.innerHTML = `<h3>${analysis.niveau}</h3><ul>${analysis.raisons.map(r => `<li>${r}</li>`).join("")}</ul>`;
}
