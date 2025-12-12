document.addEventListener('DOMContentLoaded', function() {
    updateKeyInputs();
});

function updateKeyInputs() {
    const size = parseInt(document.getElementById('matrix-size').value);
    const container = document.getElementById('key-inputs');
    container.innerHTML = '';
    for (let i = 0; i < size; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `k${i+1}`;
        input.placeholder = `Row ${i+1}`;
        container.appendChild(input);
    }
}

function parseKey() {
    const size = parseInt(document.getElementById('matrix-size').value);
    const keyMatrix = [];
    for (let i = 0; i < size; i++) {
        const rowStr = document.getElementById(`k${i+1}`).value;
        const row = rowStr.split(' ').map(Number);
        if (row.length !== size || row.some(isNaN)) {
            throw new Error(`Key Error: Each row must contain ${size} numbers separated by spaces.`);
        }
        keyMatrix.push(row);
    }
    return keyMatrix;
}

// --- Math Utilities ---
function modInverse(n, modulus) {
    n = (n % modulus + modulus) % modulus;
    for (let x = 1; x < modulus; x++) {
        if ((n * x) % modulus === 1) return x;
    }
    return null;
}

function determinant(m) {
    const size = m.length;
    if (size === 2) {
        return m[0][0] * m[1][1] - m[0][1] * m[1][0];
    }
    if (size === 3) {
        return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
               m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
               m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
    }
    throw new Error("Matrix size not supported for determinant calculation.");
}

function inverseMatrix(m) {
    const det = determinant(m);
    const detInv = modInverse(det, 26);
    if (detInv === null) {
        throw new Error("The key matrix is not invertible (the determinant has no modular inverse mod 26).");
    }

    const size = m.length;
    let adjugate;

    if (size === 2) {
        adjugate = [
            [m[1][1], -m[0][1]],
            [-m[1][0], m[0][0]]
        ];
    } else if (size === 3) {
        adjugate = [
            [
                (m[1][1] * m[2][2] - m[1][2] * m[2][1]),
                -(m[0][1] * m[2][2] - m[0][2] * m[2][1]),
                (m[0][1] * m[1][2] - m[0][2] * m[1][1])
            ],
            [
                -(m[1][0] * m[2][2] - m[1][2] * m[2][0]),
                (m[0][0] * m[2][2] - m[0][2] * m[2][0]),
                -(m[0][0] * m[1][2] - m[0][2] * m[1][0])
            ],
            [
                (m[1][0] * m[2][1] - m[1][1] * m[2][0]),
                -(m[0][0] * m[2][1] - m[0][1] * m[2][0]),
                (m[0][0] * m[1][1] - m[0][1] * m[1][0])
            ]
        ];
    } else {
        throw new Error("Matrix size not supported.");
    }

    return adjugate.map(row =>
        row.map(val => (val * detInv % 26 + 26) % 26)
    );
}

// --- Core Cipher Functions ---
function textToNumbers(text) {
    return text.toUpperCase().replace(/[^A-Z]/g, '').split('').map(char => char.charCodeAt(0) - 65);
}

function numbersToText(numbers) {
    return numbers.map(num => String.fromCharCode(num + 65)).join('');
}

function multiplyMatrix(key, vector) {
    const size = key.length;
    const result = new Array(size).fill(0);
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            result[i] += key[i][j] * vector[j];
        }
        result[i] %= 26;
    }
    return result;
}

function hillCipher(text, keyMatrix, mode) {
    const size = keyMatrix.length;
    let numbers = textToNumbers(text);
    while (numbers.length % size !== 0) {
        numbers.push(23); // Pad with 'X'
    }

    const matrix = (mode === 'encrypt') ? keyMatrix : inverseMatrix(keyMatrix);
    let resultNumbers = [];

    for (let i = 0; i < numbers.length; i += size) {
        const vector = numbers.slice(i, i + size);
        const resultVector = multiplyMatrix(matrix, vector);
        resultNumbers.push(...resultVector);
    }

    return numbersToText(resultNumbers);
}

// --- UI Event Handlers ---
function hillEncrypt() {
    const outputArea = document.getElementById('output');
    try {
        const keyMatrix = parseKey();
        const text = document.getElementById('hill-input').value;
        if (!text) {
            outputArea.textContent = "Please enter text to encrypt.";
            return;
        }
        outputArea.textContent = hillCipher(text, keyMatrix, 'encrypt');
    } catch (e) {
        outputArea.textContent = e.message;
    }
}

function hillDecrypt() {
    const outputArea = document.getElementById('output');
    try {
        const keyMatrix = parseKey();
        const text = document.getElementById('hill-input').value;
        if (!text) {
            outputArea.textContent = "Please enter text to decrypt.";
            return;
        }
        outputArea.textContent = hillCipher(text, keyMatrix, 'decrypt');
    } catch (e) {
        outputArea.textContent = e.message;
    }
}