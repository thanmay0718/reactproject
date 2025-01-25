import React from 'react';
import Search from './components/Search.jsx';
import {useState, useEffect} from 'react'

const API_URL = 'http://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept :'application/json',
        Authorization : `Bearer ${API_KEY}`,
    }
}


const App = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const fetchMovies = async () => {
        try {
            const endpoint = `${API_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);
            if(!response.ok) {
                throw new Error('Failed to fetch movies.');
            }
            const data = await response.json();

            console.log(data);
        } catch (error) {
            console.error(`Error fetching Movies:${error}`);
            setErrorMessage('Error fetching Movies. Please try again later.');
        }
    }

    useEffect(() => {
    fetchMovies();
    }, []);



    return (
        <main>
            <div className="pattern">

            </div>

            <div className="wrapper">
                <header>
                    <img src="./hero.png" alt="Hero Banner" />
                    <h1> Find <span className="text-gradient">Movies</span> You'll Enjoy without any Hassle</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>
                <section className="all-movies">
                    <h2>All Movies</h2>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                </section>
            </div>
        </main>
    )
}
export default App;