import { createContext, useState, useContext, useEffect } from 'react'


// Can be used to store reading lists locally, without using the backend

const ReadingListsContext = createContext() 

export const ReadingListProvider = ({children}) => {

    const [readingLists, setReadingLists] = useState(new Map());

    useEffect(() => {
        const storedReadingLists = localStorage.getItem("readingLists")
        if (storedReadingLists) {
            // Convert parsed object back into a Map
            const parsedLists = new Map(Object.entries(JSON.parse(storedReadingLists)));
            setReadingLists(parsedLists);
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("readingLists", JSON.stringify(Object.fromEntries(readingLists)))
    }, [readingLists])

    const createReadingList = (readingList) => {
        setReadingLists((prev) => {
            const newMap = new Map(prev);
            if (!newMap.has(readingList)) {
                newMap.set(readingList, []);
            }
            return newMap;
        });
    };
    
    const addToReadingList = (readingList, book) => {
        setReadingLists((prev) => {
        	const newMap = new Map(prev);
          	if (newMap.has(readingList)) {
            	newMap.set(readingList, [...newMap.get(readingList), book]);
          	} else {
            	newMap.set(category, [book]);
          	}
          	return newMap;
        });
    };

    const removeFromReadingList = (readingList, book) => {
        setReadingLists((prev) => {
        	const newMap = new Map(prev);
          	if (newMap.has(readingList)) {
            	const updatedBooks = newMap.get(readingList).filter((b) => b !== book);
				if (updatedBooks.length > 0) {
					newMap.set(readingList, updatedBooks); // Update list
				}
          	}
        	return newMap;
        });
    };
    

    const removeReadingList = async (readingList) => {
        setReadingLists((prev) => {
            const newMap = new Map(prev);
            newMap.delete(readingList);
            return newMap;
        });
    };

    const isBookInReadingList = (readingList, book) => {
        return readingLists.has(readingList) && readingLists.get(readingList).some((b) => b === book);
    };

    const value = {
        readingLists,
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