// GESTION DES ANIMATIONS DE LA PAGE 'PROFIL' EN FONCTION DU SCROLL UTILISATEUR:
// Déclaration de la variable 'niveauDeScroll' qui permettra d'identifier la position du scroll de l'utilisateur
let niveauDeScroll;

// Déclaration de la fonction permettant l'affichage progressif de la partie Contact
let compteur = 0.10;
function afficheContact() {
    if (compteur < 1.1) {
        console.log(compteur);
        compteur += 0.10;
        $('#contact-conteneur').css('opacity', compteur);
    }
    else {
        clearInterval(afficheContact);
    }
};

// Déclaration de la fonctino permettant le remplissage progressive des barres de progression :
let textePourcentage = 0;
const barres = document.querySelectorAll('.barre-progression');
const pourcentages = document.querySelectorAll('.pourcentage-progression');
let animationCompetences = function() {
    barres.forEach(barre => {
        let valeur = barre.getAttribute('aria-valuenow') + '%';
        barre.style.width = valeur;
        barre.children[0].innerText = barre.style.width;
        let intervalPourcentage = setInterval(animePourcentage, 30);
        function animePourcentage() {
            textePourcentage++;
            if (textePourcentage > parseInt(barre.style.width)) {
                clearInterval(intervalPourcentage);
                barre.children[0].innerText = barre.getAttribute('aria-valuenow') + '%';
            } else {
                barre.children[0].innerText = `${textePourcentage}%`;
            }
        };
    });
};

// Utilisation de l'évènement 'scroll' sur l'élément 'window'
window.addEventListener('scroll', () => {
    // Attribution d'une valeur à la variable 'niveauDeScroll' correspondant au niveau de scroll utilisateur en pourcentages
    // window.innerHeight => Hauteur de la partie visible de la fenetre
    // window.scrollY => Coordonnée sur l'axe Y correspondant au niveau du haut de la fenetre sur le document
    // document.body.offsetHeight => Hauteur totale du document
    niveauDeScroll = ((window.innerHeight + window.scrollY) / document.body.offsetHeight) * 100;
    // console.log((window.innerHeight + window.scrollY) / document.body.offsetHeight);
    // Conditions qui permmettent d'ajouter ou de retirer la classe 'active' en fonction du scroll utilisateur
    if (niveauDeScroll >= 84) {
        $btnContact.addClass('active');
        setTimeout(() => {
            $('#contact-conteneur').css('transform', 'none');
            let intervalContact = setInterval(afficheContact, 50);
        }, 500);
    } else {
        $btnContact.removeClass('active');
    }
    if (niveauDeScroll >= 58 && niveauDeScroll < 84) {
        $btnPortfolio.addClass('active');
        
        setTimeout(() => {
            $('#portfolio-conteneur>div').css('transform', 'scale(100%)').css('opacity' ,'1');
        }, 500);
    } else {
        $btnPortfolio.removeClass('active');
    }
    if (niveauDeScroll >= 33 && niveauDeScroll < 58) {
        $btnCompetences.addClass('active');
        animationCompetences();
    } else {
        $btnCompetences.removeClass('active');
    }
    if (niveauDeScroll < 33) {
        $btnAPropos.addClass('active');
        
    } else {
        $btnAPropos.removeClass('active');
    }
});