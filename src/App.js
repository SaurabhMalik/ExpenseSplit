import { useState } from "react";

export default function ExpenseSplitter() {
    const [currentTrip, setCurrentTrip] = useState("Goa Trip 2025");
    const [tripList, setTripList] = useState(["Goa Trip 2025"]);
    const [expenses, setExpenses] = useState([]);

    const [names, setNames] = useState("Ashish,Harender,Saurabh");
    const [description, setDescription] = useState("");
    const [paidBy, setPaidBy] = useState("");
    const [amount, setAmount] = useState("");
    const [weights, setWeights] = useState("2,2,3");

    const handleAddTrip = () => {
        const trimmed = currentTrip.trim();
        if (trimmed && !tripList.includes(trimmed)) {
            setTripList([...tripList, trimmed]);
        }
    };

    const handleAddExpense = () => {
        const nameArr = names.split(",").map((n) => n.trim());
        const weightArr = weights.split(",").map((w) => parseInt(w.trim()));
        const totalWeight = weightArr.reduce((sum, w) => sum + w, 0);

        const expense = {
            trip: currentTrip,
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

    const getTripExpenses = (trip) => expenses.filter((exp) => exp.trip === trip);

    const getSummaryForTrip = (trip) => {
        const tripExpenses = getTripExpenses(trip);
        const nameArr = names.split(",").map((n) => n.trim());
        const summary = Object.fromEntries(nameArr.map((name) => [name, { paid: 0, share: 0 }]));

        for (const expense of tripExpenses) {
            summary[expense.paidBy].paid += expense.amount;
            for (const name of nameArr) {
                const weight = expense.weights[name] || 0;
                const share = (weight / expense.totalWeight) * expense.amount;
                summary[name].share += share;
            }
        }

        return summary;
    };

    return (
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "1rem" }}>
            <h2>Expense Splitter</h2>

            <label><strong>Participants (comma separated):</strong></label><br />
            <input value={names} onChange={(e) => setNames(e.target.value)} style={{ width: "100%", marginBottom: "1rem" }} />

            <label><strong>Select Trip:</strong></label><br />
            <select value={currentTrip} onChange={(e) => setCurrentTrip(e.target.value)} style={{ width: "100%", marginBottom: "0.5rem" }}>
                {tripList.map((trip) => (
                    <option key={trip} value={trip}>{trip}</option>
                ))}
            </select>
            <input
                placeholder="Add new trip name"
                value={currentTrip}
                onChange={(e) => setCurrentTrip(e.target.value)}
                style={{ width: "100%", marginBottom: "0.5rem" }}
            />
            <button onClick={handleAddTrip} style={{ marginBottom: "1rem" }}>Add Trip</button>

            <h3>Add New Expense</h3>
            <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: "100%", marginBottom: "0.5rem" }} /><br />
            <input placeholder="Paid by" value={paidBy} onChange={(e) => setPaidBy(e.target.value)} style={{ width: "100%", marginBottom: "0.5rem" }} /><br />
            <input placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: "100%", marginBottom: "0.5rem" }} /><br />
            <input placeholder="Weights (e.g. 2,2,3)" value={weights} onChange={(e) => setWeights(e.target.value)} style={{ width: "100%", marginBottom: "0.5rem" }} /><br />
            <button onClick={handleAddExpense}>Add Expense</button>

            {tripList.map((trip) => {
                const tripExpenses = getTripExpenses(trip);
                const summary = getSummaryForTrip(trip);

                return (
                    <div key={trip} style={{ marginTop: "2rem" }}>
                        <h3>Trip: {trip}</h3>

                        <h4>Expense History</h4>
                        {tripExpenses.length === 0 ? (
                            <p>No expenses yet.</p>
                        ) : (
                            <table border="1" cellPadding="5" style={{ width: "100%", marginBottom: "1rem" }}>
                                <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Paid By</th>
                                    <th>Amount</th>
                                    <th>Weights</th>
                                </tr>
                                </thead>
                                <tbody>
                                {tripExpenses.map((exp, i) => (
                                    <tr key={i}>
                                        <td>{exp.description}</td>
                                        <td>{exp.paidBy}</td>
                                        <td>₹{exp.amount.toFixed(2)}</td>
                                        <td>{Object.entries(exp.weights).map(([name, weight]) => `${name}:${weight}`).join(", ")}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}

                        <h4>Summary</h4>
                        <table border="1" cellPadding="5" style={{ width: "100%" }}>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Paid</th>
                                <th>Share</th>
                                <th>Balance</th>
                            </tr>
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
            })}
        </div>
    );
}