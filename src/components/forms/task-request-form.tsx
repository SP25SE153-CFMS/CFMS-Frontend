import React, { useState } from 'react';

const TaskRequestForm = () => {
    const [formData, setFormData] = useState({
        requestTypeId: '',
        description: '',
        priority: 1,
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
                <label htmlFor="requestTypeId">Request Type</label>
                <input
                    type="text"
                    id="requestTypeId"
                    name="requestTypeId"
                    value={formData.requestTypeId}
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
                    required
                />
            </div>
            <div>
                <label htmlFor="priority">Priority</label>
                <input
                    type="number"
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    min="1"
                    max="5"
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default TaskRequestForm;
