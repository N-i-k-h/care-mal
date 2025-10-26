import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserRegister() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    petName: '',
    petType: 'dog'
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/user/register', formData);
      console.log('Registration successful:', res.data);
      navigate('/login');
    } catch (err) {
      // --- THIS IS THE NEW LINE YOU NEEDED TO ADD ---
      console.error("Registration Error:", err.response.data); 
      
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-200">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center text-green-500">Register</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'phoneNumber', 'email', 'password', 'petName'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                {field === 'phoneNumber' ? 'Phone Number' : field === 'petName' ? 'Pet Name' : field}
              </label>
              <input
                type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>
          ))}

          <div>
            <label htmlFor="petType" className="block text-sm font-medium text-gray-700">Pet Type</label>
            <select
              id="petType"
              name="petType"
              value={formData.petType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="cow">Cow</option>
              <option value="rabbit">Rabbit</option>
              <option value="bird">Bird</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-green-500 hover:text-green-700">Login</Link>
        </p>
        <Link to="/register-doctor" className="text-sm text-green-500 hover:text-green-700 text-center block">
          Register as Doctor
        </Link>
      </div>
    </div>
  );
}

export default UserRegister;
