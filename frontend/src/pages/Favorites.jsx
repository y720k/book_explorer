import { useFavoritesContext } from '../contexts/FavoritesContext'
import BookCard from '../components/BookCard'
import NavBar from '../components/NavBar'
import { useNavigate } from "react-router-dom"
import { useUserContext } from '../contexts/UserContext'
import { useEffect } from 'react'


const Favorites = () => {
  
    const {favorites} = useFavoritesContext();
    const {user} = useUserContext();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!user) navigate("/login")   
    }, [])

    return (
        <main>  
            <NavBar/>
            <header>
                <h1>Favorites</h1>
            </header>
            {favorites.length > 0 ? (
                <section className="all-books">
                    <ul>
                        {favorites.map((book) => (
                            <BookCard key={book.key} bookId={book.key} book={book} /> 
                        ))}   
                    </ul>
                </section>            
                ) : <h3>No Favorites yet...</h3>    
            }
        </main>
    )
}

export default Favorites