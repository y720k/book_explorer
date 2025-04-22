import { useState, useEffect } from 'react';
import BookCardSlider from "../components/BookCardSlider";
import NavBar from '../components/NavBar'
import { useReadingListsContext } from '../contexts/ReadingListsContext';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';


const ReadingLists = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [listName, setListName] = useState("");
    const navigate = useNavigate();

    const {readingLists, createReadingList, removeReadingList} = useReadingListsContext();
    const {user} = useUserContext();
    
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    useEffect(() => {
        if (!user) navigate("/login")   
    }, [])

    const saveList = () => {
        if (listName.trim() !== "") {
            createReadingList(listName);
            setListName("");
            closeModal();
        }
    };
    
    return (
        <div>
            <NavBar/>
            <header>
                <h1>Reading Lists</h1>
            </header>
            <div>
                <button onClick={openModal} className="reading-list-btn mx-auto block">
                    {/* ➕ Create New Reading List 📚 */}
                    <div class="flex items-center space-x-2">
                        <span>Create New Reading List</span>
                        <svg class="w-[24px] h-[24px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                        </svg>
                    </div>  
                </button>
            </div>

            <ul className="mt-4">
                    {[...readingLists.entries()].map(([listName, books]) => (
                        <div key={listName}>
                            <div className="flex items-center justify-between">
                                <h3 className='text-white'>List: {listName}</h3>
                                <button onClick={() => removeReadingList(listName)} aria-label={`Remove list "${listName}"`} className="transition-transform duration-200 hover:scale-125">
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                                    </svg>
                                </button>
                            </div>
                            <BookCardSlider books={books} />            
                        </div>
                    ))}     
            </ul>

            {/* Modal */}
            {isOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-3">Create New Reading List</h2>
                        <input 
                            type="text" 
                            value={listName} 
                            onChange={(e) => setListName(e.target.value)}
                            placeholder="List name..."
                            className="modal-input"
                        />
                        <div className="modal-buttons">
                            <button onClick={saveList} className="save-btn">Save</button>
                            <button onClick={closeModal} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReadingLists;