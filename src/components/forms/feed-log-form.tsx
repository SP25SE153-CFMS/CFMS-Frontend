import React, { useState } from 'react';

const FeedLogForm = () => {
    const [formData, setFormData] = useState({
        chickenBatchId: '',
        feedingDate: '',
        actualFeedAmount: '',
        unitId: '',
        taskId: '',
        note: '',
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
                <label>Chicken Batch ID:</label>
                <input
                    type="text"
                    name="chickenBatchId"
                    value={formData.chickenBatchId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Feeding Date:</label>
                <input
                    type="datetime-local"
                    name="feedingDate"
                    value={formData.feedingDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Actual Feed Amount:</label>
                <input
                    type="number"
                    name="actualFeedAmount"
                    value={formData.actualFeedAmount}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Unit ID:</label>
                <input type="text" name="unitId" value={formData.unitId} onChange={handleChange} />
            </div>
            <div>
                <label>Task ID:</label>
                <input type="text" name="taskId" value={formData.taskId} onChange={handleChange} />
            </div>
            <div>
                <label>Note:</label>
                <textarea name="note" value={formData.note} onChange={handleChange}></textarea>
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default FeedLogForm;
