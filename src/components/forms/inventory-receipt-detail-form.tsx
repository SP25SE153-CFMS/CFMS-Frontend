import React, { useState } from 'react';

const InventoryReceiptDetailForm = () => {
    const [formData, setFormData] = useState({
        actualQuantity: '',
        actualDate: '',
        note: '',
        batchNumber: '',
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Actual Quantity</label>
                <input
                    type="number"
                    name="actualQuantity"
                    value={formData.actualQuantity}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Actual Date</label>
                <input
                    type="date"
                    name="actualDate"
                    value={formData.actualDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Note</label>
                <textarea name="note" value={formData.note} onChange={handleChange} />
            </div>
            <div>
                <label>Batch Number</label>
                <input
                    type="number"
                    name="batchNumber"
                    value={formData.batchNumber}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default InventoryReceiptDetailForm;
