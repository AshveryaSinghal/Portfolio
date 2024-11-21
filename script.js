
const nameElement = document.getElementById('typedName');
const myName = "I'm Ashverya Singhal...";
let index = 0;

function typeEffect() {
    if (index < myName.length) {
        nameElement.innerHTML += myName.charAt(index);
        index++;
        setTimeout(typeEffect, 150); // Adjust typing speed (milliseconds)
    } else {
        // Reset the index to restart the typing effect
        index = 0;
        nameElement.innerHTML = ''; // Clear the content before restarting
        setTimeout(typeEffect, 1000); // Wait for a second before restarting
    }
}

// Start the typing effect when the page loads
window.onload = function() {
    typeEffect();
};
function openProject(url) {
    // Add any logic to handle opening the project page (e.g., redirecting)
    window.location.href = url;
}