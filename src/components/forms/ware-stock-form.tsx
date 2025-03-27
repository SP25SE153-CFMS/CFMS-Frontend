import React, { useState } from 'react';

const WareStockForm = () => {
    const [formData, setFormData] = useState({
        wareId: '',
        resourceId: '',
        quantity: 0,
        unitId: '',
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
                <label>Ware ID:</label>
                <input
                    type="text"
                    name="wareId"
                    value={formData.wareId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Resource ID:</label>
                <input
                    type="text"
                    name="resourceId"
                    value={formData.resourceId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Quantity:</label>
                <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Unit ID:</label>
                <input
                    type="text"
                    name="unitId"
                    value={formData.unitId}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default WareStockForm;
