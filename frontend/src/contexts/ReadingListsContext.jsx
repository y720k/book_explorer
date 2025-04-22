import { createContext, useState, useContext, useEffect } from 'react'
import { request } from '../utils/api_helper'
import { useUserContext } from './UserContext'
import getBooksFromIds from '../utils/utils'


const ReadingListsContext = createContext() 

export const ReadingListProvider = ({children}) => {

    const {user} = useUserContext();
    const [isUpdatingList, setIsUpdatingList] = useState(new Map());
    const [readingLists, setReadingLists] = useState(new Map());

    const fetchReadingLists = async () => {
        try {
            const response = await request("GET", `/api/users/${user.id}/reading-lists`);              
            const readingLists = response.data
            const entries = await Promise.all(
                readingLists.map(async (l) => {
                    const formattedBooks = await getBooksFromIds(l.books);
                    return [l.name, formattedBooks];
                })
            );        
            const convertedLists = new Map(entries);            
            setReadingLists(convertedLists);         
        } catch (error) {
            console.error('Failed to fetch reading lists:', error);
        }
    };

    useEffect(() => {    
        if (!user) return;        
        fetchReadingLists();
    }, [user]);

    const createReadingList = async (readingList) => {
        try {
            const readingListData = { name: readingList };
            const response = await request("POST", `/api/users/${user.id}/reading-lists`, readingListData);              
            console.log('Created Reading List:', response.data);
            fetchReadingLists();
        } catch (error) {
            console.error('Error creating reading list:', error.response ? error.response.data : error.message);
        } 
    };
    
    const addToReadingList = async (readingList, book) => {
        try {
            setIsUpdatingList((prev) => ({ ...prev, [readingList]: true }));
            const bookKey = book.key.split('/').pop();
            await request("POST", `/api/users/${user.id}/reading-lists/${readingList}/books/${bookKey}`)
            console.log(`Added book (${bookKey}) to reading list (${readingList})`)
            await fetchReadingLists(); // wait before altering the update state
        } catch (error) {
            console.error("Failed to add book to reading list:", error)            
        } finally {
            setIsUpdatingList((prev) => ({ ...prev, [readingList]: false }));
        }
    };

    const removeFromReadingList = async (readingList, book) => {
        try {
            setIsUpdatingList((prev) => ({ ...prev, [readingList]: true }));
            const bookKey = book.key.split('/').pop();
            await request("DELETE", `/api/users/${user.id}/reading-lists/${readingList}/books/${bookKey}`)
            console.log(`Removed book (${bookKey}) from reading list (${readingList})`)
            await fetchReadingLists();
            
        } catch (error) {
            console.error("Failed to remove book from reading list:", error)            
        } finally {
            setIsUpdatingList((prev) => ({ ...prev, [readingList]: false }));
        }
      };

    const removeReadingList = async (readingList) => {
        try {
            setIsUpdatingList(true);
            await request("DELETE", `/api/users/${user.id}/reading-lists/${readingList}`)
            console.log(`Removed reading list (${readingList})`)
            fetchReadingLists();
        } catch (error) {
            console.error("Failed to remove reading list:", error)
        }
    }

    const isBookInReadingList = (readingList, book) => {
        const rl = readingLists.get(readingList);
        if (rl) return rl.some((b) => b.key === book.key);
        return false;
    };

    const value = {
        readingLists,
        isUpdatingList,
        setIsUpdatingList,
        addToReadingList,
        removeFromReadingList,
        createReadingList,
        removeReadingList,
        isBookInReadingList
    }

    return <ReadingListsContext.Provider value={value}>
            {children}
        </ReadingListsContext.Provider>
}

export const useReadingListsContext = () => useContext(ReadingListsContext)