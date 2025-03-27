import React, { useState } from 'react';

const TaskResourceForm = () => {
    const [formData, setFormData] = useState({
        taskId: '',
        resourceId: '',
        resourceTypeId: '',
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
        // Add form submission logic here
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Task ID:</label>
                <input
                    type="text"
                    name="taskId"
                    value={formData.taskId}
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
                <label>Resource Type ID:</label>
                <input
                    type="text"
                    name="resourceTypeId"
                    value={formData.resourceTypeId}
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

export default TaskResourceForm;
