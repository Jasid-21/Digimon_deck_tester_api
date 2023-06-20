export function random_code(num = 10) {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = lower.toUpperCase();
  const numbers = '0123456789';
  const total = lower + upper + numbers;

  let code = '';
  for (let i = 0; i < num; i++) {
    const c = total[Math.floor(Math.random() * (total.length - 1))];
    code += c;
  }

  return code;
}
