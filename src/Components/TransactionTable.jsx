const TransactionTable = ({ transactions, setTransactions, role }) => {

  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="overflow-x-auto">
    <table className="w-full border-separate border-spacing-y-3">
      
      
      <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
        <tr>
          <th className="py-3 px-4">Date</th>
          <th className="py-3 px-4">Title</th>
          <th className="py-3 px-4">Amount</th>
          <th className="py-3 px-4">Type</th>
          {role === "Admin" && <th className="py-3 px-4">Action</th>}
        </tr>
      </thead>
      

      
      <tbody>
        {transactions.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center py-4 text-gray-500">
              No transactions found
            </td>
          </tr>
        ) : (
          transactions.map((t) => (
            <tr
              key={t.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition"
            >
              <td className="py-4 px-4">{t.date}</td>

              <td className="py-4 px-4 font-medium">{t.title}</td>

              <td
                className={`py-4 px-4 ${
                  t.amount > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                ₹{Math.abs(t.amount)}
              </td>

              <td className="py-4 px-4">{t.type}</td>

              {role === "Admin" && (
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
    </div>
  );
};

export default TransactionTable;