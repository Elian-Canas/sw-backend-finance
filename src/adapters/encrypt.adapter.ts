import * as bcrypt from 'bcrypt';

export interface EncryptAdapter {
  encrypt(password: string): Promise<string>;
}

export class EncryptBcryptAdapter implements EncryptAdapter {
  async encrypt(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
