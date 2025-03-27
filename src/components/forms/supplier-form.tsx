import React, { useState } from 'react';

const SupplierForm = () => {
    const [supplierData, setSupplierData] = useState({
        supplierName: '',
        supplierCode: '',
        address: '',
        phoneNumber: '',
        bankAccount: '',
        status: 1,
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setSupplierData({
            ...supplierData,
            [name]: value,
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Add form submission logic here
        console.log('Supplier Data Submitted:', supplierData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Supplier Name:</label>
                <input
                    type="text"
                    name="supplierName"
                    value={supplierData.supplierName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Supplier Code:</label>
                <input
                    type="text"
                    name="supplierCode"
                    value={supplierData.supplierCode}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Address:</label>
                <input
                    type="text"
                    name="address"
                    value={supplierData.address}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Phone Number:</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={supplierData.phoneNumber}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Bank Account:</label>
                <input
                    type="text"
                    name="bankAccount"
                    value={supplierData.bankAccount}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Status:</label>
                <select name="status" value={supplierData.status} onChange={handleChange}>
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                </select>
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default SupplierForm;
