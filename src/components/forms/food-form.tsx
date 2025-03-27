import React, { useState } from 'react';

const FoodForm = ({ onSubmit, initialData }: { onSubmit: any; initialData: any }) => {
    const [foodName, setFoodName] = useState(initialData?.foodName || '');
    const [foodCode, setFoodCode] = useState(initialData?.foodCode || '');
    const [note, setNote] = useState(initialData?.note || '');
    const [productionDate, setProductionDate] = useState(initialData?.productionDate || '');
    const [expiryDate, setExpiryDate] = useState(initialData?.expiryDate || '');

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const foodData = {
            foodName,
            foodCode,
            note,
            productionDate,
            expiryDate,
        };
        onSubmit(foodData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Food Name:</label>
                <input
                    type="text"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Food Code:</label>
                <input
                    type="text"
                    value={foodCode}
                    onChange={(e) => setFoodCode(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Note:</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <div>
                <label>Production Date:</label>
                <input
                    type="date"
                    value={productionDate}
                    onChange={(e) => setProductionDate(e.target.value)}
                />
            </div>
            <div>
                <label>Expiry Date:</label>
                <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default FoodForm;
