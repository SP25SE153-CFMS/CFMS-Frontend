import React, { useState } from 'react';

const MedicineForm = ({ onSubmit, initialData }: { onSubmit: any; initialData: any }) => {
    const [formData, setFormData] = useState(
        initialData || {
            usage: '',
            dosageForm: '',
            storageCondition: '',
            diseaseId: '',
            productionDate: '',
            expiryDate: '',
        },
    );

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Usage:</label>
                <input
                    type="text"
                    name="usage"
                    value={formData.usage}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Dosage Form:</label>
                <input
                    type="text"
                    name="dosageForm"
                    value={formData.dosageForm}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Storage Condition:</label>
                <input
                    type="text"
                    name="storageCondition"
                    value={formData.storageCondition}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Disease ID:</label>
                <input
                    type="text"
                    name="diseaseId"
                    value={formData.diseaseId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Production Date:</label>
                <input
                    type="date"
                    name="productionDate"
                    value={formData.productionDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Expiry Date:</label>
                <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default MedicineForm;
