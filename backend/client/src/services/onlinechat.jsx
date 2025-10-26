import React, { useState, useRef, useEffect } from 'react';
import { FiUpload, FiSend } from 'react-icons/fi';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation

function OnlineChat() {
  const [image, setImage] = useState(null);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState([]);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [retryTime, setRetryTime] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError('No file selected');
      return;
    }
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Only JPG/JPEG and PNG images are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadstart = () => {
      setIsLoading(true);
      setError(null);
    };
    reader.onload = (event) => {
      setImage(event.target.result);
      setIsLoading(false);
      setQuestion("What are possible issues visible in my pet's injury?");
    };
    reader.onerror = () => {
      setError('Failed to read image file');
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImageWithAI = async (imageDataUrl, prompt) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login first');
      }

      const response = await axios.post(
        'http://localhost:5000/api/ai/analyze',
        {
          image: imageDataUrl,
          prompt: prompt
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data || response.data.status !== 200) {
        throw new Error(response.data?.error || 'Invalid response from server');
      }

      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (retryTime > Date.now()) {
      setError(`Please wait ${Math.ceil((retryTime - Date.now()) / 1000)} seconds before trying again`);
      return;
    }
    if (!isLoggedIn) {
      setError('Please login to use this feature');
      return;
    }
    if (!image) {
      setError('Please upload an image');
      return;
    }
    if (!question.trim() || question.length < 10) {
      setError('Please enter a valid question (at least 10 characters)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await analyzeImageWithAI(image, question);

      if (response?.status === 429) {
        setRetryTime(Date.now() + 60000);
        setError(response.message || 'Free tier limit reached. Please wait a minute.');
        return;
      }

      setAnalysisResult(
        typeof response.analysis === 'string' && response.analysis.trim()
          ? response.analysis.split(/(?<=[.?!])\s+/)
          : ['No meaningful analysis could be generated. Try rephrasing the question.']
      );
    } catch (err) {
      let errorMessage = err.response?.data?.error || err.message || 'Failed to analyze image';
      if (err.response?.status === 404) {
        errorMessage = 'The AI model endpoint was not found. Please check your backend or model ID.';
      } else if (err.response?.status === 500) {
        errorMessage = 'The AI failed to process the image. Try again later or change the question.';
      } else if (err.message.includes('token') || err.message.includes('auth') || err.message.includes('login')) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        errorMessage = (
          <span>
            Session expired. Please <Link to="/login">login again</Link>.
          </span>
        );
      } else if (err.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      }
      setError(errorMessage);
    } finally {
      await new Promise((res) => setTimeout(res, 300));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pet Health AI Analyzer</h1>
          <p className="text-gray-600">
            Upload an image of your pet and get health advice
          </p>
          {!isLoggedIn && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-yellow-700">You need to login to use this feature</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          {!image ? (
            <div
              className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition ${
                isLoggedIn ? 'cursor-pointer hover:border-blue-400' : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={() => isLoggedIn && fileInputRef.current.click()}
            >
              <FiUpload className="mx-auto text-gray-400 text-2xl mb-3" />
              <p className="text-gray-600">Click to upload an image</p>
              <p className="text-sm text-gray-400 mt-1">Supports JPG, PNG (Max 5MB)</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg, image/png"
                className="hidden"
                disabled={!isLoggedIn}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <img
                  src={image}
                  alt="Uploaded preview"
                  className="max-h-64 rounded-lg border border-gray-200 object-contain"
                />
                <button
                  onClick={() => {
                    setImage(null);
                    setAnalysisResult([]);
                    setError(null);
                  }}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition"
                  aria-label="Remove image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => fileInputRef.current.click()}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                disabled={!isLoggedIn}
              >
                Change Image
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
            Ask about your pet's health
          </label>
          <div className="flex rounded-md shadow-sm">
            <input
              type="text"
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={`flex-1 min-w-0 block w-full px-4 py-3 rounded-l-md border ${
                !isLoggedIn ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Example: What's wrong with my pet's leg?"
              disabled={!image || isLoading || !isLoggedIn}
              minLength={10}
              maxLength={200}
              required
            />
            <button
              type="submit"
              disabled={!image || isLoading || !isLoggedIn}
              className={`inline-flex items-center px-4 py-3 border border-l-0 rounded-r-md text-sm font-medium ${
                !image || !isLoggedIn
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <FiSend className="mr-2" />
                  Ask
                </>
              )}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {question.length}/200 characters
          </p>
        </form>

        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Analysis Results</h2>
          <div className="min-h-32">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p>Analyzing your image...</p>
              </div>
            ) : analysisResult.length > 0 ? (
              <div className="prose prose-sm max-w-none">
                <h3 className="text-blue-600">Health Assessment:</h3>
                <ul className="list-disc pl-5 space-y-2 bg-blue-50 p-4 rounded-lg">
                  {analysisResult.map((item, index) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
                {analysisResult.length === 1 && (
                  <p className="text-gray-600 mt-4">{analysisResult[0]}</p>
                )}
                <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <p className="text-sm text-yellow-700">
                    <strong>Important:</strong> This is AI-generated advice only. For serious conditions, please consult a veterinarian immediately.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-400">
                <p>Analysis results will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnlineChat;
