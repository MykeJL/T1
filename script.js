import { db } from './config.js';
import { initializeCharacterCreator, saveCharacterToDatabase } from './characterCreator.js';

// Get elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginButton = document.getElementById('loginButton');
const signupButton = document.getElementById('signupButton');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');

// Character creator elements
const characterPreviewCanvas = document.getElementById('characterPreview');
const ctx = characterPreviewCanvas.getContext('2d');

// Initialize character creator after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get character creator elements inside this function
    const shapeSelect = document.getElementById('shapeSelectPreview');
    const colorSelect = document.getElementById('colorSelectPreview');
    const emojiSelect = document.getElementById('emojiSelectPreview');
    const hairSelect = document.getElementById('hairSelectPreview');
    const hairColorSelect = document.getElementById('hairColorSelectPreview');

    // Initialize character creator
    initializeCharacterCreator(characterPreviewCanvas, shapeSelect, colorSelect, emojiSelect, hairSelect, hairColorSelect);

    // Event listeners for updates
    shapeSelect.addEventListener('change', updateCharacterPreview);
    colorSelect.addEventListener('change', updateCharacterPreview);
    emojiSelect.addEventListener('change', updateCharacterPreview);
    hairSelect.addEventListener('change', updateCharacterPreview);
    hairColorSelect.addEventListener('change', updateCharacterPreview);

    // Function to update character preview
    function updateCharacterPreview() {
        const shape = shapeSelect.value;
        const color = colorSelect.value;

        // Clear canvas
        ctx.clearRect(0, 0, characterPreviewCanvas.width, characterPreviewCanvas.height);

        // Draw the selected shape
        ctx.fillStyle = color;
        ctx.beginPath();

        switch (shape) {
            case 'Square':
                ctx.fillRect(50, 50, 100, 100);
                break;
            case 'Circle':
                ctx.arc(100, 100, 50, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'Triangle':
                ctx.moveTo(100, 50);
                ctx.lineTo(150, 150);
                ctx.lineTo(50, 150);
                ctx.closePath();
                ctx.fill();
                break;
            case 'Pentagon':
                drawPolygon(ctx, 5, 100, 100, 50);
                break;
            case 'Hexagon':
                drawPolygon(ctx, 6, 100, 100, 50);
                break;
        }

        // Draw emoji in the center
        const emoji = emojiSelect.value;
        ctx.font = '40px Arial';
        ctx.fillText(emoji, 85, 120);

        // Draw hair
        const hairType = hairSelect.value;
        ctx.fillStyle = hairColorSelect.value;
        if (hairType === 'Long') {
            ctx.fillRect(70, 20, 60, 30); // Long hair
        } else {
            ctx.fillRect(85, 20, 30, 15); // Short hair
        }
    }
});

// Function to draw polygons
function drawPolygon(ctx, sides, x, y, radius) {
    const angle = (Math.PI * 2) / sides;
    ctx.moveTo(x + radius * Math.cos(0), y + radius * Math.sin(0));
    for (let i = 1; i < sides; i++) {
        ctx.lineTo(x + radius * Math.cos(i * angle), y + radius * Math.sin(i * angle));
    }
    ctx.closePath();
    ctx.fill();
}

// Show signup form
showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
});

// Show login form
showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Login
loginButton.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const classSelection = document.getElementById('classSelection').value;

    if (!isValidUsername(username) || !isValidPassword(password)) {
        alert("Invalid username or password format.");
        return;
    }

    // Query Firestore to get the user with matching username and password
    db.collection('users').doc(classSelection).collection('students').where('username', '==', username).where('password', '==', password).get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                throw new Error('Invalid username or password');
            }
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            console.log("User logged in:", userData);
            
            // Redirect to character creation page or dashboard
            // window.location.href = "dashboard.html";

            // Optionally retrieve character data for display
            if (userData.character) {
                console.log("Character data:", userData.character);
                // Here you can populate character preview with userData.character
                // For example: set dropdowns or other UI elements based on userData.character
            }
        })
        .catch((error) => {
            console.error("Login error:", error.message);
            alert("Login failed: " + error.message);
        });
});

// Input validation
function isValidUsername(username) {
    return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

function isValidPassword(password) {
    return password.length >= 6;
}

// Signup
signupButton.addEventListener('click', () => {
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const classSelection = document.getElementById('classSelection').value;
    const bestSkill = document.getElementById('bestSkill').value;
    const improveSkill = document.getElementById('improveSkill').value;
    const firstNameLastInitial = document.getElementById('firstNameLastInitial').value;

    // Collect character data for saving
    const characterData = {
        shape: document.getElementById('shapeSelectPreview').value,
        color: document.getElementById('colorSelectPreview').value,
        emoji: document.getElementById('emojiSelectPreview').value,
        hair: document.getElementById('hairSelectPreview').value,
        hairColor: document.getElementById('hairColorSelectPreview').value,
    };

    if (!isValidUsername(username) || !isValidPassword(password)) {
        alert("Invalid username or password format.");
        return;
    }

    // Check if username already exists
    db.collection('users').doc(classSelection).collection('students').where('username', '==', username).get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                throw new Error('Username already exists');
            }

            // Add user data under the selected class in Firestore
            return db.collection('users').doc(classSelection).collection('students').add({
                username: username,
                password: password,
                class: classSelection,
                bestSkill: bestSkill,
                improveSkill: improveSkill,
                name: firstNameLastInitial,
                character: characterData 
            });
        })
        .then((docRef) => {
            console.log("User signed up with ID: ", docRef.id);
            alert("Signup successful! You can now log in.");
            // Clear signup form and show login form
            document.getElementById('signupUsername').value = '';
            document.getElementById('signupPassword').value = '';
            signupForm.style.display = 'none';
            loginForm.style.display = 'block';
        })
        .catch((error) => {
            console.error("Signup error:", error.message);
            alert("Signup failed: " + error.message);
        });
});