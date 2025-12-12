function aesEncrypt() {
  const keyInput = document.getElementById('aes-key').value;
  const plaintext = document.getElementById('aes-input').value;
  const outputArea = document.getElementById('aes-output');

  if (keyInput.length !== 16) {
    alert('Key must be exactly 16 characters for AES-128.');
    return;
  }

  try {
    const key = CryptoJS.enc.Utf8.parse(keyInput);
    // For AES, we use a random IV for each encryption for security.
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // Prepend IV to ciphertext for use in decryption
    outputArea.value = iv.toString(CryptoJS.enc.Hex) + encrypted.ciphertext.toString(CryptoJS.enc.Hex);
  } catch (e) {
    outputArea.value = 'Encryption failed: ' + e.message;
  }
}

function aesDecrypt() {
  const keyInput = document.getElementById('aes-key').value;
  const ciphertextHex = document.getElementById('aes-input').value;
  const outputArea = document.getElementById('aes-output');

  if (keyInput.length !== 16) {
    alert('Key must be exactly 16 characters for AES-128.');
    return;
  }

  try {
    const key = CryptoJS.enc.Utf8.parse(keyInput);
    // Extract IV from the beginning of the ciphertext
    const iv = CryptoJS.enc.Hex.parse(ciphertextHex.substr(0, 32));
    const ciphertext = CryptoJS.enc.Hex.parse(ciphertextHex.substr(32));

    const decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    outputArea.value = decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    outputArea.value = 'Decryption failed. Ensure the key and ciphertext are correct.';
  }
}