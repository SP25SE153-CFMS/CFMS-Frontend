import React, { useState } from 'react';

const EvaluationResultDetailForm = () => {
    const [formData, setFormData] = useState({
        actualValue: '',
        isPass: 0,
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
                <label htmlFor="actualValue">Actual Value</label>
                <input
                    type="text"
                    id="actualValue"
                    name="actualValue"
                    value={formData.actualValue}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="isPass">Is Pass</label>
                <select id="isPass" name="isPass" value={formData.isPass} onChange={handleChange}>
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                </select>
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default EvaluationResultDetailForm;
