import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = crypto.randomBytes(32);  // for test, generate random key each time
const iv = crypto.randomBytes(16);

export function encryptData(data) {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decryptData(encryptedData) {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
