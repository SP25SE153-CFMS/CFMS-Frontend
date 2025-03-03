import React, { useState } from 'react';
import { Input } from '../ui/input';

export default function Search({ onSearch }: { onSearch: (value: string) => void }) {
    const [searchValue, setSearchValue] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        onSearch(value)
    }
    return (
        <Input
            value={searchValue}
            className="max-w-[462px]"
            placeholder="Search..."
            onChange={handleChange}
        />
    );
}
