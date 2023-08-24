import Main from "./components/Main/Main";
import Navbar, { Logo, Search, NumResult } from "./components/Navbar";
import MovieList from "./components/Main/MovieList"
import { Box } from "./components/Main/Box";

import { useEffect, useState } from "react";
import { WatchedMoviesList, WatchedSummary } from "./components/Main/WatchedBox";
import MovieDetails from "./components/Main/MovieDetails";

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const KEY = '4f255518';

export default function App() {
  const [query, setQuery] = useState("the hobbit");   
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedId, setSelectedId] = useState(null)

  function handleSelectMovie(id){
    setSelectedId(selectedId => id === selectedId ? null : id)
  }

  function handleCloseMovie() {
    setSelectedId(null)
  }

  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie])
  }
  
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id))
  } 

  useEffect(function() {
    const controller = new AbortController();

    async function fetchMovies() {      
      try {
        setIsLoading(true)
        setError("")
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {signal: controller.signal})

        if(!res.ok)
        throw new Error("Something went wrong with fetching movies")
      
        const data = await res.json()
        if(data.Response === 'False') throw new Error("Movie not found")
        setMovies(data.Search) 
        setError("")     
        
      }  catch (err) {        
        if(err.name !== "AbortError") {
          console.error(err.message)
          setError(err.message)
        }

      } finally {
        setIsLoading(false) 
      }
    } 

    if(query.length < 3) {
      setMovies([])
      setError("")
      return
    }

    handleCloseMovie()
    fetchMovies()

    return function () {
      controller.abort();
    };      
    
  }, [query])     

  return (
    <>
      <Navbar>
        <Logo/>
        <Search query={query} setQuery={setQuery}/>
        <NumResult movies={movies}/>
      </Navbar>

      <Main>
        <Box>
          {isLoading && <Loader/>}
          {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie}/>}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>          
          { selectedId ? (
          <MovieDetails 
            selectedId={selectedId} 
            onCloseMovie={handleCloseMovie}
            onAddWatched={handleAddWatched}
            watched={watched}
            />
          ) : (
            <>
              <WatchedSummary  watched={watched} />
              <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched}/>      
            </> 
          )}
        </Box>
      </Main>    
    </>
  );
}

export function Loader() {
  return(
    <p className="loader">Loading...</p>
  )
}

function ErrorMessage({message}) {
  return <p className="error">
    <span>⛔</span> {message}
  </p>
}