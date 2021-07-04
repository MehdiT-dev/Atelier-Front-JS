// GESTION DE L'ANIMATION AU CLICK SUR LES LIENS DU MENU DE LA PAGE 'PROFIL':
// Identification des boutons permmetant la navigation rapide dans la page 'profil'
const $btnAPropos = $('#lien-a-propos');
const $btnCompetences = $('#lien-competences');
const $btnPortfolio = $('#lien-portfolio');
const $btnContact = $('#lien-contact');

// Identification des différentes sections de la page 'profil'
const $sectionAPropos = $('#a-propos');
const $sectionCompetences = $('#competences');
const $sectionPortfolio = $('#portfolio');
const $sectionContact = $('#contact');

// Gestions de l'animation des ancres
$btnAPropos.click(() => {
    $('html, body').animate({
        scrollTop: $sectionAPropos.offset().top
    }, 500);
});
$btnCompetences.click(() => {
    $('html, body').animate({
        scrollTop: $sectionCompetences.offset().top
    }, 500);
});
$btnPortfolio.click(() => {
    $('html, body').animate({
        scrollTop: $sectionPortfolio.offset().top
    }, 500);
});
$btnContact.click(() => {
    $('html, body').animate({
        scrollTop: $sectionContact.offset().top
    }, 500);
});


window.addEventListener('load', () => {
        $('#a-propos-conteneur div:first-child div img').css('transform', 'none');
        $('#a-propos-conteneur div p span:first-child').css('transform', 'none').css('opacity', '1');  
        $('#a-propos-conteneur div p span:last-child').css('margin', '0').css('opacity', '1');  
        $('#a-propos-conteneur div p').css('transform', 'none').css('opacity', '1');  
})