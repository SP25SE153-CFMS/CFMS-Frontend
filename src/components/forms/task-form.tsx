import React, { useState } from 'react';

const TaskForm = ({ initialData, onSubmit }: { initialData: any; onSubmit: any }) => {
    const [taskName, setTaskName] = useState(initialData?.taskName || '');
    const [taskTypeId, setTaskTypeId] = useState(initialData?.taskTypeId || '');
    const [description, setDescription] = useState(initialData?.description || '');

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const taskData = {
            taskName,
            taskTypeId,
            description,
        };
        onSubmit(taskData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Task Name</label>
                <input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Task Type</label>
                <input
                    type="text"
                    value={taskTypeId}
                    onChange={(e) => setTaskTypeId(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default TaskForm;
