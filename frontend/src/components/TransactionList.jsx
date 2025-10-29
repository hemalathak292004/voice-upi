export default function TransactionList({ transactions }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800">Transaction History</h3>
        <p className="text-sm text-gray-600 mt-1">Complete history of your payments</p>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-lg">
        {transactions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-500 font-medium text-lg">No transactions yet</p>
            <p className="text-sm text-gray-400 mt-2">Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {transactions.map((tx) => {
              const date = tx.date ? new Date(tx.date) : null;
              const when = date ? date.toLocaleString('en-IN', { 
                dateStyle: 'medium', 
                timeStyle: 'short' 
              }) : '';
              return (
                <div key={tx.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">💸</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-semibold text-gray-900 text-lg">Payment to {tx.receiver || tx.name}</p>
                          <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            Success
                          </span>
                        </div>
                        {when && (
                          <p className="text-sm text-gray-600">{when}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">₹{tx.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary Card */}
      {transactions.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
              <p className="text-3xl font-bold text-gray-900">{transactions.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Total Amount Sent</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ₹{transactions.reduce((sum, tx) => sum + tx.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
