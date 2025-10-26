require('dotenv').config();

console.log('Environment Variables Test');
console.log('-------------------------');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MISTRAL_API_KEY exists:', !!process.env.MISTRAL_API_KEY);
console.log('First 5 chars:', process.env.MISTRAL_API_KEY?.slice(0, 5) + '...');