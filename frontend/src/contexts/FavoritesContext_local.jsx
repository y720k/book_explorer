import { createContext, useState, useContext, useEffect } from 'react'


// Can be used to store favorites locally, without using the backend

const FavoritesContext = createContext() 

export const FavoritesProvider = ({children}) => {

    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const storedFavorites = localStorage.getItem("favorites")
        if (storedFavorites) setFavorites(JSON.parse(storedFavorites))
    }, [])

    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites))
    }, [favorites])

    const addToFavorites = (book) => {
        setFavorites(prev => [...prev, book])
    }

    const removeFromFavorites = (bookId) => {
        setFavorites(prev => prev.filter(book => book.key !== bookId))
    }

    const isFavorite = (bookId) => {
        return favorites.some(book => book.key === bookId)
    }

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    }

    return <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
}

export const useFavoritesContext = () => useContext(FavoritesContext)