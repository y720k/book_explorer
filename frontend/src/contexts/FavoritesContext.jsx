import { createContext, useState, useContext, useEffect } from 'react'
import { useUserContext } from './UserContext'
import { request } from '../utils/api_helper'
import getBooksFromIds from '../utils/utils'


const FavoritesContext = createContext() 

export const FavoritesProvider = ({children}) => {

    const {user} = useUserContext();
    const [favorites, setFavorites] = useState([]);
    
    const fetchFavorites = async () => {
        try {
            const response = await request("GET", `/api/users/${user.id}/favorites`);              
            const bookKeys = response.data
            const formattedBooks = await getBooksFromIds(bookKeys)
            setFavorites(formattedBooks);               

        } catch (error) {
            console.error('Failed to fetch favorites:', error);
        }
    };

    useEffect(() => {    
        if (!user) return;        
        fetchFavorites();
    }, [user]); // fetch favorites when user changes 

    const addToFavorites = async (book) => {
        try {           
            const k = book.key.split('/').pop();
            await request("POST", `/api/users/${user.id}/favorites/${k}`)
            fetchFavorites()
        } catch (error) {
            console.error('Failed to add book to favorites:', error);
        }
    }

    const removeFromFavorites = async (bookId) => {
        try {
            const k = bookId.split('/').pop();
            await request("DELETE", `/api/users/${user.id}/favorites/${k}`)
            fetchFavorites()
        } catch (error) {
            console.error('Failed to remove book from favorites:', error);
        }
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

