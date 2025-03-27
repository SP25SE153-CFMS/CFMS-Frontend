import React, { useState } from 'react';

const ResourceForm = ({ resource, onSubmit }: { resource: any; onSubmit: any }) => {
    const [formData, setFormData] = useState({
        resourceTypeId: resource ? resource.resourceTypeId : '',
        description: resource ? resource.description : '',
        unitId: resource ? resource.unitId : '',
        packageId: resource ? resource.packageId : '',
        packageSize: resource ? resource.packageSize : '',
        foodId: resource ? resource.foodId : '',
        equipmentId: resource ? resource.equipmentId : '',
        medicineId: resource ? resource.medicineId : '',
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
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Resource Type</label>
                <input
                    type="text"
                    name="resourceTypeId"
                    value={formData.resourceTypeId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Description</label>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Unit</label>
                <input
                    type="text"
                    name="unitId"
                    value={formData.unitId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Package ID</label>
                <input
                    type="text"
                    name="packageId"
                    value={formData.packageId}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Package Size</label>
                <input
                    type="number"
                    name="packageSize"
                    value={formData.packageSize}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Food ID</label>
                <input type="text" name="foodId" value={formData.foodId} onChange={handleChange} />
            </div>
            <div>
                <label>Equipment ID</label>
                <input
                    type="text"
                    name="equipmentId"
                    value={formData.equipmentId}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Medicine ID</label>
                <input
                    type="text"
                    name="medicineId"
                    value={formData.medicineId}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default ResourceForm;
