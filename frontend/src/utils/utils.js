import axios from "axios";


const getBooksFromIds = async (bookKeys) => {
    
    // fetch books using openlibrary API with saved IDs (database)
    const promises = bookKeys.map(key =>
        axios.get(`https://openlibrary.org/works/${key}.json`)
    );  

    const results = await Promise.all(promises);
    const booksData = results.map(res => res.data);
    
    // fetch author names
    const authorPromises = booksData.flatMap(book =>
        book.authors?.map(a =>
            axios.get(`https://openlibrary.org${a.author.key}.json`)
        ) || []
    );

    const authorResults = await Promise.all(authorPromises);
    const authorsByKey = {};
    authorResults.forEach(res => {
        authorsByKey[res.data.key] = res.data.name;
    });

    // For works with no first_publish_date, fetch editions and determine the earliest year
    const editionYearPromises = booksData.map(async (book) => {
        if (book.first_publish_date) return parseInt(book.first_publish_date);

        try {
            const editionsRes = await axios.get(`https://openlibrary.org${book.key}/editions.json?limit=1000`);
            const editions = editionsRes.data.entries;

            // Extract and parse years from publish_date
            const years = editions
                .map(edition => edition.publish_date)
                .filter(Boolean)
                .map(dateStr => {
                    const match = dateStr.match(/\d{4}/);
                    return match ? parseInt(match[0]) : null;
                })
                .filter(year => year !== null);
            return years.length > 0 ? Math.min(...years) : undefined;
            
        } catch (error) {
            console.error(`Error fetching editions for ${book.key}`, error);
            return undefined;
        }
    });
    const firstYears = await Promise.all(editionYearPromises);

    // Map to search-style/standard book shape
    const formattedBooks = booksData.map((b, idx) => ({
        key: b.key,
        title: b.title,
        author_name: b.authors?.map(a => authorsByKey[a.author.key]) || [],
        first_publish_year: firstYears[idx],
        cover_i: b.covers?.find(id => id !== -1) // grab first valid cover id
    }));

    return formattedBooks
}

export default getBooksFromIds;