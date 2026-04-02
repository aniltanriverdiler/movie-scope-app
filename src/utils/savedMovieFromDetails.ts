import type { Movie } from "@/store/features/savedMoviesSlice";

export function movieDetailsToMovie(details: MovieDetails): Movie {
  return {
    id: String(details.id),
    title: details.title,
    poster: details.poster_path
      ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
      : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
    rating: details.vote_average,
    genre: details.genres?.map((g) => g.name).join(" • ") || "—",
  };
}
