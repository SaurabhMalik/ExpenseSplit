import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <Card>
        <CardContent className="space-y-2 p-4">
          <Input
            placeholder="Comma-separated names (e.g., Ashish,Harender,Saurabh)"
            value={names}
            onChange={(e) => setNames(e.target.value)}
          />
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input placeholder="Paid by" value={paidBy} onChange={(e) => setPaidBy(e.target.value)} />
          <Input
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input
            placeholder="Weights (e.g., 2,2,3)"
            value={weights}
            onChange={(e) => setWeights(e.target.value)}
          />
          <Button onClick={handleAddExpense}>Add Expense</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-bold mb-2">Summary</h2>
          <table className="w-full table-auto text-left">
            <thead>
              <tr>
                <th className="py-1">Name</th>
                <th className="py-1">Paid</th>
                <th className="py-1">Share</th>
                <th className="py-1">Balance</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(summary).map(([name, { paid, share }]) => (
                <tr key={name}>
                  <td className="py-1">{name}</td>
                  <td className="py-1">₹{paid.toFixed(2)}</td>
                  <td className="py-1">₹{share.toFixed(2)}</td>
                  <td className="py-1">₹{(paid - share).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
