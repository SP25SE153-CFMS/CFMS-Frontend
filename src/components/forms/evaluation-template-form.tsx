import React, { useState } from 'react';

const EvaluationTemplateForm = () => {
    const [formData, setFormData] = useState({
        templateName: '',
        templateTypeId: '',
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
                <label htmlFor="templateName">Template Name</label>
                <input
                    type="text"
                    id="templateName"
                    name="templateName"
                    value={formData.templateName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="templateTypeId">Template Type ID</label>
                <input
                    type="text"
                    id="templateTypeId"
                    name="templateTypeId"
                    value={formData.templateTypeId}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default EvaluationTemplateForm;
