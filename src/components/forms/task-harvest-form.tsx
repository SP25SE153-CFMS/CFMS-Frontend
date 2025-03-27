import React, { useState } from 'react';

const TaskHarvestForm = ({ onSubmit, initialData }: { onSubmit: any; initialData: any }) => {
    const [taskId, setTaskId] = useState(initialData?.taskId || '');
    const [harvestTypeId, setHarvestTypeId] = useState(initialData?.harvestTypeId || '');
    const [quantity, setQuantity] = useState(initialData?.quantity || 0);
    const [unitId, setUnitId] = useState(initialData?.unitId || '');
    const [quality, setQuality] = useState(initialData?.quality || '');

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSubmit({ taskId, harvestTypeId, quantity, unitId, quality });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Task ID</label>
                <input
                    type="text"
                    value={taskId}
                    onChange={(e) => setTaskId(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Harvest Type ID</label>
                <input
                    type="text"
                    value={harvestTypeId}
                    onChange={(e) => setHarvestTypeId(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Quantity</label>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Unit ID</label>
                <input type="text" value={unitId} onChange={(e) => setUnitId(e.target.value)} />
            </div>
            <div>
                <label>Quality</label>
                <input type="text" value={quality} onChange={(e) => setQuality(e.target.value)} />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default TaskHarvestForm;
