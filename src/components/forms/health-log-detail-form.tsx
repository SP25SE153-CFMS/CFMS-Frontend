import React, { useState } from 'react';

const HealthLogDetailForm = () => {
    const [formData, setFormData] = useState({
        healthLogId: '',
        criteriaId: '',
        result: '',
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
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="healthLogId">Health Log ID</label>
                <input
                    type="text"
                    id="healthLogId"
                    name="healthLogId"
                    value={formData.healthLogId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="criteriaId">Criteria ID</label>
                <input
                    type="text"
                    id="criteriaId"
                    name="criteriaId"
                    value={formData.criteriaId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="result">Result</label>
                <input
                    type="text"
                    id="result"
                    name="result"
                    value={formData.result}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default HealthLogDetailForm;
