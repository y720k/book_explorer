import { createContext, useState, useContext } from 'react'


const BookContext = createContext() 

export const BookProvider = ({children}) => {

    const [currentBook, setCurrentBook] = useState();
    const [currentDescription, setCurrentDescription] = useState("");

    const value = {
        currentBook,
        currentDescription,
        setCurrentBook,
        setCurrentDescription
    }

    return <BookContext.Provider value={value}>
            {children}
        </BookContext.Provider>
}

export const useBookContext = () => useContext(BookContext)