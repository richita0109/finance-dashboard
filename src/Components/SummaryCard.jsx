const SummaryCard = ({ transactions }) => {
  
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6">
        No summary available
      </div>
    );
  }

  
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income + expense;

  return (
    <div className="flex flex-col md:flex-row gap-6">

     
      <div className="flex-1 p-6 rounded-xl text-white shadow-md bg-gradient-to-r from-green-400 to-green-600 hover:scale-105 transition duration-200">
        <h3 className="text-sm opacity-80">Balance</h3>
        <p className="text-2xl font-bold">₹{balance}</p>
      </div>

      
      <div className="flex-1 p-6 rounded-xl text-white shadow-md bg-gradient-to-r from-blue-400 to-blue-600 hover:scale-105 transition duration-200">
        <h3 className="text-sm opacity-80">Income</h3>
        <p className="text-2xl font-bold">₹{income}</p>
      </div>

      
      <div className="flex-1 p-6 rounded-xl text-white shadow-md bg-gradient-to-r from-red-400 to-red-600 hover:scale-105 transition duration-200">
        <h3 className="text-sm opacity-80">Expenses</h3>
        <p className="text-2xl font-bold">₹{Math.abs(expense)}</p>
      </div>

    </div>
  );
};

export default SummaryCard;