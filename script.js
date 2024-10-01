import 'dotenv/config';
import firebaseConfig from './config.js';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Get elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginButton = document.getElementById('loginButton');
const signupButton = document.getElementById('signupButton');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');

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

// Input validation
function isValidUsername(username) {
    return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

function isValidPassword(password) {
    return password.length >= 6;
}

// Login
loginButton.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!isValidUsername(username) || !isValidPassword(password)) {
        alert("Invalid username or password format.");
        return;
    }

    // Query Firestore to get the user with matching username and password
    db.collection('users').where('username', '==', username).where('password', '==', password).get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                throw new Error('Invalid username or password');
            }
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            console.log("User logged in:", userData);
            // Redirect to character creation page or dashboard
            // window.location.href = "dashboard.html";
        })
        .catch((error) => {
            console.error("Login error:", error.message);
            alert("Login failed: " + error.message);
        });
});

// Signup
signupButton.addEventListener('click', () => {
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;

    if (!isValidUsername(username) || !isValidPassword(password)) {
        alert("Invalid username or password format. Username should be 3-20 characters long and contain only letters, numbers, and underscores. Password should be at least 6 characters long.");
        return;
    }

    // Check if username already exists
    db.collection('users').where('username', '==', username).get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                throw new Error('Username already exists');
            }

            // Username is available, create a new user
            return db.collection('users').add({
                username: username,
                password: password
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

// Initialize user state
let currentUser = null;

// Function to check login state
function checkLoginState() {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
        currentUser = JSON.parse(userString);
        console.log("User is logged in:", currentUser);
        // You can redirect to the character creation page or dashboard here
        // window.location.href = "dashboard.html";
    } else {
        console.log("No user is logged in");
    }
}

// Call this function when the page loads
checkLoginState();