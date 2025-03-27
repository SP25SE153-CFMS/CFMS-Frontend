import React, { useState } from 'react';

const WareTransactionForm = () => {
    const [formData, setFormData] = useState({
        wareId: '',
        resourceId: '',
        quantity: '',
        unitId: '',
        batchNumber: '',
        transactionType: '',
        reason: '',
        transactionDate: '',
        locationFromId: '',
        locationToId: '',
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
        // Add form submission logic here
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Ware ID</label>
                <input
                    type="text"
                    name="wareId"
                    value={formData.wareId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Resource ID</label>
                <input
                    type="text"
                    name="resourceId"
                    value={formData.resourceId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Quantity</label>
                <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Unit ID</label>
                <input
                    type="text"
                    name="unitId"
                    value={formData.unitId}
                    onChange={handleChange}
                    required
                />
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
            <div>
                <label>Transaction Type</label>
                <input
                    type="text"
                    name="transactionType"
                    value={formData.transactionType}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Reason</label>
                <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                ></textarea>
            </div>
            <div>
                <label>Transaction Date</label>
                <input
                    type="date"
                    name="transactionDate"
                    value={formData.transactionDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Location From ID</label>
                <input
                    type="text"
                    name="locationFromId"
                    value={formData.locationFromId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Location To ID</label>
                <input
                    type="text"
                    name="locationToId"
                    value={formData.locationToId}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default WareTransactionForm;
