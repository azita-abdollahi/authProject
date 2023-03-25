const crypto = require('crypto');
const fs = require('fs');

// Generate a new key pair
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 512,
  publicKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
  }
});

// Save the private key to a file
fs.writeFileSync('private.key', privateKey);

// Save the public key to a file
fs.writeFileSync('public.key', publicKey);

console.log('Key pair generated successfully.');
