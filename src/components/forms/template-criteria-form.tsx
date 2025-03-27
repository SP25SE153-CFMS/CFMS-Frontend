import React, { useState } from 'react';

const TemplateCriteriaForm = ({ onSubmit, initialData }: { onSubmit: any; initialData: any }) => {
    const [formData, setFormData] = useState(
        initialData || {
            templateName: '',
            evaluationTemplateId: '',
            criteriaId: '',
            expectedCondition: '',
            expectedUnit: '',
            expectedValue: '',
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
                <label>Template Name</label>
                <input
                    type="text"
                    name="templateName"
                    value={formData.templateName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Evaluation Template ID</label>
                <input
                    type="text"
                    name="evaluationTemplateId"
                    value={formData.evaluationTemplateId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Criteria ID</label>
                <input
                    type="text"
                    name="criteriaId"
                    value={formData.criteriaId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Expected Condition</label>
                <input
                    type="text"
                    name="expectedCondition"
                    value={formData.expectedCondition}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Expected Unit</label>
                <input
                    type="text"
                    name="expectedUnit"
                    value={formData.expectedUnit}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Expected Value</label>
                <input
                    type="text"
                    name="expectedValue"
                    value={formData.expectedValue}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default TemplateCriteriaForm;
