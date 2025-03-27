import React, { useState } from 'react';

const UserForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        mail: '',
        dateOfBirth: '',
        address: '',
        cccd: '',
        googleId: '',
        systemRole: 0,
        hashedPassword: '',
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
        // Handle form submission logic here
        console.log('Form submitted:', formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Full Name:</label>
                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Phone Number:</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="mail"
                    value={formData.mail}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Date of Birth:</label>
                <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Address:</label>
                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>CCCD:</label>
                <input type="text" name="cccd" value={formData.cccd} onChange={handleChange} />
            </div>
            <div>
                <label>Google ID:</label>
                <input
                    type="text"
                    name="googleId"
                    value={formData.googleId}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>System Role:</label>
                <input
                    type="number"
                    name="systemRole"
                    value={formData.systemRole}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Hashed Password:</label>
                <input
                    type="password"
                    name="hashedPassword"
                    value={formData.hashedPassword}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default UserForm;
