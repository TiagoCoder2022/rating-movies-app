import React, { useEffect, useRef } from 'react'
import { useKey } from '../useKey'


const Navbar = ({ children }) => {  
  return (
    <nav className="nav-bar">
      {children}
    </nav>
  )
}

export function Logo() {
  return (
    <div className="logo">
      <span role="img">🎬</span>
      <h1>MovieRating</h1>
    </div>
  )
}

export function Search({query, setQuery}) { 
  const inputEl = useRef(null)

  useKey("Enter", function() {
    if(document.activeElement === inputEl.current) return
    inputEl.current.focus()
    setQuery("")  
  })
  

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  )
}

export function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  )
}

export default Navbar
