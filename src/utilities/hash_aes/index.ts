import * as CryptoJS from "crypto-js";

/**
 * The function `EncryptBasic` encrypts a given text using AES encryption with a secret key.
 * @param {string} text - The `text` parameter is the string that you want to encrypt using the AES
 * encryption algorithm.
 * @param {string} secretKey - The `secretKey` parameter is a string that serves as the encryption key
 * used to encrypt the `text` parameter using the AES encryption algorithm. It is essential for
 * encrypting and decrypting the text securely.
 * @returns The function `EncryptBasic` returns the encrypted text generated by encrypting the input
 * `text` using the AES encryption algorithm with the provided `secretKey`.
 */
export function EncryptBasic(text: string, secretKey: string): string {
  const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
  return encrypted;
}

/**
 * The function DecryptBasic decrypts an encrypted text using a secret key in TypeScript.
 * @param {string} encryptedText - The `encryptedText` parameter is the text that has been encrypted
 * using the AES encryption algorithm.
 * @param {string} secretKey - The `secretKey` parameter is a string that serves as the secret key used
 * for decrypting the `encryptedText`. It is a piece of confidential information that is known only to
 * authorized parties and is used in the decryption process to retrieve the original text.
 * @returns The function DecryptBasic is returning the decrypted text as a string.
 */
export function DecryptBasic(encryptedText: string, secretKey: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}
/**
 * The Encrypt function takes a text and a secret key, encrypts the text using AES encryption, and
 * returns the encrypted text encoded in base64 URL format.
 * @name {string} Encrypted_with_url_decode
 * @param {string} text - The `text` parameter is the string that you want to encrypt using the AES
 * encryption algorithm with the provided `secretKey`.
 * @param {string} secretKey - The `secretKey` parameter is a string that is used as a secret key for
 * encrypting the `text` parameter using the AES encryption algorithm. It is important to keep the
 * `secretKey` secure and confidential to ensure the security of the encryption process.
 * @returns The function `Encrypt` takes a `text` string and a `secretKey` string as input parameters.
 * It encrypts the `text` using the `secretKey` with AES encryption and then encodes the result in
 * base64 URL format before returning it.
 */
export function Encrypt(text: string, secretKey: string): string {
  const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
  return base64UrlEncode(encrypted);
}

/**
 * The function Decrypt takes an encrypted text and a secret key, decodes the text using base64 and
 * decrypts it using AES algorithm to return the original text.
 * @name {string} Decrypted_with_url_decode
 * @param {string} encryptedText - The `encryptedText` parameter is the text that has been encrypted
 * using a secret key and needs to be decrypted.
 * @param {string} secretKey - The `secretKey` parameter is a string that serves as the secret key used
 * for decrypting the `encryptedText`. It is a piece of confidential information that is known only to
 * authorized parties and is used in the decryption process to recover the original plaintext data.
 * @returns The function Decrypt is returning the decrypted text in UTF-8 format.
 */
export function Decrypt(encryptedText: string, secretKey: string): string {
  const base64 = base64UrlDecode(encryptedText);
  const bytes = CryptoJS.AES.decrypt(base64, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

function base64UrlEncode(str: string): string {
  return CryptoJS.enc.Base64.parse(str)
    .toString(CryptoJS.enc.Base64)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad) {
    base64 += "=".repeat(4 - pad);
  }
  return base64;
}
