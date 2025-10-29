import React from "react";

export default function Dashboard({ onGetStarted }) {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur rounded-full mb-6">
            <span className="text-5xl">🎤</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Voice UPI Payment System</h1>
          <p className="text-xl text-indigo-100 mb-6">
            Send money using just your voice - Fast, Secure, and Effortless
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-full">
              <span className="font-semibold">🔊 Voice Recognition</span>
            </div>
            <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-full">
              <span className="font-semibold">💳 UPI Integration</span>
            </div>
            <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-full">
              <span className="font-semibold">⚡ Instant Transfers</span>
            </div>
          </div>
          {onGetStarted && (
            <button
              onClick={onGetStarted}
              className="px-10 py-4 bg-white text-indigo-600 rounded-full hover:bg-indigo-50 transition-all transform hover:scale-105 font-bold text-lg shadow-2xl"
            >
              Get Started - Sign Up Now! 🚀
            </button>
          )}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="text-4xl">📖</span>
          About This Project
        </h2>
        <div className="prose max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            The <strong>Voice UPI Payment System</strong> is a modern web application that revolutionizes digital payments by enabling users to send money through voice commands. Built with cutting-edge web technologies, this project demonstrates the seamless integration of voice recognition with UPI payment systems.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Simply speak commands like <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg font-mono text-base">"Send 500 to Ramesh"</span> and watch the magic happen!
          </p>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="text-4xl">✨</span>
          Key Features
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex gap-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-indigo-100">
            <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-2xl">
              🎙️
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Voice Recognition</h3>
              <p className="text-gray-600">
                Advanced speech-to-text technology powered by Web Speech API for accurate command recognition
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-2xl">
              💸
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Instant Payments</h3>
              <p className="text-gray-600">
                Send money instantly to saved contacts with real-time balance updates and transaction history
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-2xl">
              📇
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Contact Management</h3>
              <p className="text-gray-600">
                Easily manage your contacts with names, mobile numbers, and UPI IDs for quick transactions
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100">
            <div className="flex-shrink-0 w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-2xl">
              📊
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Transaction History</h3>
              <p className="text-gray-600">
                Track all your payments with detailed transaction logs including date, time, and recipient info
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
            <div className="flex-shrink-0 w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center text-2xl">
              🎨
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Modern UI/UX</h3>
              <p className="text-gray-600">
                Beautiful, responsive interface built with React and Tailwind CSS for seamless user experience
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-100">
            <div className="flex-shrink-0 w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center text-2xl">
              🔒
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Secure Transactions</h3>
              <p className="text-gray-600">
                Confirmation prompts before every payment to ensure security and prevent accidental transfers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="text-4xl">⚙️</span>
          How It Works
        </h2>
        <div className="space-y-6">
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">Login to Your Account</h3>
              <p className="text-gray-600">
                Enter your name, mobile number, and UPI ID to access your payment dashboard
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">Add Contacts</h3>
              <p className="text-gray-600">
                Navigate to the Contacts tab and add recipients with their details for easy payments
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">Speak Your Command</h3>
              <p className="text-gray-600">
                Click the microphone button and say: <span className="font-mono bg-gray-100 px-2 py-1 rounded">"Send 500 to Ramesh"</span>
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">Confirm & Send</h3>
              <p className="text-gray-600">
                Review the transaction details in the confirmation dialog and approve to complete the payment
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">Transaction Complete!</h3>
              <p className="text-gray-600">
                Your payment is processed instantly, and you can view it in your transaction history
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="text-4xl">🛠️</span>
          Technology Stack
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <h4 className="font-bold text-gray-800 mb-2">⚛️ Frontend</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• React 19.2.0</li>
              <li>• Tailwind CSS 3.4</li>
              <li>• Web Speech API</li>
            </ul>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <h4 className="font-bold text-gray-800 mb-2">🔧 Backend</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• Node.js</li>
              <li>• Express.js 4.19</li>
              <li>• JSON Database</li>
            </ul>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <h4 className="font-bold text-gray-800 mb-2">🧪 Testing</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• Jest</li>
              <li>• React Testing Library</li>
              <li>• User Event Testing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Voice Commands */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-8 border border-indigo-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="text-4xl">🗣️</span>
          Supported Voice Commands
        </h2>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <code className="text-indigo-600 font-mono text-lg">Send [amount] to [contact name]</code>
            <p className="text-gray-600 text-sm mt-2">Example: "Send 500 to Ramesh"</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <code className="text-indigo-600 font-mono text-lg">Pay [amount] to [contact name]</code>
            <p className="text-gray-600 text-sm mt-2">Example: "Pay 1000 to Sita"</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <code className="text-indigo-600 font-mono text-lg">Send [amount] rupees to [contact name]</code>
            <p className="text-gray-600 text-sm mt-2">Example: "Send 250 rupees to Sridhar"</p>
          </div>
        </div>
      </div>

      {/* Project Benefits */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="text-4xl">🎯</span>
          Why Voice Payments?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="font-bold text-xl text-gray-800 mb-2">Faster</h3>
            <p className="text-gray-600">
              Send money in seconds without typing - just speak and confirm
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-5xl mb-4">🤲</div>
            <h3 className="font-bold text-xl text-gray-800 mb-2">Hands-Free</h3>
            <p className="text-gray-600">
              Perfect for multitasking or when your hands are busy
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-5xl mb-4">♿</div>
            <h3 className="font-bold text-xl text-gray-800 mb-2">Accessible</h3>
            <p className="text-gray-600">
              Makes digital payments accessible to everyone, including those with visual impairments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
