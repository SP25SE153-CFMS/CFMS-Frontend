import React, { useState } from 'react';

const RevokedTokenForm = () => {
    const [token, setToken] = useState('');
    const [tokenType, setTokenType] = useState('');
    const [revokedAt, setRevokedAt] = useState(new Date());
    const [expiryDate, setExpiryDate] = useState(new Date());
    const [userId, setUserId] = useState('');

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Token</label>
                <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Token Type</label>
                <input
                    type="number"
                    value={tokenType}
                    onChange={(e) => setTokenType(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Revoked At</label>
                <input
                    type="datetime-local"
                    value={revokedAt.toISOString().slice(0, 16)}
                    onChange={(e) => setRevokedAt(new Date(e.target.value))}
                    required
                />
            </div>
            <div>
                <label>Expiry Date</label>
                <input
                    type="datetime-local"
                    value={expiryDate.toISOString().slice(0, 16)}
                    onChange={(e) => setExpiryDate(new Date(e.target.value))}
                    required
                />
            </div>
            <div>
                <label>User ID</label>
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

export default RevokedTokenForm;
