const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // J is omitted

function generateKeyMatrix(key) {
    key = key.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
    let keySet = new Set(key.split(''));
    let matrix = Array.from(keySet);

    for (let char of alphabet) {
        if (!keySet.has(char)) {
            matrix.push(char);
        }
    }
    return matrix;
}

function displayKeyMatrix() {
    const key = document.getElementById('playfair-key').value;
    const matrix = generateKeyMatrix(key);
    const matrixContainer = document.getElementById('key-matrix');
    matrixContainer.innerHTML = '';
    matrix.forEach(char => {
        const div = document.createElement('div');
        div.textContent = char;
        matrixContainer.appendChild(div);
    });
}

function findCharPositions(matrix, char) {
    const index = matrix.indexOf(char);
    return { row: Math.floor(index / 5), col: index % 5 };
}

function processInput(text) {
    text = text.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
    let processed = "";
    for (let i = 0; i < text.length; i += 2) {
        let pair = text.substring(i, i + 2);
        if (pair.length === 1) {
            pair += 'X';
        }
        if (pair[0] === pair[1]) {
            processed += pair[0] + 'X';
            i--; // Re-evaluate the second character of the original pair
        } else {
            processed += pair;
        }
    }
    return processed;
}

function playfair(text, key, mode) { // mode: 1 for encrypt, -1 for decrypt
    const matrix = generateKeyMatrix(key);
    const inputText = (mode === 1) ? processInput(text) : text.toUpperCase().replace(/[^A-Z]/g, "");
    let output = "";

    for (let i = 0; i < inputText.length; i += 2) {
        const pair = inputText.substring(i, i + 2);
        const pos1 = findCharPositions(matrix, pair[0]);
        const pos2 = findCharPositions(matrix, pair[1]);

        let newPos1, newPos2;

        if (pos1.row === pos2.row) { // Same row
            newPos1 = { row: pos1.row, col: (pos1.col + mode + 5) % 5 };
            newPos2 = { row: pos2.row, col: (pos2.col + mode + 5) % 5 };
        } else if (pos1.col === pos2.col) { // Same column
            newPos1 = { row: (pos1.row + mode + 5) % 5, col: pos1.col };
            newPos2 = { row: (pos2.row + mode + 5) % 5, col: pos2.col };
        } else { // Rectangle
            newPos1 = { row: pos1.row, col: pos2.col };
            newPos2 = { row: pos2.row, col: pos1.col };
        }

        output += matrix[newPos1.row * 5 + newPos1.col];
        output += matrix[newPos2.row * 5 + newPos2.col];
    }

    return output;
}

function playfairEncrypt() {
    const key = document.getElementById('playfair-key').value;
    const input = document.getElementById('playfair-input').value;
    const outputArea = document.getElementById('playfair-output');

    if (!key) {
        alert("Please enter a key.");
        return;
    }

    outputArea.value = playfair(input, key, 1);
}

function playfairDecrypt() {
    const key = document.getElementById('playfair-key').value;
    const input = document.getElementById('playfair-input').value;
    const outputArea = document.getElementById('playfair-output');

    if (!key) {
        alert("Please enter a key.");
        return;
    }

    outputArea.value = playfair(input, key, -1);
}

// Initial display
displayKeyMatrix();