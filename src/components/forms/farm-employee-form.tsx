import React, { useState } from 'react';

const FarmEmployeeForm = ({ onSubmit, initialData }: { onSubmit: any; initialData: any }) => {
    const [formData, setFormData] = useState(
        initialData || {
            farmId: '',
            userId: '',
            startDate: '',
            endDate: '',
            status: 1,
            farmRole: '',
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
                <label>Farm ID:</label>
                <input
                    type="text"
                    name="farmId"
                    value={formData.farmId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>User ID:</label>
                <input
                    type="text"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Start Date:</label>
                <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>End Date:</label>
                <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Status:</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                </select>
            </div>
            <div>
                <label>Farm Role:</label>
                <input
                    type="text"
                    name="farmRole"
                    value={formData.farmRole}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default FarmEmployeeForm;
