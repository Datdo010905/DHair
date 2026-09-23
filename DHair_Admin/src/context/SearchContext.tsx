import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SearchContextType {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}
// Tạo context với giá trị mặc định
const SearchContext = createContext<SearchContextType>({
    searchTerm: '',
    setSearchTerm: () => {},
});

//Tạo Provider để bọc các component lại
export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
            {children}
        </SearchContext.Provider>
    );
};
//custom hook để sử dụng context
export const useSearch = () => useContext(SearchContext);