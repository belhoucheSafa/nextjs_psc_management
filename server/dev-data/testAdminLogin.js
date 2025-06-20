const axios = require('axios');

const testAdminLogin = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/v1/users/login', {
      email: 'admin@psc.tn',
      password: 'Admin@123'
    });

    console.log('Login successful!');
    console.log('Token:', response.data.token);
    console.log('User:', response.data.data.user);
  } catch (error) {
    console.log('Login failed:', error.response?.data || error.message);
  }
};

testAdminLogin(); 