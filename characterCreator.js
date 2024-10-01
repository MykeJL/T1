// characterCreator.js
import { db } from './config.js'; // Import Firestore database configuration

export function initializeCharacterCreator(previewElement, shapeSelect, colorSelect, emojiSelect, hairSelect, hairColorSelect) {
    function updatePreview() {
        // Clear previous preview
        previewElement.innerHTML = '';

        const shape = shapeSelect.value;
        const color = colorSelect.value;
        const emoji = emojiSelect.value;
        const hair = hairSelect.value;
        const hairColor = hairColorSelect.value;

        // Create shape element
        const shapeElement = document.createElement('div');
        shapeElement.style.width = '100px';
        shapeElement.style.height = '100px';
        shapeElement.style.backgroundColor = color;
        shapeElement.style.position = 'relative';
        shapeElement.style.borderRadius = shape === 'Circle' ? '50%' : shape === 'Square' ? '0' : '10px'; // Add more cases for other shapes

        // Create emoji element
        const emojiElement = document.createElement('span');
        emojiElement.textContent = emoji;
        emojiElement.style.position = 'absolute';
        emojiElement.style.top = '50%';
        emojiElement.style.left = '50%';
        emojiElement.style.transform = 'translate(-50%, -50%)'; // Center the emoji within the shape

        // Create hair element
        const hairElement = document.createElement('div');
        hairElement.style.width = '30px'; // Width of hair
        hairElement.style.height = hair === 'Long' ? '60px' : '30px'; // Height based on hair type
        hairElement.style.backgroundColor = hairColor; // Set hair color
        hairElement.style.position = 'absolute';
        hairElement.style.top = shape === 'Square' ? '-30px' : shape === 'Circle' ? '-20px' : '-30px'; // Position based on shape
        hairElement.style.left = '50%';
        hairElement.style.transform = 'translateX(-50%)';
        hairElement.style.borderRadius = '5px'; // Rounded edges for hair

        // Append elements to preview
        shapeElement.appendChild(emojiElement);
        shapeElement.appendChild(hairElement);
        previewElement.appendChild(shapeElement);
    }

    // Event listeners for dropdown changes
    shapeSelect.addEventListener('change', updatePreview);
    colorSelect.addEventListener('change', updatePreview);
    emojiSelect.addEventListener('change', updatePreview);
    hairSelect.addEventListener('change', updatePreview);
    hairColorSelect.addEventListener('change', updatePreview);
}

export function saveCharacterToDatabase(classSelection, username, characterData) {
    const userRef = db.collection('users').doc(classSelection).collection('students').doc(username);
    
    return userRef.update({
        character: characterData
    }).then(() => {
        console.log("Character saved successfully!");
    }).catch((error) => {
        console.error("Error saving character: ", error);
    });
}
