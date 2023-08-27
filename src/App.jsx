import Main from "./components/Main/Main";
import Navbar, { Logo, Search, NumResult } from "./components/Navbar";
import MovieList from "./components/Main/MovieList"
import { Box } from "./components/Main/Box";

import { useEffect, useState } from "react";
import { WatchedMoviesList, WatchedSummary } from "./components/Main/WatchedBox";
import MovieDetails from "./components/Main/MovieDetails";
import { useMovies } from "./useMovies";

// const KEY = '4f255518';

export default function App() {
  const storedValue = JSON.parse(localStorage.getItem("watched")) || [];

  const [query, setQuery] = useState("the hobbit");  
  const [watched, setWatched] = useState(storedValue);   
  const [selectedId, setSelectedId] = useState(null)
  const {movies, isLoading, error} = useMovies(query)  
 
  function handleSelectMovie(id){
    setSelectedId(selectedId => id === selectedId ? null : id)
  }

  function handleCloseMovie() {
    setSelectedId(null)
  }

  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie])

    // localStorage.setItem('watched', JSON.stringify([...watched, movie]))
  }
  
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id))
  } 

  useEffect(function() {
    localStorage.setItem("watched", JSON.stringify(watched))
  }, [watched])

   

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