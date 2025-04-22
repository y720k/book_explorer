import { useEffect, useState } from "react"
import { useFavoritesContext } from '../contexts/FavoritesContext';
import { useReadingListsContext } from '../contexts/ReadingListsContext';
import { useModalContext } from '../contexts/ModalContext';
import { useBookContext } from '../contexts/BookContext';


const BookCard = ({bookId, book}) => {
    const { title, cover_i, author_name, first_publish_year, key } = book;

    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const {isFavorite, addToFavorites, removeFromFavorites} = useFavoritesContext();
    const {readingLists, addToReadingList, removeFromReadingList, isBookInReadingList, isUpdatingList, setIsUpdatingList} = useReadingListsContext();
    const {isModalOpen, setModal} = useModalContext();
    const {setCurrentBook, setCurrentDescription} = useBookContext();
    
    const favorite = isFavorite(key)
    
    useEffect(() => {
        setIsLiked(favorite ? true : false); 
    }, [isHovered]) 

    const onFavoriteClick = (e) => {
        setIsLiked((isLiked) => !isLiked); // instant feedback
        if (favorite) removeFromFavorites(key);
        else addToFavorites(book);

        console.log(book.key)
    }  

    const handleListModification = (e, readingList) => {
        e.stopPropagation(); // stop click event bubbling up to parent element
        isBookInReadingList(readingList, book) ? removeFromReadingList(readingList, book) : addToReadingList(readingList, book)
    }

    const fetchDescription = async (bookId = "") => {
        setIsLoading(true);

        try {
            const response = await fetch(`https://openlibrary.org${bookId}.json`);
            if (!response.ok) throw new Error("Failed to fetch description")
            
            const data = await response.json();        
            if (data.Response === "False") {
                console.error(data.Error || "Failed to fetch description");
                setCurrentDescription("");
                return;
            }

            const bookDescription = data.description?.value || data.description;
            if (bookDescription) {
                setCurrentDescription(bookDescription);
                return;
            }

            // If no description, wait 5 seconds before setting fallback
            setTimeout(() => {
                setCurrentDescription("No description available.");
            }, 5000);

        } catch (error) {
            console.error(`Error fetching description: ${error}`);
        } finally {
            setIsLoading(false);
        }
    }
    
    const onDesciptionClick = () => {
        fetchDescription(key);
        setCurrentBook(book); // info used by global modal
        setModal(!isModalOpen)
    }
    
    return (
        <div
            className='book-card'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {setIsHovered(false), setIsListModalOpen(false)}}
            >
                {cover_i ? 
                    <img src={`https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`} alt={title}/>
                    :
                    <div className='no-cover'>
                        No cover available
                    </div>
                }               
                <h2>{title}</h2>
                <p>{!author_name ? "Unknown Author" : (
                    author_name.length > 1 ? `${author_name[0]} and others` : author_name[0]     
                )} • {first_publish_year}</p>
                {isHovered && (
                    <>
                        <button className="heart-btn" onClick={onFavoriteClick}>
                            {isLiked ? <svg className="w-[24px] h-[24px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z"/>
                                    </svg> : 
                                    <svg className="w-[24px] h-[24px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"/>
                                    </svg>
                            }                                        
                        </button>

                        <button onClick={() => setIsListModalOpen(true)} className="modify-reading-list-btn">
                            <svg className="w-[24px] h-[24px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>
                        </button>

                        <div>
                            <button onClick={onDesciptionClick} className='description-btn'>
                                <svg className="w-[24px] h-[24px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.529 9.988a2.502 2.502 0 1 1 5 .191A2.441 2.441 0 0 1 12 12.582V14m-.01 3.008H12M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                </svg>
                            </button>
                        </div>

                        {isListModalOpen && (
                            <div className="modal-overlay" onClick={() => setIsListModalOpen(false)}>
                                <div className="book-card-modal-title" onClick={(e) => e.stopPropagation()}>
                                    <h4 className='font-semibold'>
                                        {readingLists.size > 0 ? "Add/Remove from reading list" : "No reading lists available"}
                                    </h4>
                                </div>
                                
                                {readingLists.size > 0 &&
                                    <div className='book-card-modal-content'>
                                        {/* spread iterator of key-value-pairs into array */}
                                        {[...readingLists.entries()].map(([listName, books]) => (
                                            <button key={listName} onClick={(e) => handleListModification(e, listName)} className='bg-gradient-to-br from-purple-900 to-purple-950 hover:from-purple-700 hover:to-purple-950 text-white px-3 py-1 rounded-md transition break-words'>

                                                {isUpdatingList[listName] ? (
                                                    <div className="flex justify-center">
                                                        <svg aria-hidden="true" class="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                                        </svg>
                                                    </div>
                                                ) : `${isBookInReadingList(listName, book) ? "Remove from" : "Save to"} ${listName}`
                                                }
                                            </button>
                                        ))}
                                    </div>
                                }
                            </div>
                        )}
                    </>
                )}  
        </div>
  )
}

export default BookCard