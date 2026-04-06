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

const Charts = ({ transactions }) => {

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6">
        No chart data available
      </div>
    );
  }


  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = Math.abs(
    transactions
      .filter((t) => t.amount < 0)
      .reduce((acc, t) => acc + t.amount, 0)
  );

  const pieData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  
  let running = 0;
  const lineData = [...transactions] 
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((t) => {
      running += t.amount;
      return { date: t.date, balance: running };
    });

  return (
    <div className="grid md:grid-cols-2 gap-6">

      
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3 text-green-600">
          Spending Breakdown
        </h3>

        <div className="flex justify-center">
          <PieChart width={300} height={250}>
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

      
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3 text-blue-600">
          Balance Trend
        </h3>

        <div className="flex justify-center">
          <LineChart width={350} height={250} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </div>
      </div>

    </div>
  );
};

export default Charts;