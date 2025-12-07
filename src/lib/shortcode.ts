const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
const CODE_LENGTH = 8;

export function generateShortCode(): string {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

export function isValidShortCode(code: string): boolean {
  if (code.length !== CODE_LENGTH) return false;
  for (const char of code) {
    if (!ALPHABET.includes(char)) return false;
  }
  return true;
}
