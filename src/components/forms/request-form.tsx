import React, { useState } from 'react';

const RequestForm = () => {
    const [formData, setFormData] = useState({
        requestTypeId: '',
        status: '',
        approvedById: '',
        approvedAt: '',
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
                <label>Request Type ID:</label>
                <input
                    type="text"
                    name="requestTypeId"
                    value={formData.requestTypeId}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Status:</label>
                <input type="text" name="status" value={formData.status} onChange={handleChange} />
            </div>
            <div>
                <label>Approved By ID:</label>
                <input
                    type="text"
                    name="approvedById"
                    value={formData.approvedById}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Approved At:</label>
                <input
                    type="datetime-local"
                    name="approvedAt"
                    value={formData.approvedAt}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default RequestForm;
