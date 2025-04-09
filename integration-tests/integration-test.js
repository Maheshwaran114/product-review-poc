const fetch = require('node-fetch');

async function testBackendHealth() {
  try {
    const response = await fetch('http://localhost:3001/health');
    if (!response.ok) {
      throw new Error(`Backend health check failed: ${response.status} ${response.statusText}`);
    }
    console.log('Backend health check passed.');
  } catch (error) {
    console.error('Error during backend health check:', error);
    process.exit(1);
  }
}

async function testProductList() {
  try {
    // Update the URL to hit the backend API endpoint that returns product data.
    const response = await fetch('http://localhost:3001/api/products');
    if (!response.ok) {
      throw new Error(`Product list endpoint failed: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Product list endpoint response:', data);
  } catch (error) {
    console.error('Error during product list test:', error);
    process.exit(1);
  }
}

async function runTests() {
  await testBackendHealth();
  await testProductList();
  console.log('Integration tests passed.');
}

runTests();
