import React, { useState } from 'react';

const NutritionPlanDetailForm = () => {
    const [formData, setFormData] = useState({
        nutritionPlanId: '',
        foodId: '',
        unitId: '',
        foodWeight: 0,
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
                <label>Nutrition Plan ID</label>
                <input
                    type="text"
                    name="nutritionPlanId"
                    value={formData.nutritionPlanId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Food ID</label>
                <input
                    type="text"
                    name="foodId"
                    value={formData.foodId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Unit ID</label>
                <input
                    type="text"
                    name="unitId"
                    value={formData.unitId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Food Weight</label>
                <input
                    type="number"
                    name="foodWeight"
                    value={formData.foodWeight}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default NutritionPlanDetailForm;
