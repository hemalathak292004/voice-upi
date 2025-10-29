import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [upi, setUpi] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateUPI = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/validateUPI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upi, mobile, name }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || "UPI validation failed");
        setLoading(false);
        return false;
      }
      
      // Create user profile
      const userProfile = {
        name,
        mobile,
        upi,
        createdAt: Date.now(),
      };
      
      // Store user profile
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      
      onLogin(userProfile);
      setLoading(false);
      return true;
    } catch (err) {
      setError("Failed to validate UPI ID");
      setLoading(false);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !mobile || !upi) {
      setError("Please fill in all fields!");
      return;
    }
    
    // Validate mobile number (10 digits)
    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
      setError("Mobile number must be exactly 10 digits!");
      return;
    }
    
    // Validate UPI format
    const upiPattern = /^[\w\-.]+@[\w]+$/;
    if (!upiPattern.test(upi)) {
      setError("Invalid UPI ID format. Use format: name@upi");
      return;
    }
    
    await validateUPI();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Centered Login Card */}
      <div className="w-full max-w-md p-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full mb-4">
              <span className="text-3xl">💳</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Voice UPI Payment</h1>
            <p className="text-gray-600">
              Sign up / Login to your account
            </p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
              <input
                type="text"
                placeholder="10 digit mobile number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                maxLength={10}
                disabled={loading}
              />
              {mobile && mobile.length !== 10 && (
                <p className="text-red-500 text-xs mt-2">⚠️ Must be exactly 10 digits</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
              <input
                type="text"
                placeholder="yourname@upi"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Format: name@upi</p>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-full hover:from-indigo-700 hover:to-indigo-600 transition-all transform hover:scale-105 font-semibold shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Validating..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
