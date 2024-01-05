import { Schema, model } from 'mongoose';

const MovieSchema = new Schema({
    title: { type: String, required: true },
    link: { type: String, required: true },
    backdrop_path: { type: String, required: true },
    poster_path: { type: String, required: true },
    description: { type: String, required: true },
    categories: { type: [String], required: true },
    actors: { type: [String], default: [] },
    addedAt: { type: Date, default: new Date() },
    nsfw: { type: Boolean, required: true },
    release_date: { type: String, required: true },
    original_title: { type: String, required: true },
    original_language: { type: String, required: true },
    tmdb_id: { type: Number, required: true },
    author: { type: String, required: true },
    time: { type: String, required: true },
    updatedAt: { type: Date, default: new Date() },
});

const MovieModel = model('movies', MovieSchema);
export default MovieModel;
