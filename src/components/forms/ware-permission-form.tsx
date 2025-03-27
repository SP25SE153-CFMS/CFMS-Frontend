import React, { useState } from 'react';

const WarePermissionForm = () => {
    const [formData, setFormData] = useState({
        permissionLevel: '',
        description: '',
        grantedAt: new Date(),
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
                <label htmlFor="permissionLevel">Permission Level</label>
                <input
                    type="text"
                    id="permissionLevel"
                    name="permissionLevel"
                    value={formData.permissionLevel}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="grantedAt">Granted At</label>
                <input
                    type="date"
                    id="grantedAt"
                    name="grantedAt"
                    value={formData.grantedAt.toISOString().split('T')[0]}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default WarePermissionForm;
