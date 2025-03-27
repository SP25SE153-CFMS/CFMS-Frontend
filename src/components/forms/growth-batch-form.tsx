import React, { useState } from 'react';

const GrowthBatchForm = ({ onSubmit, initialData }: { onSubmit: any; initialData: any }) => {
    const [formData, setFormData] = useState(
        initialData || {
            chickenBatchId: '',
            growthStageId: '',
            startDate: '',
            endDate: '',
            mortalityRate: 0,
            feedConsumption: 0,
            note: '',
            status: 1,
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
                <label>Chicken Batch ID</label>
                <input
                    type="text"
                    name="chickenBatchId"
                    value={formData.chickenBatchId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Growth Stage ID</label>
                <input
                    type="text"
                    name="growthStageId"
                    value={formData.growthStageId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Start Date</label>
                <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>End Date</label>
                <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Mortality Rate</label>
                <input
                    type="number"
                    name="mortalityRate"
                    value={formData.mortalityRate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Feed Consumption</label>
                <input
                    type="number"
                    name="feedConsumption"
                    value={formData.feedConsumption}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Note</label>
                <textarea name="note" value={formData.note} onChange={handleChange} />
            </div>
            <div>
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                </select>
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default GrowthBatchForm;
