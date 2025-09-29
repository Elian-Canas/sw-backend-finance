import * as bcrypt from 'bcrypt';

export interface EncryptAdapter {
  encrypt(password: string): Promise<string>;
  compareSync(password: string, hash: string): boolean;
}

export class EncryptBcryptAdapter implements EncryptAdapter {
  async encrypt(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  compareSync(password: string, hash: string): boolean {
    let result = bcrypt.compareSync(password, hash);

    return result;
  }
}
