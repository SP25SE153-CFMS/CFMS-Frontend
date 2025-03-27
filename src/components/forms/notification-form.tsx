import React, { useState } from 'react';

const NotificationForm = () => {
    const [notificationName, setNotificationName] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [content, setContent] = useState('');
    const [isRead, setIsRead] = useState(0);
    const [userId, setUserId] = useState('');

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Notification Name:</label>
                <input
                    type="text"
                    value={notificationName}
                    onChange={(e) => setNotificationName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Notification Type:</label>
                <input
                    type="text"
                    value={notificationType}
                    onChange={(e) => setNotificationType(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Content:</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
            </div>
            <div>
                <label>Is Read:</label>
                <input
                    type="number"
                    value={isRead}
                    onChange={(e) => setIsRead(Number(e.target.value))}
                    required
                />
            </div>
            <div>
                <label>User ID:</label>
                <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default NotificationForm;
