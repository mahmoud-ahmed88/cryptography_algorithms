// -------------------- Full DES (JavaScript) --------------------

// -- Tables --------------------------------------------------------------
const IP = [
58,50,42,34,26,18,10,2,
60,52,44,36,28,20,12,4,
62,54,46,38,30,22,14,6,
64,56,48,40,32,24,16,8,
57,49,41,33,25,17,9,1,
59,51,43,35,27,19,11,3,
61,53,45,37,29,21,13,5,
63,55,47,39,31,23,15,7
];

const IP_INV = [
40,8,48,16,56,24,64,32,
39,7,47,15,55,23,63,31,
38,6,46,14,54,22,62,30,
37,5,45,13,53,21,61,29,
36,4,44,12,52,20,60,28,
35,3,43,11,51,19,59,27,
34,2,42,10,50,18,58,26,
33,1,41,9,49,17,57,25
];

const E = [
32,1,2,3,4,5,
4,5,6,7,8,9,
8,9,10,11,12,13,
12,13,14,15,16,17,
16,17,18,19,20,21,
20,21,22,23,24,25,
24,25,26,27,28,29,
28,29,30,31,32,1
];

const P = [
16,7,20,21,29,12,28,17,
1,15,23,26,5,18,31,10,
2,8,24,14,32,27,3,9,
19,13,30,6,22,11,4,25
];

// 8 S-boxes
const S_BOX = [
[
[14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7],
[0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8],
[4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0],
[15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13]
],
[
[15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10],
[3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5],
[0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15],
[13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9]
],
[
[10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8],
[13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1],
[13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7],
[1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12]
],
[
[7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15],
[13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9],
[10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4],
[3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14]
],
[
[2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9],
[14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6],
[4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14],
[11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3]
],
[
[12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11],
[10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8],
[9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6],
[4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13]
],
[
[4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1],
[13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6],
[1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2],
[6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12]
],
[
[13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7],
[1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2],
[7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8],
[2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11]
]
];

const PC1 = [
57,49,41,33,25,17,9,
1,58,50,42,34,26,18,
10,2,59,51,43,35,27,
19,11,3,60,52,44,36,
63,55,47,39,31,23,15,
7,62,54,46,38,30,22,
14,6,61,53,45,37,29,
21,13,5,28,20,12,4
];

const PC2 = [
14,17,11,24,1,5,3,28,
15,6,21,10,23,19,12,4,
26,8,16,7,27,20,13,2,
41,52,31,37,47,55,30,40,
51,45,33,48,44,49,39,56,
34,53,46,42,50,36,29,32
];

const LEFT_SHIFTS = [1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1];

// ---------------- Utility functions -------------------------------------
function permute(bits, table) {
    return table.map(i => bits[i-1]).join('');
}

function xor(a, b) {
    return a.split('').map((v,i)=>v===b[i]?'0':'1').join('');
}

function strToBits(str) {
    return Array.from(str).map(c => c.charCodeAt(0).toString(2).padStart(8,'0')).join('');
}

function bitsToStr(bits) {
    let res = '';
    for(let i=0;i<bits.length;i+=8){
        res += String.fromCharCode(parseInt(bits.slice(i,i+8),2));
    }
    return res;
}

// ---------------- Key schedule ------------------------------------------
function leftRotate(s,n){ return s.slice(n)+s.slice(0,n); }

function generateSubkeys(key8){
    if(key8.length!==8) throw "Key must be 8 bytes";
    let keyBits = strToBits(key8);
    let permuted = permute(keyBits, PC1);
    let C = permuted.slice(0,28), D=permuted.slice(28);
    let subkeys=[];
    for(let shift of LEFT_SHIFTS){
        C = leftRotate(C, shift);
        D = leftRotate(D, shift);
        let combined = C+D;
        let subkey = permute(combined, PC2);
        subkeys.push(subkey);
    }
    return subkeys;
}

// ---------------- Feistel / round function ------------------------------
function sboxSubstitution(bits48){
    let out='';
    for(let i=0;i<8;i++){
        let block6=bits48.slice(i*6,(i+1)*6);
        let row=parseInt(block6[0]+block6[5],2);
        let col=parseInt(block6.slice(1,5),2);
        out += S_BOX[i][row][col].toString(2).padStart(4,'0');
    }
    return out;
}

function feistel(R,subkey){
    let expanded = permute(R,E);
    let xored = xor(expanded, subkey);
    let sboxed = sboxSubstitution(xored);
    return permute(sboxed,P);
}

// ---------------- Block encrypt/decrypt ---------------------------------
function desBlockEncrypt(block64,subkeys){
    let block = permute(block64,IP);
    let L=block.slice(0,32), R=block.slice(32);
    for(let i=0;i<16;i++){
        let fOut = feistel(R,subkeys[i]);
        let newR = xor(L,fOut);
        L=R; R=newR;
    }
    let preoutput = R+L;
    return permute(preoutput,IP_INV);
}

function desBlockDecrypt(block64,subkeys){
    let block = permute(block64,IP);
    let L=block.slice(0,32), R=block.slice(32);
    for(let i=15;i>=0;i--){
        let fOut = feistel(R,subkeys[i]);
        let newR = xor(L,fOut);
        L=R; R=newR;
    }
    let preoutput = R+L;
    return permute(preoutput,IP_INV);
}

// ---------------- Padding ---------------------------------------------
function pkcs5Pad(data){
    let padLen = 8 - (data.length % 8);
    return data + String.fromCharCode(padLen).repeat(padLen);
}

function pkcs5Unpad(data){
    let padLen = data.charCodeAt(data.length-1);
    if(padLen<1||padLen>8) throw "Invalid padding";
    return data.slice(0,-padLen);
}

// ---------------- High-level encrypt/decrypt ----------------------------
function desEncrypt(data,key){
    let subkeys = generateSubkeys(key);
    let padded = pkcs5Pad(data);
    let cipherBits='';
    for(let i=0;i<padded.length;i+=8){
        let block=padded.slice(i,i+8);
        cipherBits += desBlockEncrypt(strToBits(block),subkeys);
    }
    return cipherBits.match(/.{1,8}/g).map(b=>String.fromCharCode(parseInt(b,2))).join('');
}

function desDecrypt(cipher,key){
    let subkeys = generateSubkeys(key);
    if(cipher.length%8!==0) throw "Cipher length must be multiple of 8";
    let plainBits='';
    for(let i=0;i<cipher.length;i+=8){
        let block=cipher.slice(i,i+8);
        plainBits += desBlockDecrypt(strToBits(block),subkeys);
    }
    let bytes = plainBits.match(/.{1,8}/g).map(b=>String.fromCharCode(parseInt(b,2))).join('');
    return pkcs5Unpad(bytes);
}

// ---------------- Hex utilities ----------------------------------------
function toHex(str){
    return Array.from(str).map(c=>c.charCodeAt(0).toString(16).padStart(2,'0')).join('').toUpperCase();
}

function fromHex(hex){
    if(hex.length%2!==0) throw "Hex length must be even";
    let res='';
    for(let i=0;i<hex.length;i+=2){
        res += String.fromCharCode(parseInt(hex.slice(i,i+2),16));
    }
    return res;
}

// ---------------- Example usage ---------------------------------------
function mainDES(){
    let choice = prompt("DES — 1) Encrypt 2) Decrypt (Enter 1 or 2)");
    if(choice!=='1'&&choice!=='2'){alert("Invalid choice"); return;}
    let key = prompt("Enter key (8 characters)");
    if(key.length!==8){alert("Key must be 8 chars"); return;}
    if(choice==='1'){
        let data = prompt("Enter plaintext");
        let cipher = desEncrypt(data,key);
        alert("Ciphertext (HEX):\n"+toHex(cipher));
    }else{
        let hexInput = prompt("Enter ciphertext (HEX)");
        let cipher;
        try{ cipher = fromHex(hexInput); } catch(e){ alert("Invalid hex"); return; }
        try{
            let plain = desDecrypt(cipher,key);
            alert("Decrypted plaintext:\n"+plain);
        }catch(e){ alert("Decryption error: "+e); }
    }
}

// Run the CLI
// mainDES();
