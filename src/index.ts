import axios from 'axios';
import { config } from 'dotenv';
import { connect } from 'mongoose';

import MovieModel from './model';

// @ts-ignore
const data = require('../data.json') as typeof import('../data2.json');
// @ts-ignore
const genres = require('../genres.json') as typeof import('../genres.json');

interface SearchResults {
    page: number;
    results: {
        adult: boolean;
        backdrop_path: string;
        genre_ids: number[],
        id: number;
        original_language: string;
        original_title: string;
        overview: string;
        poster_path: string;
        release_date: string;
        title: string;
        video: boolean;
        vote_average: number;
        vote_count: number;
    }[];
    total_pages: number;
    total_results: number;
}

// populate `process.env`
config();

// define new API instance
const api = axios.create({
    baseURL: "https://api.themoviedb.org/3/",
    headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
    },
});

const reqApi = (name: string) => api.get<SearchResults>('/search/movie?query=' + name);

// @ts-ignore // mongoose connect
connect(process.env.MONGO_URI!, {}).then(() => {
    data.forEach((e, k) => setTimeout(async () => { try {
        const res = await reqApi(e.name);
        const {
            title,
            adult,
            genre_ids,
            id,
            backdrop_path,
            original_language,
            original_title,
            overview,
            poster_path,
            release_date,
        } = res.data.results[0];

        // get genres
        const filmGenres = genre_ids.map(g => (
            genres.find(v => v.id === g)?.name || "0"
        )).filter(e => e !== "0");

        await MovieModel.create({
            title,
            link: e.uqload,
            backdrop_path,
            poster_path,
            description: overview,
            categories: filmGenres,
            actors: e.actors.split(', '),
            nsfw: adult,
            release_date,
            original_title,
            original_language,
            tmdb_id: id,
            author: e.author,
            time: e.time,
        });
        console.log("Added:", e.name);
    } catch (err) {
        console.error("An error has occured:", e.name);
    }}, k*200));
});
