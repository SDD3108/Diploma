import React,{useState,useMemo} from 'react'

export const SearchAndSort = (events) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [genre, setGenre] = useState('')
    const [rating, setRating] = useState(0)
    const [sortOrder, setSortOrder] = useState('asc')
    const filteredEvents = useMemo(() => {
      return events.filter((event) => event.title?.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((event) => genre ? event.genre?.toLowerCase() == genre.toLowerCase() : true)
      .filter((event) => Number(event.rating) >= rating)
      .sort((a,b) => sortOrder == 'asc' ? Number(a.rating) - Number(b.rating) : Number(b.rating) - Number(a.rating))
    },[events, searchTerm, genre, rating, sortOrder])
    const genres = ['anime', 'biographical', 'action', 'war', 'detective', 'childrens', 'documentary', 'drama','historical','comedy',
      'concert','short','crime','melodrama','mysticism','cartoon','musical','scientific','noir','adventure','reality show',
      'family','sports','talk show','thriller','horror','sci-fi','fantasy',
    ]
    return {
      filteredEvents,
      genres,
      searchTerm,
      setSearchTerm,
      genre,
      setGenre,
      rating,
      setRating,
      sortOrder,
      setSortOrder
    }
}

// export default SearchAndSort