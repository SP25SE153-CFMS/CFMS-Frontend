import React, { useState } from 'react';

const FarmForm = () => {
    const [farmData, setFarmData] = useState({
        farmName: '',
        farmCode: '',
        address: '',
        area: 0,
        scale: 0,
        phoneNumber: '',
        website: '',
        imageUrl: '',
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFarmData({ ...farmData, [name]: value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Add form submission logic here
        console.log('Farm data submitted:', farmData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Farm Name:</label>
                <input
                    type="text"
                    name="farmName"
                    value={farmData.farmName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Farm Code:</label>
                <input
                    type="text"
                    name="farmCode"
                    value={farmData.farmCode}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Address:</label>
                <input
                    type="text"
                    name="address"
                    value={farmData.address}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Area:</label>
                <input type="number" name="area" value={farmData.area} onChange={handleChange} />
            </div>
            <div>
                <label>Scale:</label>
                <input type="number" name="scale" value={farmData.scale} onChange={handleChange} />
            </div>
            <div>
                <label>Phone Number:</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={farmData.phoneNumber}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Website:</label>
                <input type="url" name="website" value={farmData.website} onChange={handleChange} />
            </div>
            <div>
                <label>Image URL:</label>
                <input
                    type="text"
                    name="imageUrl"
                    value={farmData.imageUrl}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default FarmForm;
