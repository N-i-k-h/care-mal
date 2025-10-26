import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function DoctorRegister() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    specialization: '',
    licenseNumber: ''
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
      // --- THIS LINE IS NOW FIXED ---
      const res = await axios.post('/api/auth/doctor/register', formData);
      console.log('Doctor registration success:', res.data);
      navigate('/doctorlogin');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-200">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center text-green-500">Doctor Register</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'phoneNumber', 'email', 'password', 'specialization', 'licenseNumber'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                {field === 'phoneNumber' ? 'Phone Number' : field === 'licenseNumber' ? 'License Number' : field}
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

          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/doctorlogin" className="text-green-500 hover:text-green-700">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default DoctorRegister;