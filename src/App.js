import { useState } from "react";

export default function ExpenseSplitter() {
  const [expenses, setExpenses] = useState([]);
  const [names, setNames] = useState("Ashish,Harender,Saurabh");
  const [description, setDescription] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [amount, setAmount] = useState("");
  const [weights, setWeights] = useState("2,2,3");

  const handleAddExpense = () => {
    const nameArr = names.split(",").map((n) => n.trim());
    const weightArr = weights.split(",").map((w) => parseInt(w.trim()));
    const totalWeight = weightArr.reduce((sum, w) => sum + w, 0);

    const expense = {
      description,
      paidBy,
      amount: parseFloat(amount),
      weights: Object.fromEntries(nameArr.map((name, i) => [name, weightArr[i]])),
      totalWeight,
    };

    setExpenses([...expenses, expense]);
    setDescription("");
    setPaidBy("");
    setAmount("");
    setWeights("");
  };

  const getSummary = () => {
    const nameArr = names.split(",").map((n) => n.trim());
    const summary = Object.fromEntries(nameArr.map((name) => [name, { paid: 0, share: 0 }]));

    for (const expense of expenses) {
      summary[expense.paidBy].paid += expense.amount;
      for (const name of nameArr) {
        const weight = expense.weights[name] || 0;
        const share = (weight / expense.totalWeight) * expense.amount;
        summary[name].share += share;
      }
    }

    return summary;
  };

  const summary = getSummary();

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h2>Expense Splitter</h2>
      <input placeholder="Comma-separated names" value={names} onChange={(e) => setNames(e.target.value)} /><br />
      <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} /><br />
      <input placeholder="Paid by" value={paidBy} onChange={(e) => setPaidBy(e.target.value)} /><br />
      <input placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /><br />
      <input placeholder="Weights (e.g. 2,2,3)" value={weights} onChange={(e) => setWeights(e.target.value)} /><br />
      <button onClick={handleAddExpense}>Add Expense</button>

      <h3>Summary</h3>
      <table border="1" cellPadding="5" style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr><th>Name</th><th>Paid</th><th>Share</th><th>Balance</th></tr>
        </thead>
        <tbody>
          {Object.entries(summary).map(([name, { paid, share }]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>₹{paid.toFixed(2)}</td>
              <td>₹{share.toFixed(2)}</td>
              <td>₹{(paid - share).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}