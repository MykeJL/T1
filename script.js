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

// Initialize character creator
document.addEventListener('DOMContentLoaded', () => {
    const characterPreviewCanvas = document.getElementById('characterPreview');
    const shapeSelect = document.getElementById('shapeSelect');
    const colorSelect = document.getElementById('colorSelect');
    const emojiSelect = document.getElementById('emojiSelect');
    const hairSelect = document.getElementById('hairSelect');
    const hairColorSelect = document.getElementById('hairColorSelect');

    initializeCharacterCreator(characterPreviewCanvas, shapeSelect, colorSelect, emojiSelect, hairSelect, hairColorSelect);
});



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

function validateSignupForm() {
    const requiredFields = [
        'signupUsername',
        'signupPassword',
        'classSelection',
        'bestSkill',
        'improveSkill',
        'firstNameLastInitial',
        'shapeSelect',
        'colorSelect',
        'emojiSelect',
        'hairSelect',
        'hairColorSelect'
    ];

    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field.value) {
            alert(`Please fill in all required fields. ${field.placeholder || field.id} is missing.`);
            return false;
        }
    }

    return true;
}

// Signup
signupButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (!validateSignupForm()) {
        return; // Stop if validation fails
    }

    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const classSelection = document.getElementById('classSelection').value;
    const bestSkill = document.getElementById('bestSkill').value;
    const improveSkill = document.getElementById('improveSkill').value;
    const firstNameLastInitial = document.getElementById('firstNameLastInitial').value;

    // Collect character data for saving
    const characterData = {
        shape: document.getElementById('shapeSelect').value,
        color: document.getElementById('colorSelect').value,
        emoji: document.getElementById('emojiSelect').value,
        hair: document.getElementById('hairSelect').value,
        hairColor: document.getElementById('hairColorSelect').value,
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