import React, { useState, useEffect } from "react";

export default function GoogleContacts({ onImport }) {
  const [googleContacts, setGoogleContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Auto-refresh contacts every 30 seconds when enabled
  useEffect(() => {
    if (autoRefresh && isAuthorized) {
      const interval = setInterval(() => {
        fetchGoogleContacts();
      }, 30000); // 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, isAuthorized]);

  // Load Google API script
  const loadGoogleAPI = () => {
    return new Promise((resolve) => {
      if (window.gapi) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.onload = () => {
        window.gapi.load("client:auth2", resolve);
      };
      document.body.appendChild(script);
    });
  };

  // Initialize Google OAuth
  const initializeGoogleAPI = async () => {
    try {
      await loadGoogleAPI();
      
      // Check if we have real credentials
      const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
      
      console.log("API Key exists:", !!apiKey);
      console.log("Client ID exists:", !!clientId);
      console.log("API Key starts with:", apiKey ? apiKey.substring(0, 10) + "..." : "none");
      console.log("Client ID starts with:", clientId ? clientId.substring(0, 20) + "..." : "none");
      
      // Check if credentials are still placeholder values
      if (!apiKey || !clientId || 
          apiKey === "your_google_api_key_here" || 
          clientId === "your_google_client_id_here") {
        // Activate demo mode
        setError("Google API not configured. Using demo mode...");
        setTimeout(() => {
          setGoogleContacts([
            { 
              name: "John Doe", 
              phone: "9876543210", 
              email: "john@example.com",
              id: "demo1"
            },
            { 
              name: "Jane Smith", 
              phone: "9876543211", 
              email: "jane@example.com",
              id: "demo2"
            },
            { 
              name: "Mike Johnson", 
              phone: "9876543212", 
              email: "mike@example.com",
              id: "demo3"
            },
            { 
              name: "Sarah Williams", 
              phone: "9876543213", 
              email: "sarah@example.com",
              id: "demo4"
            },
            { 
              name: "David Brown", 
              phone: "9876543214", 
              email: "david@example.com",
              id: "demo5"
            },
          ]);
          setIsAuthorized(true);
          setIsLoading(false);
          setError("");
        }, 1500);
        return true;
      }
      
      console.log("Initializing Google API with real credentials...");
      
      await window.gapi.client.init({
        apiKey: apiKey,
        clientId: clientId,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/people/v1/rest"],
        scope: "https://www.googleapis.com/auth/contacts.readonly",
      });
      
      console.log("Google API initialized successfully");
      setIsAuthorized(true);
      return true;
    } catch (err) {
      console.error("Google API initialization failed:", err);
      setError(`Failed to initialize Google API: ${err.message}. Check your credentials in .env file.`);
      return false;
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Check if we have real credentials
      const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
      
      if (!apiKey || !clientId || 
          apiKey === "your_google_api_key_here" || 
          clientId === "your_google_client_id_here") {
        // Use demo mode
        console.log("Using demo mode - no real credentials");
        await initializeGoogleAPI();
        return;
      }

      console.log("Attempting Google sign-in with real credentials...");
      
      if (!window.gapi || !window.gapi.auth2) {
        console.log("Initializing Google API...");
        await initializeGoogleAPI();
      }

      const authInstance = window.gapi.auth2.getAuthInstance();
      console.log("Getting auth instance...");
      
      const user = await authInstance.signIn();
      console.log("Sign-in successful:", user.isSignedIn());
      
      if (user.isSignedIn()) {
        await fetchGoogleContacts();
      }
    } catch (err) {
      console.error("Sign in failed:", err);
      console.error("Error details:", {
        message: err.message,
        code: err.code,
        status: err.status,
        details: err.details
      });
      
      let errorMessage = "Sign in failed. ";
      if (err.message.includes("400")) {
        errorMessage += "This usually means your Google API credentials are incorrect or the OAuth consent screen is not properly configured. Please check your .env file and Google Cloud Console settings.";
      } else if (err.message.includes("403")) {
        errorMessage += "Access denied. Make sure you've added your email to the OAuth consent screen users list.";
      } else {
        errorMessage += `Error: ${err.message}`;
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Fetch contacts from Google
  const fetchGoogleContacts = async () => {
    try {
      setIsLoading(true);
      
      const response = await window.gapi.client.people.people.connections.list({
        resourceName: "people/me",
        pageSize: 100,
        personFields: "names,phoneNumbers,emailAddresses",
      });

      const contacts = response.result.connections || [];
      const formattedContacts = contacts
        .filter((contact) => contact.names && contact.names[0])
        .map((contact) => ({
          id: contact.resourceName,
          name: contact.names[0].displayName,
          phone: contact.phoneNumbers?.[0]?.value || "",
          email: contact.emailAddresses?.[0]?.value || "",
          googleContact: true,
        }));

      setGoogleContacts(formattedContacts);
      setLastRefresh(new Date());
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
      setError("Failed to fetch Google contacts");
      setIsLoading(false);
    }
  };

  // Manual refresh function
  const handleRefresh = async () => {
    if (isAuthorized) {
      await fetchGoogleContacts();
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      if (window.gapi && window.gapi.auth2) {
        const authInstance = window.gapi.auth2.getAuthInstance();
        await authInstance.signOut();
      }
      setIsAuthorized(false);
      setGoogleContacts([]);
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  // Import selected contacts
  const handleImport = (contact) => {
    if (onImport) {
      onImport({
        name: contact.name,
        mobile: contact.phone.replace(/\D/g, "").slice(-10),
        upi: `${contact.name.toLowerCase().replace(/\s+/g, "")}@upi`,
      });
    }
  };

  const isDemoMode = !process.env.REACT_APP_GOOGLE_API_KEY || !process.env.REACT_APP_GOOGLE_CLIENT_ID;

  return (
    <div className="space-y-4">
      {/* Demo Mode Indicator */}
      {isDemoMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-700 flex items-center gap-2">
            <span>⚠️</span>
            <span><strong>Demo Mode Active:</strong> Showing sample contacts. To use real Google Contacts, add your API credentials to .env file (see GOOGLE_SETUP.md)</span>
          </p>
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">📱</span>
            <span>Google Contacts {isDemoMode && "(Demo)"}</span>
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            {isDemoMode 
              ? "Click 'Connect Google' to view demo contacts" 
              : "Import contacts from your Google account"}
          </p>
          {lastRefresh && (
            <p className="text-xs text-green-600 mt-1">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isAuthorized && (
            <>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all font-semibold disabled:opacity-50 inline-flex items-center gap-2"
              >
                <span>🔄</span>
                <span>Refresh</span>
              </button>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-2 rounded-lg transition-all font-semibold inline-flex items-center gap-2 ${
                  autoRefresh 
                    ? "bg-green-50 text-green-600 hover:bg-green-100" 
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{autoRefresh ? "⏸️" : "▶️"}</span>
                <span>{autoRefresh ? "Auto" : "Manual"}</span>
              </button>
            </>
          )}
          
          {!isAuthorized ? (
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isLoading ? (
                "⏳ Connecting..."
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    <path fill="none" d="M1 1h22v22H1z"/>
                  </svg>
                  <span>Connect Google</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-semibold inline-flex items-center gap-2"
            >
              <span>🚪</span>
              <span>Disconnect</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3">
            <div className="animate-spin text-4xl">⚙️</div>
            <span className="text-gray-600">Loading contacts...</span>
          </div>
        </div>
      )}

      {/* Google Contacts List */}
      {isAuthorized && googleContacts.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 max-h-96 overflow-y-auto">
          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-700">
              📋 Select contacts to import ({googleContacts.length} found)
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {googleContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-3 hover:bg-gray-50 transition-colors group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{contact.name}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                      {contact.phone && (
                        <span className="flex items-center gap-1">
                          📱 {contact.phone}
                        </span>
                      )}
                      {contact.email && (
                        <span className="flex items-center gap-1">
                          ✉️ {contact.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleImport(contact)}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all text-sm font-semibold opacity-0 group-hover:opacity-100"
                >
                  Import
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {isAuthorized && googleContacts.length === 0 && !isLoading && (
        <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-gray-600 font-medium">No contacts found</p>
          <p className="text-sm text-gray-400 mt-1">No contacts in your Google account</p>
        </div>
      )}
    </div>
  );
}

