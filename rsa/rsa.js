// Helper function for modular exponentiation (to handle large numbers)
function power(a, b, m) {
    let res = 1n;
    a = BigInt(a) % BigInt(m);
    while (b > 0) {
        if (b % 2n === 1n) res = (res * a) % BigInt(m);
        a = (a * a) % BigInt(m);
        b = b / 2n;
    }
    return res;
}

// Helper function for modular inverse
function modInverse(a, m) {
    a = BigInt(a);
    m = BigInt(m);
    for (let x = 1n; x < m; x++) {
        if (((a % m) * (x % m)) % m === 1n) return x;
    }
    return 1n;
}

function rsaEncrypt() {
    const p = BigInt(document.getElementById('rsa-p').value);
    const q = BigInt(document.getElementById('rsa-q').value);
    const e = BigInt(document.getElementById('rsa-e').value);
    const plaintext = document.getElementById('rsa-input').value;
    const outputArea = document.getElementById('rsa-output');

    if (!p || !q || !e) {
        alert("Please enter values for p, q, and e.");
        return;
    }

    const n = p * q;
    const phi = (p - 1n) * (q - 1n);

    // Basic validation
    // In a real scenario, we'd need a primality test for p and q.
    // And check if e is coprime to phi.

    try {
        const encryptedChars = [];
        for (let i = 0; i < plaintext.length; i++) {
            const m = BigInt(plaintext.charCodeAt(i));
            const c = power(m, e, n);
            encryptedChars.push(c.toString());
        }
        outputArea.value = encryptedChars.join(' ');
    } catch (err) {
        outputArea.value = "Encryption failed: " + err.message;
    }
}

function rsaDecrypt() {
    const p = BigInt(document.getElementById('rsa-p').value);
    const q = BigInt(document.getElementById('rsa-q').value);
    const e = BigInt(document.getElementById('rsa-e').value);
    const ciphertext = document.getElementById('rsa-input').value;
    const outputArea = document.getElementById('rsa-output');

    if (!p || !q || !e) {
        alert("Please enter values for p, q, and e.");
        return;
    }

    const n = p * q;
    const phi = (p - 1n) * (q - 1n);
    const d = modInverse(e, phi);

    try {
        const ciphertextParts = ciphertext.split(' ');
        let decryptedText = '';
        for (const part of ciphertextParts) {
            if (part === '') continue;
            const c = BigInt(part);
            const m = power(c, d, n);
            decryptedText += String.fromCharCode(Number(m));
        }
        outputArea.value = decryptedText;
    } catch (err) {
        outputArea.value = "Decryption failed: " + err.message;
    }
}