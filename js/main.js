const btnNav = document.getElementById('btn-nav');
const navigation = document.getElementById('navigation');
const ulNavigation = document.querySelector('#navigation ul');

btnNav.addEventListener('click', () => {
    btnNav.classList.toggle('btn-active');
    navigation.classList.toggle('nav-active');
});