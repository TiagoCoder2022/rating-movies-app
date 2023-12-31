import { useEffect, useRef, useState } from "react"
import StarRating from "../../StarRating";
import { Loader } from "../../App";
import { useKey } from "../../useKey";

const KEY = '4f255518';

export default function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState('')

  const countRef = useRef(0)

  useEffect(function() {
    if (userRating) countRef.current = countRef.current + 1
  }, [userRating])

  const isWatched = watched.map(movie => movie.imdbID).includes(selectedId)
  const watchedUserRating = watched.find(movie => movie.imdbID === selectedId)?.userRating

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie

  function handleAdd() {
    const newWathedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    }
    onAddWatched(newWathedMovie)
    onCloseMovie()
  }

  useKey("Escape", onCloseMovie)

  useEffect(function() {
    async function getMovieDetails() {
      setIsLoading(true)
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`)
      const data = await res.json()
      setMovie(data)
      setIsLoading(false)
    }
    getMovieDetails()
  },[selectedId])

  useEffect(function() {
    if (!title) return
    document.title = `Movie | ${title}`

    return function () {
      document.title = " 🎬 MovieRating"
    }
  }, [title])

  return (
    <div className="details">
      {isLoading ? <Loader/> : (
       <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie}`} />        
            <div className="details-overview">
              <h2>{title}</h2>
              <p>{released} &bull; {runtime}</p>
              <p>{genre}</p>
              <p><span>⭐</span>{imdbRating} IMDb rating</p>
            </div>
          </header>  

          <section>
            <div className="rating">
              {!isWatched ? (
              <> 
                <StarRating 
                  maxRating={10} 
                  size={24}
                  onSetRating={setUserRating}
                />

                {userRating > 0 && (
                  <button className="btn-add" onClick={handleAdd}>
                    + Add to the list
                  </button>
                  )}
              </> 
              ) : (
                <p>You rated this movi with {watchedUserRating} <span>⭐</span></p>
            )}
              
            
            </div>
            <p><em>{plot}</em></p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>  
      )}
      <header></header>       
    </div>
  )
}