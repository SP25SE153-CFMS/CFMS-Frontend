import React, { useState } from 'react';

const ResourceSupplierForm = () => {
    const [formData, setFormData] = useState({
        resourceId: '',
        description: '',
        supplierId: '',
        price: '',
        unitPriceId: '',
        packagePriceId: '',
        packageSizePrice: '',
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
                <label>Description</label>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Supplier ID</label>
                <input
                    type="text"
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Price</label>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Unit Price ID</label>
                <input
                    type="text"
                    name="unitPriceId"
                    value={formData.unitPriceId}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Package Price ID</label>
                <input
                    type="text"
                    name="packagePriceId"
                    value={formData.packagePriceId}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Package Size Price</label>
                <input
                    type="number"
                    name="packageSizePrice"
                    value={formData.packageSizePrice}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default ResourceSupplierForm;
