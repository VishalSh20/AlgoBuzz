'use client';

import { useState } from 'react';

export default function Page() {
  const [formData, setFormData] = useState({
    problemId: '',
    code: '',
    timeComplexity: '',
    spaceComplexity: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState({ message: '', type: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.problemId || !formData.code.trim() || !formData.timeComplexity.trim() || !formData.spaceComplexity.trim()) {
      setResponse({ message: 'Please fill in all fields.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setResponse({ message: '', type: '' });

    try {
      const payload = {
        problemId: parseInt(formData.problemId),
        code: formData.code.trim(),
        language: 'CPP',
        timeComplexity: formData.timeComplexity.trim(),
        spaceComplexity: formData.spaceComplexity.trim()
      };

      const res = await fetch('/api/solution/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (res.ok) {
        setResponse({ 
          message: `✅ Success! Solution added successfully for Problem ID: ${payload.problemId}`, 
          type: 'success' 
        });
        // Reset form
        setFormData({
          problemId: '',
          code: '',
          timeComplexity: '',
          spaceComplexity: ''
        });
        // Auto-hide success message after 5 seconds
        setTimeout(() => setResponse({ message: '', type: '' }), 5000);
      } else {
        setResponse({ 
          message: `❌ Error: ${result.message || 'Failed to submit solution'}`, 
          type: 'error' 
        });
      }

    } catch (error) {
      console.error('Submission error:', error);
      setResponse({ 
        message: `❌ Network Error: ${error.message}`, 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-800 p-5">
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🚀 Solution Submitter
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Problem ID */}
          <div>
            <label htmlFor="problemId" className="block text-lg font-semibold text-gray-800 mb-2">
              Problem ID
            </label>
            <input
              type="number"
              id="problemId"
              name="problemId"
              value={formData.problemId}
              onChange={handleInputChange}
              required
              min="1"
              placeholder="Enter problem ID (e.g., 1, 2, 3...)"
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 focus:-translate-y-1"
            />
            <p className="text-sm text-gray-600 mt-2 italic">The unique identifier for the problem</p>
          </div>

          {/* Code */}
          <div>
            <label htmlFor="code" className="block text-lg font-semibold text-gray-800 mb-2">
              Solution Code (C++)
            </label>
            <textarea
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              required
              rows={15}
              placeholder="Paste your C++ solution here..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-sm font-mono leading-relaxed focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 focus:-translate-y-1 resize-y"
            />
            <p className="text-sm text-gray-600 mt-2 italic">Complete C++ solution including class definition</p>
            <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-700 font-mono">
                <strong>Example format:</strong><br/>
                class Solution &#123;<br/>
                public:<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;vector&lt;int&gt; twoSum(vector&lt;int&gt;&amp; nums, int target) &#123;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Your solution here<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
                &#125;;
              </p>
            </div>
          </div>

          {/* Complexity Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="timeComplexity" className="block text-lg font-semibold text-gray-800 mb-2">
                Time Complexity
              </label>
              <input
                type="text"
                id="timeComplexity"
                name="timeComplexity"
                value={formData.timeComplexity}
                onChange={handleInputChange}
                required
                placeholder="e.g., O(n), O(log n), O(n²)"
                className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 focus:-translate-y-1"
              />
              <p className="text-sm text-gray-600 mt-2 italic">Big O notation for time</p>
            </div>

            <div>
              <label htmlFor="spaceComplexity" className="block text-lg font-semibold text-gray-800 mb-2">
                Space Complexity
              </label>
              <input
                type="text"
                id="spaceComplexity"
                name="spaceComplexity"
                value={formData.spaceComplexity}
                onChange={handleInputChange}
                required
                placeholder="e.g., O(1), O(n), O(log n)"
                className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 focus:-translate-y-1"
              />
              <p className="text-sm text-gray-600 mt-2 italic">Big O notation for space</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-semibold py-4 px-8 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Submitting...
              </div>
            ) : (
              'Submit Solution'
            )}
          </button>
        </form>

        {/* Response Section */}
        {response.message && (
          <div className={`mt-8 p-5 rounded-xl border-l-4 ${
            response.type === 'success' 
              ? 'bg-green-50 border-green-500 text-green-800' 
              : 'bg-red-50 border-red-500 text-red-800'
          }`}>
            <p className="font-medium">{response.message}</p>
          </div>
        )}

        {/* Keyboard Shortcut Hint */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            💡 <strong>Pro tip:</strong> Press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl + Enter</kbd> to submit quickly
          </p>
        </div>
      </div>
    </div>
  );
}