import React, { useState } from 'react';

const InventoryReceiptForm = () => {
    const [formData, setFormData] = useState({
        receiptCode: '',
        status: '',
        notes: '',
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
        console.log('Form submitted:', formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="receiptCode">Receipt Code</label>
                <input
                    type="text"
                    id="receiptCode"
                    name="receiptCode"
                    value={formData.receiptCode}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="status">Status</label>
                <input
                    type="text"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="notes">Notes</label>
                <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default InventoryReceiptForm;
