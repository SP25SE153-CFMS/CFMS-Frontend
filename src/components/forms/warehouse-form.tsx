import React, { useState } from 'react';

const WarehouseForm = () => {
    const [formData, setFormData] = useState({
        warehouseName: '',
        maxQuantity: 0,
        maxWeight: 0,
        currentQuantity: 0,
        currentWeight: 0,
        description: '',
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
                <label>Warehouse Name:</label>
                <input
                    type="text"
                    name="warehouseName"
                    value={formData.warehouseName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Max Quantity:</label>
                <input
                    type="number"
                    name="maxQuantity"
                    value={formData.maxQuantity}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Max Weight:</label>
                <input
                    type="number"
                    name="maxWeight"
                    value={formData.maxWeight}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Current Quantity:</label>
                <input
                    type="number"
                    name="currentQuantity"
                    value={formData.currentQuantity}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Current Weight:</label>
                <input
                    type="number"
                    name="currentWeight"
                    value={formData.currentWeight}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Description:</label>
                <textarea name="description" value={formData.description} onChange={handleChange} />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default WarehouseForm;
