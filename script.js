
const nameElement = document.getElementById('typedName');
const myName = "I'm Ashverya Singhal...";
let index = 0;

function typeEffect() {
    if (index < myName.length) {
        nameElement.innerHTML += myName.charAt(index);
        index++;
        setTimeout(typeEffect, 150); 
    } else {
        index = 0;
        nameElement.innerHTML = ''; 
        setTimeout(typeEffect, 1000); 
    }
}


window.onload = function() {
    typeEffect();
};
function openProject(url) {
    window.location.href = url;
}