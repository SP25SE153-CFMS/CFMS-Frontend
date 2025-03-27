import React, { useState } from 'react';

const InventoryRequestDetailForm = () => {
    const [formData, setFormData] = useState({
        inventoryRequestId: '',
        resourceId: '',
        expectedQuantity: '',
        unitId: '',
        reason: '',
        expectedDate: '',
        note: '',
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
                <label>Inventory Request ID</label>
                <input
                    type="text"
                    name="inventoryRequestId"
                    value={formData.inventoryRequestId}
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
                <label>Expected Quantity</label>
                <input
                    type="number"
                    name="expectedQuantity"
                    value={formData.expectedQuantity}
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
                <label>Reason</label>
                <textarea name="reason" value={formData.reason} onChange={handleChange} />
            </div>
            <div>
                <label>Expected Date</label>
                <input
                    type="date"
                    name="expectedDate"
                    value={formData.expectedDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Note</label>
                <textarea name="note" value={formData.note} onChange={handleChange} />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default InventoryRequestDetailForm;
