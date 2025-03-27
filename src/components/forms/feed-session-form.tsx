import React, { useState } from 'react';

const FeedSessionForm = () => {
    const [formData, setFormData] = useState({
        nutritionPlanId: '',
        feedingTime: '',
        feedAmount: '',
        unitId: '',
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
                <label>Nutrition Plan ID:</label>
                <input
                    type="text"
                    name="nutritionPlanId"
                    value={formData.nutritionPlanId}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Feeding Time:</label>
                <input
                    type="datetime-local"
                    name="feedingTime"
                    value={formData.feedingTime}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Feed Amount:</label>
                <input
                    type="number"
                    name="feedAmount"
                    value={formData.feedAmount}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Unit ID:</label>
                <input type="text" name="unitId" value={formData.unitId} onChange={handleChange} />
            </div>
            <div>
                <label>Note:</label>
                <textarea name="note" value={formData.note} onChange={handleChange} />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default FeedSessionForm;
