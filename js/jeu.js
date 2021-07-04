// Définition des réglages de base du canvas :
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.setAttribute('width', '342');
canvas.setAttribute('height','710');



// Paramètres généraux :
let jeuEnCours = false;
let toucheFlecheDroite = false;
let toucheFlecheGauche = false;
let toucheEspace = false;
let x = (canvas.width/2) - (70/2);
let attenteTir = 0;
let tempsDeRecharge = 3;
let rechargement = 0.1;
let index = 0;
let vitesse = 2;
let score = 0;
let meilleurScore = 0;
let compteurMouvement = 0;
let compteurCompetences = 0;



// Incrémentation du compteurMouvement toutes les 0.5s
let intervalMouvement = setInterval(() => {
    compteurMouvement++;
}, 500);



// Création des différentes instances (images) depuis la méthodes new Image()
// Puis renseignement du chemin via la propriété 'src' de chacune des intances :
const imgBg = new Image();
imgBg.src = '../images/sprite/fond.jpg';
const imgJoueur = new Image();
imgJoueur.src = '../images/sprite/joueur1.png'
const imgLaser = new Image();
imgLaser.src = '../images/sprite/laser.png';
const imgAlien = new Image();
imgAlien.src = '../images/sprite/alien.png';
const imgCompetences = new Image();
imgCompetences.src = '../images/sprite/competences1.png';



// Initialisation des variables qui ciblent les éléments HTML
// Et permettent d'afficher du texte de façon dynamique dans le canvas :

// Gestion du message d'accueil du jeu demandant au joueur d'appuyer sur la touche espace
const texteAccueilJeu = document.querySelector('.canvas-conteneur p');
texteAccueilJeu.classList.add('affiche');
const intervalTexte = setInterval(clignotement, 1500);
function clignotement() {
    texteAccueilJeu.classList.remove('affiche');
    const clignotementBis = setTimeout(function() {
        texteAccueilJeu.classList.add('affiche');
    }, 200);    
};

// Gestion de l'affichage du score de la partie en cours
const texteScoreActuel = document.getElementById('score-actuel');
texteScoreActuel.innerText = `Score : ${score}`;

// Gestion de l'affichage du meilleur score du jeu
const texteMeilleurScore = document.getElementById('meilleur-score');
texteMeilleurScore.classList.add('affiche');
function miseAJourMeilleurScore() {
    if (score > meilleurScore) {
        meilleurScore = score;
    }
    texteMeilleurScore.innerText = `Meilleur score : ${meilleurScore}`;
};



// Ecouteurs d'évènements suite pression touche du clavier
// pour les deux touches directionnelles et la touche espace :
document.addEventListener("keydown", appuiTouche);
document.addEventListener("keyup", relacheTouche);
function appuiTouche(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        toucheFlecheDroite = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        toucheFlecheGauche = true;
    }
    else if (e.keyCode == '32') {
        toucheEspace = true;
    }
};
function relacheTouche(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        toucheFlecheDroite = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        toucheFlecheGauche = false;
    }
    else if (e.keyCode == '32') {
        toucheEspace = false;
    }
};



// Gestions des lasers tirés par le joueur :
// Creation des lasers à l'appui de la touche espace pendant le jeu (fonction constructeur => voir cours Sami)
// Récupération des coordonnées pout créer l'objet laser (y identique pour chaque laser / x = la position x du joueur)
// Placer l'objet dans le tableau (push de l'objet dans le tableau 'lasers' => let lasers.lenght = MonUsineALaser('joueur.x', yfixe));
// Désincrémenter l'element 'laser' en Y (laser.y = laser.y - n => boucle for qui parcoure le tableau 'laser' à chaque tour du rendu 'render' pour exécuter une méthode du prototype de l'UsineALaser)
// Supprimer l'élément du tableau si y < 0 (lorsque l'element sort des limites du canvas => delete lasers[i] ou lasers.splice(i,i+1))

// Création du tableau contenant les lasers
let lasers = [];

// Création de la fonction d'usine 'MonUsineALaser'
// La fonction déclare le constructeur 'MonCreateurDeLaser' et son prototype
// et retourne une autre fonction qui utilise ce constructeur pour créer un objet : 
const MonUsineALaser = (function() {
    const MonCreateurDeLaser = function(positionDeLaserSurX) {
        this.imgX = 0;
        this.imgY = 0;
        this.imgWidth = 33;
        this.imgHeight = 124;
        this.x = positionDeLaserSurX;
        this.y = canvas.height-90;
        this.width = 4;
        this.height = 10;
    };
    // Création des méthodes du prototype de l'objet :
    // Déplacement de l'objet laser de -1 / Si laser.y < 0 => suppression de laser
    MonCreateurDeLaser.prototype.deplacementLaser = function() {
        for (let i=0; i<lasers.length; i++) {
            lasers[i].y -= 1;
            if (lasers[i].y < 0) {
                lasers.splice(i,i+1);
            }
        }
    };
    // Pour chaque éléments du tableau, si la valeur est égale à undefined, suppression de l'élément du tableau
    MonCreateurDeLaser.prototype.suppressionLaser = function() {
        for (let i=lasers.lenght; i>=0; i--) {
            if (lasers[i] == undefined) {
                delete lasers[i];
            }
        }
    };
    return function(argumentConstructeur) {
        return new MonCreateurDeLaser(argumentConstructeur);
    }
}());
// A l'appui de la touche espace, création d'un objet, push de l'objet dans le tableau, puis représentaion des objets du tableau avec drawImage (boucle for);
const dessinLasers = function() {
    for (let i=0; i<lasers.lenght; i++) {
        ctx.drawImage(imgLaser, lasers[i].imgX, lasers[i].imgY, lasers[i].imgWidth, lasers[i].imgHeight, lasers[i].x, lasers[i].y, lasers[i].width, lasers[i].height);
    } 
};
// Fonction permettant la gestion du mouvement des lasers
const mouvementLaser = function() {
    lasers.forEach(laser => {
        laser.deplacementLaser();
    });
};



// Création du tableau contenant les aliens
let aliens = [];

// Création de la fonction d'usine 'MonUsineAAlien'
// La fonction déclare le constructeur 'MonCreateurDAlien' et son prototype
// et retourne une autre fonction qui utilise ce constructeur pour créer un objet : 
const MonUsineAAlien = (function() {
    const MonCreateurDAlien = function() {
        this.imgX = (index % 5) * 62;
        this.imgY = 0;
        this.imgWidth = 62 + ((index % 5) * 62); // 310 => 5 x 62 // ((index % 5) + 62) + ((index % 5) * 62)
        this.imgHeight = 84;
        this.x = (0.1 + Math.random()) * 270;
        this.y = 0 - 30;
        this.width = 30;
        this.height = 30;
    };
    // Création des méthodes du prototype de l'objet :
    // Déplacement de l'objet alien sur l'axe y de +0.3
    // Une fois le score de 3000 points atteint, vitesse des objets alien multiplié par 2
    MonCreateurDAlien.prototype.deplacementAlien = function() {
        if (score < 3000) {
            this.y += 0.30;
        } else {
            this.y += 0.60;
        }
    };
    return function() {
        return new MonCreateurDAlien();
    }
}());
// Boucle forEach qui vérifie que les aliens n'appraissent pas en dehors du champ de vision du joueur sur l'axe x :
aliens.forEach(alien => {
    if (alien.x < 10) {
        alien.x = 10;
    };
});
// Fonction permettant la gestion du mouvement des aliens
const mouvementAlien = function() {
    aliens.forEach(alien => {
        alien.deplacementAlien();
        // Si alien.y + this.height >= canvas.height => Game Over
        if (alien.y + alien.height >= canvas.height) {
                    jeuEnCours = false;
                    lasers = [];
                    aliens = [];
                }
    });
}
// Fonction permettant de générer des aliens dans le canvas à intervales iréguliers
function apparitionAlien() {
    aliens.push(MonUsineAAlien());
};



// Création du tableau contenant les competences
let competences = [];

// Création de la fonction d'usine 'MonUsineACompetences'
// La fonction déclare le constructeur 'MonCreateurDeCompetences' et son prototype
// et retourne une autre fonction qui utilise ce constructeur pour créer un objet : 
const MonUsineACompetences = (function() {
    const MonCreateurDeCompetences = function() {
        this.imgX = (compteurCompetences % 3) * 30;
        this.imgY = 0;
        this.imgWidth = 30; // 90 => 3 x 30 // ((index % 3) + 62) + ((index % 5) * 62)
        this.imgHeight = 30;
        this.x = (0.1 + Math.random()) * 270;
        this.y = 0;
        this.width = 30;
        this.height = 30;
    };
    // Création des méthodes du prototype de l'objet :
    // Déplacement de l'objet alien de +1 / Si alien.y + this.height >= canvas.height => Game Over
    MonCreateurDeCompetences.prototype.deplacementCompetence = function() {
            this.y += 0.75;
        }
    return function() {
        return new MonCreateurDeCompetences();
    }
}());
// Fonction permettant la gestion du mouvement des aliens
const mouvementCompetence = function() {
    competences.forEach(competence => {
        competence.deplacementCompetence();
    });
}
// Fonction permettant de générer des compétences dans le canvas à intervales réguliers
function apparitionCompetence() {
    competences.push(MonUsineACompetences());
    compteurCompetences++;
};
// let intervalCompetences = setInterval(apparitionCompetences, 100);



// Déclarations d'objets littéraux :
const joueur = {
    width : 70,
    height : 70,
    x : x,
    y : canvas.height - (70 + 10)
}
const tir = {
    width : 148,
    height : 125,
    x : joueur.x,
    y : canvas.height - 70
}



// Vérification de collision entre chaque alien et chaque laser :
function detectionCollisionAlien() {
    for (let i=0; i<aliens.length; i++) {
        for (let j=0; j<lasers.length; j++) {
            if (aliens[i] === undefined) {

            }
            else if (aliens[i].y + aliens[i].height >= lasers[j].y && aliens[i].x < lasers[j].x + (lasers[j].width / 2) && aliens[i].x + aliens[i].width > lasers[j].x + (lasers[j].width / 2) && aliens[i] !== undefined) {
                aliens.splice(i,1);
                lasers.splice(j,1);
                score += 25;
            } else {
                // console.log(aliens);
                // console.log(lasers);
            }
        }
    }
}



// Vérification de collision entre le vaisseau du joueur et chaque compétence :
function detectionCollisionCompetence() {
    for (let i=0; i<competences.length; i++) {
        if (competences[i].y + competences[i].height >= joueur.y && competences[i].y < canvas.height && competences[i].x + competences[i].width/2 > joueur.x && competences[i].x < joueur.x + joueur.width/2 && competences[i] !== undefined) {
            competences.splice(i,1);
            score += 100;
        } else {
            // console.log(aliens);
            // console.log(lasers);
        }
    }
}



// Fonction permettant le raffraichissement de rendu de l'animation :
const affichageJeu = () => {
    index++;

    // Efface l'image précédente
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Permet l'animation continue du background
    ctx.drawImage(imgBg, 0, 0, canvas.width, canvas.height, 0,(index * vitesse) % canvas.height, canvas.width, canvas.height);
    ctx.drawImage(imgBg, 0, 0, canvas.width, canvas.height, 0,(index * vitesse) % canvas.height-canvas.height, canvas.width, canvas.height);
    // Dessine le vaisseau du joueur
    // ctx.drawImage(img, 0, 0, 900, 900, joueur.x, joueur.y, joueur.width, joueur.height);
    ctx.drawImage(imgJoueur, (compteurMouvement % 3) * 930, 0, 930, 1000, joueur.x, joueur.y, joueur.width, joueur.height);
    mouvementLaser();
    
    if (jeuEnCours == false) {
        miseAJourMeilleurScore();
        score = 0;
        texteAccueilJeu.classList.add('affiche');
        texteMeilleurScore.classList.add('affiche');
        texteScoreActuel.classList.remove('affiche');
        if (toucheEspace) {
            jeuEnCours = true;
            clearInterval(intervalTexte);
            texteAccueilJeu.classList.remove('affiche');
            texteMeilleurScore.classList.remove('affiche');
            texteScoreActuel.classList.add('affiche');
        }
    }
    else if (jeuEnCours == true) {
        texteScoreActuel.innerText = `Score : ${score}`;
        if (toucheFlecheDroite) {
            if (joueur.x < canvas.width - joueur.width) {
                joueur.x += 2;
            }
            else {
                joueur.x = canvas.width - joueur.width;
            }
        } else if (toucheFlecheGauche) {
            if (joueur.x > 0) {
                joueur.x -= 2;
            }
            else {
                joueur.x = 0;
            }
        };
        if (toucheEspace && attenteTir <= 0) {
            let positionDeLaserSurX = joueur.x + 32;
            // console.log(positionDeLaserSurX);
            lasers.push(MonUsineALaser(positionDeLaserSurX));
            // console.log(lasers);
            attenteTir = tempsDeRecharge * 3 ;
        }
        else if (tempsDeRecharge > 0) {
            attenteTir -= rechargement;
        }
        lasers.forEach(laser => {
            ctx.drawImage(imgLaser, laser.imgX, laser.imgY, laser.imgWidth, laser.imgHeight, laser.x, laser.y, laser.width, laser.height);
        });
        if (index % 200 == 0) {
            apparitionAlien();
        }
        // let intervalAlien = setInterval(apparitionAlien, /*Math.random */ 5000);
        aliens.forEach(alien => {
            ctx.drawImage(imgAlien, (compteurMouvement % 5) * 62, alien.imgY, 62, alien.imgHeight, alien.x, alien.y, alien.width, alien.height);
        });
        mouvementAlien();
        detectionCollisionAlien();
        
        competences.forEach(competence => {
            ctx.drawImage(imgCompetences, competence.imgX, competence.imgY, competence.imgWidth, competence.imgHeight, competence.x, competence.y, competence.width, competence.height);
        });
        mouvementCompetence();
        detectionCollisionCompetence();
    }
    if (index % 3000 == 0) {
        apparitionCompetence();
    }
    window.requestAnimationFrame(affichageJeu);
};



// Permet de lancer pour la première la fonction render() après chargement de notre première image :
window.addEventListener('load', () => {
    affichageJeu();
});