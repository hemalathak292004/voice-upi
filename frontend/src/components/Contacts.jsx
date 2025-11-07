import React, { useState } from "react";
import GoogleContacts from "./GoogleContacts";
import { API_BASE_URL } from "../config/api";

export default function Contacts({ contacts, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [upi, setUpi] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [validatingUPI, setValidatingUPI] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [showGoogleContacts, setShowGoogleContacts] = useState(false);
  const [verifyingContacts, setVerifyingContacts] = useState({}); // Track which contacts are being verified
  const [verificationResults, setVerificationResults] = useState({}); // Store verification results

  const validateContactUPI = async () => {
    setValidatingUPI(true);
    setValidationError("");
    
    try {
      // Validate UPI format
      const upiPattern = /^[\w\-.]+@[\w]+$/;
      if (!upiPattern.test(upi)) {
        setValidationError("Invalid UPI ID format. Use format: name@upi");
        setValidatingUPI(false);
        return false;
      }
      
      const res = await fetch(`${API_BASE_URL}/api/validateContactUPI`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobile, upi }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setValidationError(data.error || "UPI ID is not valid");
        setValidatingUPI(false);
        return false;
      }
      
      setValidatingUPI(false);
      return true;
    } catch (e) {
      setValidationError("Failed to validate UPI ID");
      setValidatingUPI(false);
      return false;
    }
  };

  const handleAdd = async () => {
    if (!name || !mobile || !upi) {
      alert("Please fill all fields");
      return;
    }
    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
      alert("Mobile number must be exactly 10 digits");
      return;
    }

    // Validate UPI before adding
    const isValid = await validateContactUPI();
    if (!isValid) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/addContact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobile, upi }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add contact");
      
      alert(`✅ Contact ${name} added successfully`);
      setName("");
      setMobile("");
      setUpi("");
      setValidationError("");
      setShowForm(false);
      onRefresh();
    } catch (e) {
      alert(`❌ ${e.message}`);
    }
  };

  const handleDelete = async (contactName) => {
    if (!window.confirm(`Delete contact ${contactName}?`)) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/deleteContact/${encodeURIComponent(contactName)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      
      alert(`✅ Contact ${contactName} deleted`);
      onRefresh();
    } catch (e) {
      alert(`❌ ${e.message}`);
    }
  };

  // Verify contact UPI and mobile linkage
  const handleVerifyContact = async (contact) => {
    const contactKey = `${contact.name}-${contact.mobile}`;
    
    setVerifyingContacts(prev => ({
      ...prev,
      [contactKey]: true
    }));

    try {
      const res = await fetch(`${API_BASE_URL}/api/validateContactUPI`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: contact.name, 
          mobile: contact.mobile, 
          upi: contact.upi 
        }),
      });
      
      const data = await res.json();
      
      setVerificationResults(prev => ({
        ...prev,
        [contactKey]: {
          isValid: res.ok,
          message: res.ok ? "Valid UPI-Mobile linkage" : data.error || "Invalid linkage",
          timestamp: new Date().toLocaleTimeString()
        }
      }));
      
    } catch (e) {
      setVerificationResults(prev => ({
        ...prev,
        [contactKey]: {
          isValid: false,
          message: "Verification failed",
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } finally {
      setVerifyingContacts(prev => ({
        ...prev,
        [contactKey]: false
      }));
    }
  };

  // Handle import from Google Contacts
  const handleGoogleImport = async (contactData) => {
    // Set form values and show form
    setName(contactData.name);
    setMobile(contactData.mobile);
    setUpi(contactData.upi);
    setShowForm(true);
    setShowGoogleContacts(false);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Show alert
    alert(`📥 Contact "${contactData.name}" imported! Please review and click "Add Contact" to complete.`);
  };

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.mobile.includes(searchQuery) ||
      contact.upi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Contacts</h3>
          <p className="text-sm text-gray-600 mt-1">Manage your payment contacts</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-full hover:from-indigo-700 hover:to-indigo-600 transition-all font-semibold shadow-lg inline-flex items-center gap-2"
        >
          {showForm ? (
            <>
              <span>✕</span>
              <span>Cancel</span>
            </>
          ) : (
            <>
              <span>+</span>
              <span>Add Contact</span>
            </>
          )}
        </button>
      </div>

      {/* Add Contact Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="font-semibold text-gray-800 mb-4">New Contact Details</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                placeholder="Enter contact name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
              <input
                type="text"
                placeholder="10 digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                maxLength={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
              {mobile && mobile.length !== 10 && (
                <p className="text-red-500 text-xs mt-2">⚠️ Must be exactly 10 digits</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">UPI ID</label>
              <input
                type="text"
                placeholder="contactname@upi"
                value={upi}
                onChange={(e) => {
                  setUpi(e.target.value);
                  setValidationError(""); // Clear error when typing
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                disabled={validatingUPI}
              />
              {validationError && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{validationError}</span>
                  </p>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Format: name@upi</p>
            </div>
            <button
              onClick={handleAdd}
              disabled={validatingUPI}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {validatingUPI ? "Validating UPI..." : "Add Contact"}
            </button>
          </div>
        </div>
      )}

      {/* Google Contacts Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">📱</span>
              <span>Import from Google Contacts</span>
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              Connect your Google account to import contacts automatically
            </p>
          </div>
          <button
            onClick={() => setShowGoogleContacts(!showGoogleContacts)}
            className="px-5 py-2.5 bg-white border-2 border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-semibold shadow-sm inline-flex items-center gap-2"
          >
            {showGoogleContacts ? "Hide" : "Import Now"}
          </button>
        </div>
        
        {showGoogleContacts && (
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <GoogleContacts onImport={handleGoogleImport} />
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Search by name, mobile, or UPI ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <span className="text-xl">🔍</span>
          </div>
        </div>
        {searchQuery && (
          <p className="text-sm text-gray-500 mt-2">
            {filteredContacts.length} contact(s) found
          </p>
        )}
      </div>

      {/* Contacts List */}
      <div className="bg-white rounded-xl shadow-lg">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📇</div>
            <p className="text-gray-500 font-medium">No contacts yet</p>
            <p className="text-sm text-gray-400 mt-1">Add your first contact to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredContacts.map((contact) => {
              const contactKey = `${contact.name}-${contact.mobile}`;
              const isVerifying = verifyingContacts[contactKey];
              const verificationResult = verificationResults[contactKey];
              
              return (
                <div
                  key={contact.name}
                  className="p-5 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">{contact.name}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <span>📱</span>
                            <span>{contact.mobile}</span>
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <span>💳</span>
                            <span>{contact.upi}</span>
                          </p>
                        </div>
                        {/* Verification Status */}
                        {verificationResult && (
                          <div className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                            verificationResult.isValid 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            <span>{verificationResult.isValid ? '✅' : '❌'}</span>
                            <span>{verificationResult.message}</span>
                            <span className="text-gray-500">({verificationResult.timestamp})</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVerifyContact(contact)}
                        disabled={isVerifying}
                        className={`px-4 py-2 rounded-xl transition-all text-sm font-semibold ${
                          isVerifying
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }`}
                      >
                        {isVerifying ? (
                          <>
                            <span className="animate-spin">⏳</span>
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <span>🔍</span>
                            <span>Verify</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(contact.name)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all text-sm font-semibold opacity-0 group-hover:opacity-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
