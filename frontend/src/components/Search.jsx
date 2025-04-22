import React from 'react'


const Search = ({searchTerm, setSearchTerm}) => {
    return (
        <div className='search-bar'>
            <img
                src="search.png"
                alt="search"
                className="search-icon" />
            <input 
                className='search-input'
                type="text"
                placeholder='Search a book/author/genre ...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    )
}

export default Search