import React, { useState } from 'react';

const QuantityLogForm = () => {
    const [quantityLog, setQuantityLog] = useState({
        chickenBatchId: '',
        logDate: '',
        notes: '',
        quantity: 0,
        logType: 0, // 0 - chet, 1 - tach dan, 2 - nhap dan
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setQuantityLog({
            ...quantityLog,
            [name]: value,
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Add form submission logic here
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Chicken Batch ID:</label>
                <input
                    type="text"
                    name="chickenBatchId"
                    value={quantityLog.chickenBatchId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Log Date:</label>
                <input
                    type="date"
                    name="logDate"
                    value={quantityLog.logDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Notes:</label>
                <textarea name="notes" value={quantityLog.notes} onChange={handleChange} />
            </div>
            <div>
                <label>Quantity:</label>
                <input
                    type="number"
                    name="quantity"
                    value={quantityLog.quantity}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Log Type:</label>
                <select name="logType" value={quantityLog.logType} onChange={handleChange}>
                    <option value="0">Chet</option>
                    <option value="1">Tach Dan</option>
                    <option value="2">Nhap Dan</option>
                </select>
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default QuantityLogForm;
