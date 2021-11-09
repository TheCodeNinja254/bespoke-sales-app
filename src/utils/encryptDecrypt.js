import crypto from 'crypto';

const ek = process.env.REACT_APP_EDK;
const iv = process.env.REACT_APP_IEDV;

// The CipherIV methods must take the inputs as a binary / buffer values.
const binaryEncryptionKey = Buffer.from(ek, 'base64');
const binaryIV = Buffer.from(iv, 'base64');

export const encrypt = (input) => {
  const cipher = crypto.createCipheriv(
    'AES-128-CBC',
    binaryEncryptionKey,
    binaryIV
  );

  // When encrypting, we're converting the UTF-8 input to base64 output.
  return cipher.update(input, 'utf8', 'base64') + cipher.final('base64');
};
// To use on the server
export const decrypt = (encryptedText) => {
  const decipher = crypto.createDecipheriv(
    'AES-128-CBC',
    binaryEncryptionKey,
    binaryIV
  );

  // When decrypting we're converting the base64 input to UTF-8 output.
  return (
    decipher.update(encryptedText, 'base64', 'utf8') + decipher.final('utf8')
  );
};
