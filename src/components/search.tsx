import React, { useState, useEffect, useCallback } from 'react';
import { Input } from './ui/input';
import { X } from 'lucide-react';

interface SearchProps {
    // eslint-disable-next-line no-unused-vars
    onSearch: (value: string) => void;
    placeholder?: string;
    className?: string;
    delay?: number;
}

export default function Search({
    onSearch,
    placeholder = 'Tìm kiếm...',
    className = '',
    delay = 300,
}: SearchProps) {
    const [searchValue, setSearchValue] = useState('');

    // Debounce the search input
    useEffect(() => {
        const handler = setTimeout(() => {
            onSearch(searchValue);
        }, delay);

        return () => clearTimeout(handler);
    }, [searchValue, delay, onSearch]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    }, []);

    const handleClear = () => {
        setSearchValue('');
        onSearch('');
    };

    return (
        <div className={`relative max-w-[460px] ${className}`}>
            <div className="relative">
                <Input
                    id="search-input"
                    value={searchValue}
                    placeholder={placeholder}
                    onChange={handleChange}
                    className="pr-10"
                />
                {searchValue && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label="Xóa tìm kiếm"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}
