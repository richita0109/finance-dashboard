import React, { useState , useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#22c55e", "#ef4444"];

export default function App() {
 const [transactions, setTransactions] = useState(() => {
  const saved = localStorage.getItem("transactions");

  return saved
    ? JSON.parse(saved)
    : [
        { id: 1, date: "2026-04-01", title: "Swiggy", amount: -450, type: "Expense" },
        { id: 2, date: "2026-04-01", title: "Salary", amount: 25000, type: "Income" },
        { id: 3, date: "2026-04-02", title: "Uber", amount: -300, type: "Expense" },
      ];
});

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Income");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortOption, setSortOption] = useState("latest");
  const [role, setRole] = useState("Admin");
  useEffect(() => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}, [transactions]);

  const income = transactions.filter(t => t.amount > 0).reduce((a,b)=>a+b.amount,0);
  const expense = Math.abs(transactions.filter(t=>t.amount<0).reduce((a,b)=>a+b.amount,0));
  const balance = income - expense;

  const totalTransactions = transactions.length;

  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const highestExpense =
    transactions
      .filter((t) => t.type === "Expense")
      .reduce((max, t) => Math.max(max, Math.abs(t.amount)), 0) || 0;

     
const categoryTotals = transactions
  .filter((t) => t.type === "Expense")
  .reduce((acc, curr) => {
    const key = curr.title;

    if (!acc[key]) acc[key] = 0;
    acc[key] += Math.abs(curr.amount);

    return acc;
  }, {});

const highestCategory = Object.keys(categoryTotals).reduce(
  (max, curr) =>
    categoryTotals[curr] > (categoryTotals[max] || 0) ? curr : max,
  ""
);

 
  const filteredTransactions = transactions.filter((t) => {
    const searchText = search.toLowerCase().trim();

    const normalized = searchText.endsWith("s")
      ? searchText.slice(0, -1)
      : searchText;

    const titleMatch = t.title.toLowerCase().includes(searchText);

    const typeMatch =
      t.type.toLowerCase().includes(searchText) ||
      t.type.toLowerCase().includes(normalized);

    const matchesSearch = titleMatch || typeMatch;

    const matchesFilter =
      filter === "All" ||
      (filter === "Income" && t.type === "Income") ||
      (filter === "Expense" && t.type === "Expense");

    return matchesSearch && matchesFilter;
    })
  .sort((a, b) => {
    if (sortOption === "latest") {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortOption === "oldest") {
      return new Date(a.date) - new Date(b.date);
    }
    if (sortOption === "high") {
      return Math.abs(b.amount) - Math.abs(a.amount);
    }
    if (sortOption === "low") {
      return Math.abs(a.amount) - Math.abs(b.amount);
  }
    return 0;
  });

  const addTransaction = () => {
    if (!title || !amount) return;

    const newTx = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      title,
      amount: type === "Income" ? +amount : -amount,
      type,
    };

    setTransactions([newTx, ...transactions]);
    setTitle("");
    setAmount("");
  };

  const deleteTx = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const pieData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  let running = 0;
  const lineData = transactions.slice().reverse().map((t) => {
    running += t.amount;
    return { date: t.date, balance: running };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-6xl mx-auto">

       
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            Finance Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Track your income and expenses easily
          </p>

          <div className="flex justify-center items-center gap-2 mt-3">
            <span className="font-medium">Role:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="p-2 border rounded bg-white"
            >
              <option>Admin</option>
              <option>Viewer</option>
            </select>
          </div>
        </div>

        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card title="Balance" value={balance} color="green" />
          <Card title="Income" value={income} color="blue" />
          <Card title="Expenses" value={expense} color="red" />
        </div>

        
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">

          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Transactions
          </h2>

          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border rounded mb-3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-2 mb-3">
            {["All", "Income", "Expense"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded ${
                  filter === f ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <select
  value={sortOption}
  onChange={(e) => setSortOption(e.target.value)}
  className="p-2 border rounded mb-3"
>
  <option value="latest">Sort by Latest</option>
  <option value="oldest">Sort by Oldest</option>
  <option value="high">Amount High → Low</option>
  <option value="low">Amount Low → High</option>
</select>

          {role === "Admin" && (
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <input className="p-2 border rounded" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
              <input className="p-2 border rounded" type="number" placeholder="Amount" value={amount} onChange={(e)=>setAmount(e.target.value)} />
              <select className="p-2 border rounded" value={type} onChange={(e)=>setType(e.target.value)}>
                <option>Income</option>
                <option>Expense</option>
              </select>
              <button onClick={addTransaction} className="bg-green-500 text-white rounded hover:bg-green-600">
                Add
              </button>
            </div>
          )}

          
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
             
  {filteredTransactions.length === 0 ? (
    <tr>
      <td colSpan="5" className="text-center py-4 text-gray-500">
        No transactions found
      </td>
    </tr>
  ) : (
    filteredTransactions.map((t) => (
                <tr key={t.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition">
                  <td className="py-4 px-4">{t.date}</td>
                  <td className="py-4 px-4 font-medium">{t.title}</td>
                  <td className={`py-4 px-4 ${t.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                    ₹{Math.abs(t.amount)}
                  </td>
                  <td className="py-4 px-4">{t.type}</td>

                  {role === "Admin" && (
                    <td className="py-4 px-4">
                      <button onClick={() => deleteTx(t.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              )))}
            </tbody>
          </table>
        </div>

        
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-600">Insights</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <InsightCard title="Total Transactions" value={totalTransactions} color="blue" />
            <InsightCard title="Highest Expense" value={highestExpense} color="red" />
            <InsightCard title="Total Expense" value={totalExpense} color="yellow" />
            <InsightCard title="Top Category" value={highestCategory || "N/A"} color="blue"/>
          </div>
        </div>

        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-bold mb-2 text-green-600">
              Spending Breakdown
            </h3>
            <div className="flex justify-center">
              <PieChart width={380} height={320}>
                <Pie data={pieData} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-5 text-blue-600">
              Balance Trend
            </h3>
            <div className="flex justify-center mt-6">
              <LineChart width={400} height={250} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="balance" stroke="#3b82f6" />
              </LineChart>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  const colors = {
    green: "from-green-400 to-green-600",
    blue: "from-blue-400 to-blue-600",
    red: "from-red-400 to-red-600",
  };

  return (
    <div className={`p-6 rounded-xl text-white bg-gradient-to-r ${colors[color]}`}>
      <h3>{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function InsightCard({ title, value, color }) {
  const colors = {
    blue: "from-blue-500 to-blue-700",
    red: "from-red-500 to-red-700",
    yellow: "from-yellow-400 to-yellow-600",
  };

  return (
    <div className={`p-4 rounded-xl text-white bg-gradient-to-r ${colors[color]}`}>
      <h3 className="text-sm opacity-80">{title}</h3>
      <p className="text-xl font-semibold">
        {title === "Total Transactions" ||typeof value !== "number" ? value : `₹${value}`}</p>
    </div>
  );
}