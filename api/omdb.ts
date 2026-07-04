import axios from "axios";

const API_KEY = "1ffa7507";

export const API = axios.create({
    baseURL: "https://www.omdbapi.com/",
})

export const Search_Movies = async (query: string) => {
    const res = await API.get("/", {
        params: {
            s: query,
            apiKey: API_KEY
        }
    });
    return res.data;
}

// get featured movie list

export const LatestMovies = async () => {
    const res = await API.get("/", {
        params: {
            s: "movie",
            type: "movie",
            apiKey: API_KEY,
        }
    });
    return res.data;
}


// get featured movie list

export const HighRatedMovies = async () => {
    const currentYear = new Date().getFullYear().toString();
    const res = await API.get("/", {
        params: {
            s: "movie",
            type: "movie",
            apiKey: API_KEY,
            y: currentYear,
        }
    });
    return res.data;
}

// get movie by ID

export const getMovieById = async (id: string) => {
    const res = await API.get("/", {
        params: {
            i: id,
            apiKey: API_KEY,
            plot: "full"
        }
    });
    return res.data;
}
