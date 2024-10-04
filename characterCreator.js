// characterCreator.js
import { db } from './config.js'; // Import Firestore database configuration

// characterCreator.js
export function initializeCharacterCreator(previewElement, shapeSelect, colorSelect, emojiSelect, hairSelect, hairColorSelect) {
    function updatePreview() {
        const ctx = previewElement.getContext('2d');
        ctx.clearRect(0, 0, previewElement.width, previewElement.height);

        const shape = shapeSelect.value;
        const color = colorSelect.value;
        const emoji = emojiSelect.value;
        const hair = hairSelect.value;
        const hairColor = hairColorSelect.value;

        // Draw shape
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

        // Draw emoji
        ctx.font = '40px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, 100, 100);

        // Draw hair
        ctx.fillStyle = hairColor;
        if (hair === 'Long') {
            ctx.fillRect(75, 20, 50, 40);
        } else {
            ctx.fillRect(85, 30, 30, 20);
        }
    }

    // Event listeners
    shapeSelect.addEventListener('change', updatePreview);
    colorSelect.addEventListener('change', updatePreview);
    emojiSelect.addEventListener('change', updatePreview);
    hairSelect.addEventListener('change', updatePreview);
    hairColorSelect.addEventListener('change', updatePreview);

    // Initial preview
    updatePreview();
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
