// hash-password.js
import crypto from 'crypto';

const password = process.argv[2];
if (!password) {
  console.error('Usage: node hash-password.js <your-password>');
  process.exit(1);
}
const hash = crypto.createHash('sha256').update(password).digest('hex');
console.log(hash);
// # Replace S³cureP@ssw0rd! with your actual password (don’t include trailing newline)
// echo -n 'S³cureP@ssw0rd!' | sha256sum