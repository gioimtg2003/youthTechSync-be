import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

@Injectable()
export class CryptoService {
  private readonly CRYPTO_ENCRYPTION_KEY = process.env.CRYPTO_ENCRYPTION_KEY; // Must be 256 bits (32 characters)
  private readonly IV_LENGTH = 16; // For AES, this is always 16
  private readonly ENCRYPTION_ALGORITHM = 'aes-256-cbc';
  private readonly ENCODING = 'hex';
  private readonly SPLIT_KEY = '-';

  private readonly SALT_ROUNDS = Number(process.env.SALT_ROUNDS);

  generateToken() {
    return crypto.randomBytes(this.IV_LENGTH).toString(this.ENCODING);
  }

  encrypt(text: string, key?: string): string {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(
      this.ENCRYPTION_ALGORITHM,
      Buffer.from(key || this.CRYPTO_ENCRYPTION_KEY),
      iv,
    );
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return (
      iv.toString(this.ENCODING) +
      this.SPLIT_KEY +
      encrypted.toString(this.ENCODING)
    );
  }

  decrypt(text: string, key?: string): string {
    const textParts = text.split(this.SPLIT_KEY);
    const iv = Buffer.from(textParts.shift(), this.ENCODING);
    const encryptedText = Buffer.from(textParts.join(':'), this.ENCODING);
    const decipher = crypto.createDecipheriv(
      this.ENCRYPTION_ALGORITHM,
      Buffer.from(key || this.CRYPTO_ENCRYPTION_KEY),
      iv,
    );
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }

  hash(text: string): Promise<string> {
    return bcrypt.hash(text, this.SALT_ROUNDS);
  }

  hash256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  compareHash256(data: string, hash: string): boolean {
    return this.hash256(data) === hash;
  }

  compareHash(raw: string, hash: string): Promise<boolean> {
    return bcrypt.compare(raw, hash);
  }

  md5(text: string): string {
    return crypto.createHash('md5').update(text).digest('hex');
  }

  decryptRsa(text: string, privateKey?: string): string {
    const buffer = Buffer.from(text, 'base64');
    const decrypted = crypto.privateDecrypt(
      privateKey ?? process.env.SERVER_PRIVATE_KEY,
      buffer,
    );

    return decrypted.toString('utf8');
  }
}
