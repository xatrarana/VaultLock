export class CryptoWrapper {
  private static algorithm = "AES-GCM";
  private static keyLength = 256;
  private static ivLength = 12;
  private static saltLength = 16;

  /**
   * Generate a random salt (16 bytes)
   */
  static generateSalt(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(this.saltLength));
  }

  /**
   * Generate a random IV (12 bytes)
   */
  static generateIV(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(this.ivLength));
  }

  /**
   * Derive a key from a password and salt
   */
  static async deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);

    const passwordKey = await crypto.subtle.importKey(
      "raw",
      passwordBuffer,
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    return await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100_000,
        hash: "SHA-256",
      },
      passwordKey,
      { name: this.algorithm, length: this.keyLength },
      false,
      ["encrypt", "decrypt"]
    );
  }

  /**
   * Encrypt data using AES-GCM
   */
  static async encrypt(data: string, password: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const salt = this.generateSalt();
    const iv = this.generateIV();
    const key = await this.deriveKeyFromPassword(password, salt);

    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: this.algorithm, iv },
      key,
      dataBuffer
    );

    // Combine salt + iv + encrypted data into one buffer
    const combined = new Uint8Array(salt.length + iv.length + encryptedBuffer.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encryptedBuffer), salt.length + iv.length);

    return btoa(String.fromCharCode(...combined)); // Base64 string
  }

  /**
   * Decrypt data using AES-GCM
   */
  static async decrypt(encryptedData: string, password: string): Promise<string> {
    try {
      const combined = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));
      const salt = combined.slice(0, this.saltLength);
      const iv = combined.slice(this.saltLength, this.saltLength + this.ivLength);
      const encrypted = combined.slice(this.saltLength + this.ivLength);

      const key = await this.deriveKeyFromPassword(password, salt);

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: this.algorithm, iv },
        key,
        encrypted
      );

      return new TextDecoder().decode(decryptedBuffer);
    } catch (err) {
      console.error("Decryption failed:", err);
      throw new Error("Failed to decrypt data");
    }
  }
}
