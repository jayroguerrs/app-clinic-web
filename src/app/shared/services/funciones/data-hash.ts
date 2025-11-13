// crypto.util.ts
export async function deriveKey(secret: string, saltBase64: string, iterations = 100000) {
  const enc = new TextEncoder();
  const secretKeyData = enc.encode(secret);
  const salt = Uint8Array.from(atob(saltBase64), c => c.charCodeAt(0));

  const baseKey = await crypto.subtle.importKey(
    'raw',
    secretKeyData,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  return derivedKey; // CryptoKey (AES-GCM 256)
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export async function encryptPasswordAES(password: string, secretKey: string, saltBase64: string) {
  const enc = new TextEncoder();
  const key = await deriveKey(secretKey, saltBase64);

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(password)
  );

  const combined = new Uint8Array(iv.byteLength + cipherBuffer.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(cipherBuffer), iv.byteLength);

  return arrayBufferToBase64(combined.buffer);
}
