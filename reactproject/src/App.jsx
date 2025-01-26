import React, { useState, useEffect } from 'react';
import Search from './components/Search.jsx';
import Spinner from "./Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {useDebounce} from "react-use";
import {updateSearchCount} from "./appwrite.js";

const API_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_AUTH = import.meta.env.VITE_ACCESS_TOKEN_SECRET;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_AUTH}`,
    },
};

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [movieList, setMoviesList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isloading, setIsLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    //It Debounce the searchTerm to prevent making too many API requests
    //by waiting for the user to stop typing for 500ms
    useDebounce(() => setDebouncedSearchTerm(searchTerm),500,[searchTerm])

    const fetchMovies = async (query='') => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const endpoint = query
                ? `${API_URL}/search/movie?query=${encodeURIComponent(query   )}`
                : `${API_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);
            if (!response.ok) {
                throw new Error('Failed to fetch movies.');
            }
            const data = await response.json();

            if(data.response === 'false') {
                setErrorMessage(data.ERROR || 'Failed to fetch Movies');
                setMoviesList([]);
                return ;
            }

            setMoviesList(data.results || []);
            if(query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }
        } catch (error) {
            console.error(`Error fetching movies: ${error}`);
            setErrorMessage('Error fetching movies. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    return (
        <main>
            <div className="pattern">
                <div className="wrapper">
                    <header>
                        <img src="./hero.png" alt="Hero Banner" />
                        <h1>
                            Find <span className="text-gradient">Movies</span> You'll
                            Enjoy without any Hassle
                        </h1>
                        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    </header>
                    <section className="all-movies">
                        <h2 className="mt-[40px]">All Movies</h2>

                        {isloading ? (
                            <Spinner />
                        ) : errorMessage ? (
                            <p className="text-red-500">{errorMessage}</p>
                        ) : (
                            <ul>
                                {movieList.map((movie) => (
                                   <MovieCard key={movie.id} movie={movie} />
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
};

export default App;