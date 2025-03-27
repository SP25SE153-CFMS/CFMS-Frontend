import React, { useState } from 'react';

const SystemConfigForm = () => {
    const [formData, setFormData] = useState({
        settingName: '',
        settingValue: 0,
        description: '',
        effectedDateFrom: '',
        effectedDateTo: '',
        entityType: '',
        entityId: '',
        status: 1,
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
                <label>Setting Name:</label>
                <input
                    type="text"
                    name="settingName"
                    value={formData.settingName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Setting Value:</label>
                <input
                    type="number"
                    name="settingValue"
                    value={formData.settingValue}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Description:</label>
                <textarea name="description" value={formData.description} onChange={handleChange} />
            </div>
            <div>
                <label>Effected Date From:</label>
                <input
                    type="date"
                    name="effectedDateFrom"
                    value={formData.effectedDateFrom}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Effected Date To:</label>
                <input
                    type="date"
                    name="effectedDateTo"
                    value={formData.effectedDateTo}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Entity Type:</label>
                <input
                    type="text"
                    name="entityType"
                    value={formData.entityType}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Entity ID:</label>
                <input
                    type="text"
                    name="entityId"
                    value={formData.entityId}
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
            <button type="submit">Submit</button>
        </form>
    );
};

export default SystemConfigForm;
