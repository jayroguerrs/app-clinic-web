import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IntentosConfirmarSupervisorService {
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();
  private storageKey = btoa('attemptsSafe');

  // Deriva una clave AES-GCM desde token y usuario (PBKDF2)
  private async deriveKeyFromToken(token: string, userId: string, saltBytes: Uint8Array) {
    const raw = this.encoder.encode(`${token}:${userId}`);
    const baseKey = await crypto.subtle.importKey('raw', raw, { name: 'PBKDF2' }, false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: saltBytes, iterations: 100_000, hash: 'SHA-256' },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  private toBase64(buf: ArrayBuffer) {
    const bytes = new Uint8Array(buf);
    let str = '';
    for (let i = 0; i < bytes.byteLength; i++) str += String.fromCharCode(bytes[i]);
    return btoa(str);
  }

  private fromBase64(b64: string) {
    const str = atob(b64);
    const bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
    return bytes.buffer;
  }

  private async encryptNumberWithKey(key: CryptoKey, n: number) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plaintext = this.encoder.encode(String(n));
    const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);
    return {
      i: this.toBase64(iv.buffer),
      c: this.toBase64(cipher)
    };
  }

  private async decryptNumberWithKey(key: CryptoKey, ivB64: string, cipherB64: string): Promise<number | null> {
    try {
      const iv = new Uint8Array(this.fromBase64(ivB64));
      const cipherBuf = this.fromBase64(cipherB64);
      const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipherBuf);
      const text = this.decoder.decode(plain);
      return parseInt(text, 10);
    } catch (e) {
      console.error('decryptNumberWithKey failed', e);
      return null;
    }
  }

  // Guarda el payload (salt + iv + cipher) en sessionStorage
  private savePayload(saltB64: string, ivB64: string, cipherB64: string) {
    const payload = JSON.stringify({ s: saltB64, i: ivB64, c: cipherB64 });
    sessionStorage.setItem(this.storageKey, payload);
  }

  // Recupera el payload (o null)
  private getPayload(): { s: string; i: string; c: string } | null {
    const raw = sessionStorage.getItem(this.storageKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Payload corrupto en sessionStorage, eliminando.', e);
      sessionStorage.removeItem(this.storageKey);
      return null;
    }
  }

  // Public: obtiene el número (o null)
  public async getAttempts(token: string, userId: string): Promise<number | null> {
    const payload = this.getPayload();
    if (!payload) return null;
    // reconstruir key usando salt del payload
    const saltBytes = new Uint8Array(this.fromBase64(payload.s));
    const key = await this.deriveKeyFromToken(token, userId, saltBytes);
    return await this.decryptNumberWithKey(key, payload.i, payload.c);
  }

  // Public: setea el número (reemplaza)
  public async setAttempts(token: string, userId: string, n: number): Promise<void> {
    // generar nuevo salt aleatorio y derivar key

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await this.deriveKeyFromToken(token, userId, salt);
    const enc = await this.encryptNumberWithKey(key, n);
    this.savePayload(this.toBase64(salt.buffer), enc.i, enc.c);
  }

  // Public: incrementa seguro (lee, suma y guarda)
  public async incrementAttempts(userId: string): Promise<number> {
    const userData = JSON.parse(localStorage.getItem('usersKey')) || {};
    const { token } = userData;

    const current = (await this.getAttempts(token ? token : '', userId)) ?? 0;
    const next = current + 1;
    await this.setAttempts(token ? token : '', userId, next);
    return next;
  }

  // Public: reset (borrar)
  public resetAttempts() {
    sessionStorage.removeItem(this.storageKey);
  }
}
