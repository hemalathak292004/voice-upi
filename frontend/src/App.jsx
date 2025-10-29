import React, { useState, useEffect, useRef } from "react";
import Login from "./components/Login";
import TransactionList from "./components/TransactionList";
import Contacts from "./components/Contacts";
import Dashboard from "./components/Dashboard";
import UpiPay from "./components/UpiPay";
import { startListening, extractVoiceCommand, findMatchingContacts } from "./voiceLogic";

export default function App() {
  const quickPayRef = useRef(null);
  const [user, setUser] = useState(null);
  const [command, setCommand] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Voice command states
  const [pendingTransaction, setPendingTransaction] = useState(null);
  const [ambiguousContacts, setAmbiguousContacts] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAmbiguity, setShowAmbiguity] = useState(false);

  const loadData = () => {
    fetch("/api/getBalance").then(r => r.json()).then(d => setBalance(d.balance)).catch(() => {});
    fetch("/api/getTransactions").then(r => r.json()).then(d => setTransactions(d.transactions || [])).catch(() => {});
    fetch("/api/getContacts").then(r => r.json()).then(d => setContacts(d.contacts || [])).catch(() => {});
  };

  useEffect(() => {
    // Load user from localStorage if exists
    const savedUser = localStorage.getItem("userProfile");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (err) {
        console.error("Failed to load user profile");
      }
    }
    loadData();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setActiveTab("home"); // Auto-redirect to home after login
  };

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    setUser(null);
  };

  const processCommand = (text) => {
    // Extract command details
    const cmd = extractVoiceCommand(text);
    if (!cmd) {
      alert("❌ Could not understand. Try: 'Send 500 to Ramesh'");
      return;
    }

    const { amount, name } = cmd;

    // Find matching contacts using fuzzy matching
    const matches = findMatchingContacts(contacts, name);

    if (matches.length === 0) {
      alert(`❌ Contact '${name}' not found. Please add to contacts or try again.`);
      return;
    }

    // If multiple matches, show ambiguity resolution
    if (matches.length > 1) {
      setAmbiguousContacts(matches);
      setPendingTransaction({ amount, name });
      setShowAmbiguity(true);
      return;
    }

    // Single match found - show confirmation
    const contact = matches[0].contact;
    // Auto trigger Quick Pay with Razorpay if amount + contact available
    setActiveTab("quickpay");
    setTimeout(() => {
      quickPayRef.current?.presetAndPay?.({
        presetPa: contact.upi,
        presetPn: contact.name,
        presetAmount: amount,
        presetNote: `Voice pay to ${contact.name}`,
      });
    }, 50);
  };

  // Handle selected contact from ambiguity resolution
  const handleSelectedContact = (contact) => {
    setAmbiguousContacts([]);
    setShowAmbiguity(false);
    setPendingTransaction({ ...pendingTransaction, contact });
    setShowConfirmation(true);
  };

  // Execute the transaction
  const executeTransaction = () => {
    if (!pendingTransaction?.contact) return;

    const { amount, contact } = pendingTransaction;

    fetch("/api/sendMoney", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, receiverName: contact.name })
    })
      .then(async (r) => {
        if (!r.ok) {
          const e = await r.json().catch(() => ({}));
          throw new Error(e.error || "Payment failed");
        }
        return r.json();
      })
      .then((d) => {
        setBalance(d.balance);
        setTransactions((prev) => [d.transaction, ...prev]);
        alert(`✅ Sent ₹${amount} to ${contact.name}`);
        setShowConfirmation(false);
        setPendingTransaction(null);
      })
      .catch((e) => {
        alert(`❌ ${e.message}`);
        setShowConfirmation(false);
        setPendingTransaction(null);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg fixed top-0 left-0 right-0 z-40">
        <div className="px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-2xl">
                💳
              </div>
              <h1 className="text-2xl font-bold">Voice UPI Payment</h1>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-lg">
                    <span className="font-semibold">{user.name}</span>
                  </div>
                  <button
                    onClick={() => loadData()}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur"
                    title="Refresh"
                  >
                    🔄 Refresh
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur"
                    title="Logout"
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setActiveTab("login")}
                  className="px-6 py-2 bg-white text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all font-semibold shadow-lg"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-24 bottom-0 w-64 bg-white border-r border-gray-200 shadow-lg z-30 overflow-y-auto">
        <nav className="p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === "dashboard"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">📊</span>
              <span className="font-medium">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("home")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === "home"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">🏠</span>
              <span className="font-medium">Home</span>
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === "contacts"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">📇</span>
              <span className="font-medium">Contacts</span>
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === "transactions"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">📈</span>
              <span className="font-medium">History</span>
            </button>
            <button
              onClick={() => setActiveTab("quickpay")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === "quickpay"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">⚡</span>
              <span className="font-medium">Quick Pay</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pt-24 md:ml-64 px-6 py-8 pb-20 md:pb-8">
        {activeTab === "dashboard" && (
          <Dashboard onGetStarted={!user ? () => setActiveTab("login") : null} />
        )}

        {activeTab === "login" && (
          <div className="max-w-md mx-auto">
            <Login onLogin={handleLogin} />
          </div>
        )}

        {activeTab === "home" && (
          user ? (
          <div className="space-y-6">
            {/* User Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.upi}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Available Balance</p>
                  <p className="text-3xl font-bold text-gray-800">
                    ₹{balance === null ? '0' : balance.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Voice Command Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Send Money with Voice</h2>
              <p className="text-gray-600 mb-8">Click the microphone and say: "Send 500 to Ramesh"</p>
              
              <button
                onClick={() => startListening(setCommand, processCommand, () => {
                  console.log("Voice recognition completed");
                })}
                className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 rounded-full shadow-2xl hover:shadow-indigo-500/50 transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center mx-auto mb-6"
              >
                <span className="text-5xl">🎤</span>
              </button>
              
              {command && (
                <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-200 max-w-md mx-auto">
                  <p className="text-sm text-gray-600 mb-1">Voice Command:</p>
                  <p className="text-lg font-semibold text-indigo-600">{command}</p>
                </div>
              )}
            </div>

            {/* Transaction History Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Recent Transactions</h3>
                <button
                  onClick={() => setActiveTab("transactions")}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                >
                  View All →
                </button>
              </div>
              
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No transactions yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start by sending money via voice</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {transactions.slice(0, 5).map((tx) => {
                    const date = tx.date ? new Date(tx.date) : null;
                    const when = date ? date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '';
                    return (
                      <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">💸</div>
                          <div>
                            <p className="font-semibold text-gray-800">{tx.receiver || tx.name}</p>
                            <p className="text-xs text-gray-600">{when}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">₹{tx.amount.toLocaleString()}</p>
                          <p className="text-xs text-green-600">✓ Success</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="bg-white rounded-xl shadow-lg p-12">
                <div className="text-6xl mb-6">🔒</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Login Required</h2>
                <p className="text-gray-600 mb-8">
                  Please login to access payment features, manage contacts, and view transaction history.
                </p>
                <button
                  onClick={() => setActiveTab("login")}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-full hover:from-indigo-700 hover:to-indigo-600 transition-all transform hover:scale-105 font-semibold shadow-lg"
                >
                  Login / Sign Up
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === "contacts" && (
          user ? (
            <Contacts contacts={contacts} onRefresh={loadData} />
          ) : (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="bg-white rounded-xl shadow-lg p-12">
                <div className="text-6xl mb-6">🔒</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Login Required</h2>
                <p className="text-gray-600 mb-8">
                  Please login to manage your contacts.
                </p>
                <button
                  onClick={() => setActiveTab("login")}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-full hover:from-indigo-700 hover:to-indigo-600 transition-all transform hover:scale-105 font-semibold shadow-lg"
                >
                  Login / Sign Up
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === "transactions" && (
          user ? (
            <TransactionList transactions={transactions} />
          ) : (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="bg-white rounded-xl shadow-lg p-12">
                <div className="text-6xl mb-6">🔒</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Login Required</h2>
                <p className="text-gray-600 mb-8">
                  Please login to view your transaction history.
                </p>
                <button
                  onClick={() => setActiveTab("login")}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-full hover:from-indigo-700 hover:to-indigo-600 transition-all transform hover:scale-105 font-semibold shadow-lg"
                >
                  Login / Sign Up
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === "quickpay" && (
          user ? (
            <div className="max-w-xl mx-auto">
              <UpiPay ref={quickPayRef} />
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="bg-white rounded-xl shadow-lg p-12">
                <div className="text-6xl mb-6">🔒</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Login Required</h2>
                <p className="text-gray-600 mb-8">
                  Please login to access Quick UPI Pay.
                </p>
                <button
                  onClick={() => setActiveTab("login")}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-full hover:from-indigo-700 hover:to-indigo-600 transition-all transform hover:scale-105 font-semibold shadow-lg"
                >
                  Login / Sign Up
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-40">
        <div className="flex justify-around py-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center gap-1 px-3 py-2 ${
              activeTab === "dashboard" ? "text-indigo-600" : "text-gray-600"
            }`}
          >
            <span className="text-2xl">📊</span>
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 px-3 py-2 ${
              activeTab === "home" ? "text-indigo-600" : "text-gray-600"
            }`}
          >
            <span className="text-2xl">🏠</span>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => setActiveTab("contacts")}
            className={`flex flex-col items-center gap-1 px-3 py-2 ${
              activeTab === "contacts" ? "text-indigo-600" : "text-gray-600"
            }`}
          >
            <span className="text-2xl">📇</span>
            <span className="text-xs font-medium">Contacts</span>
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex flex-col items-center gap-1 px-3 py-2 ${
              activeTab === "transactions" ? "text-indigo-600" : "text-gray-600"
            }`}
          >
            <span className="text-2xl">📈</span>
            <span className="text-xs font-medium">History</span>
          </button>
          <button
            onClick={() => setActiveTab("quickpay")}
            className={`flex flex-col items-center gap-1 px-3 py-2 ${
              activeTab === "quickpay" ? "text-indigo-600" : "text-gray-600"
            }`}
          >
            <span className="text-2xl">⚡</span>
            <span className="text-xs font-medium">Quick Pay</span>
          </button>
        </div>
      </nav>

      {/* Ambiguity Resolution Dialog */}
      {showAmbiguity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <span className="text-3xl">🤔</span>
                <span>Multiple Contacts Found</span>
              </h2>
              <p className="text-gray-600 mt-2">
                Which contact did you mean? Found multiple matches for "{pendingTransaction?.name}".
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Amount: ₹{pendingTransaction?.amount}
              </p>
            </div>
            <div className="p-6 space-y-3">
              {ambiguousContacts.map((match, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectedContact(match.contact)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {match.contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{match.contact.name}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-600">📱 {match.contact.mobile}</span>
                          <span className="text-sm text-gray-600">💳 {match.contact.upi}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        {Math.round(match.similarity * 100)}% match
                      </div>
                      <div className="mt-2 text-indigo-600 font-semibold group-hover:text-indigo-700">
                        Select →
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              <button
                onClick={() => {
                  setShowAmbiguity(false);
                  setAmbiguousContacts([]);
                  setPendingTransaction(null);
                }}
                className="w-full p-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && pendingTransaction?.contact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <span className="text-3xl">💸</span>
                <span>Confirm Payment</span>
              </h2>
              <p className="text-gray-600 mt-2">Please verify the details before sending</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">₹{pendingTransaction.amount}</div>
                  <p className="text-gray-600">to</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">👤</span>
                    <div>
                      <p className="text-xs text-gray-600">Name</p>
                      <p className="font-bold text-gray-900">{pendingTransaction.contact.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📱</span>
                    <div>
                      <p className="text-xs text-gray-600">Phone Number</p>
                      <p className="font-bold text-gray-900">{pendingTransaction.contact.mobile}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💳</span>
                    <div>
                      <p className="text-xs text-gray-600">UPI ID</p>
                      <p className="font-bold text-gray-900">{pendingTransaction.contact.upi}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={executeTransaction}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-700 hover:to-green-600 transition-all font-semibold shadow-lg"
                >
                  ✓ Confirm and Send
                </button>
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setPendingTransaction(null);
                  }}
                  className="w-full px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
