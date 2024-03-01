import { useState, useEffect } from "react";
import { Col, Container, Image, Navbar, Row, Card } from "react-bootstrap";
import HeroImg from "./assets/images/the-movie-verse.png";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  // Get movies from API
  const getMovieRequest = async (value) => {
    const url = `http://www.omdbapi.com/?s=${value}&apikey=${
      import.meta.env.VITE_API_KEY
    }`;

    try {
      const response = await fetch(url);
      const responseJson = await response.json();

      if (responseJson.Search) {
        setMovies(responseJson.Search);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Get searched movies from API
  useEffect(() => {
    getMovieRequest(searchValue);
  }, [searchValue]);

  // Get favorite movies from local storage
  useEffect(() => {
    const movieFavorites = JSON.parse(localStorage.getItem("favoriteMovies"));
    if (movieFavorites) {
      setFavoriteMovies(movieFavorites);
    }
  }, []);

  // Save to local storage
  const saveToLocalStorage = (items) => {
    localStorage.setItem("favoriteMovies", JSON.stringify(items));
  };

  // Remove from favorite movies
  const removeFavoriteMovie = (movie) => {
    const newFavoriteList = favoriteMovies.filter(
      (favorite) => favorite.imdbID !== movie.imdbID
    );
    setFavoriteMovies(newFavoriteList);
    saveToLocalStorage(newFavoriteList);
  };

  // Add to favorite movies
  function addToFavoriteMovies(movie) {
    const newFavoriteList = [...favoriteMovies, movie];
    setFavoriteMovies(newFavoriteList);
    saveToLocalStorage(newFavoriteList);
  }

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#">🎥Movie-Verse</Navbar.Brand>
        </Container>
      </Navbar>

      <Container>
        {/* HERO */}
        <Col className="d-flex pt-5 align-items-center">
          <Row>
            <h1 className="hero-text">Welcome to the Movie Verse</h1>
            <p className="hero-description">
              Find and save your favorite Movies
            </p>
          </Row>
          <Row>
            <Image src={HeroImg} />
          </Row>
        </Col>

        {/* MOVIE SEARCH INPUT */}
        <div className="row d-flex align-items-center mt-4">
          <div className="col">
            <h2>Movie List: </h2>
          </div>
          <div className="col">
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search for a movie..."
              className="form-control"
              type="text"
            />
          </div>
        </div>

        {/* MOVIE SEARCH OUTPUT */}

        <Container className="row nowrap">
          {movies.map((movie) => {
            return (
              <Card
                style={{ width: "20rem" }}
                key={movie.imdbID}
                className="mx-3 my-4 p-2 "
              >
                <Card.Img variant="top" src={movie.Poster} />
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <Card.Title className="mt-2 text-center">
                    {movie.Title} ({movie.Year})
                  </Card.Title>
                  <FaRegHeart
                    className="like-icon"
                    onClick={() => addToFavoriteMovies(movie)}
                  />
                </Card.Body>
              </Card>
            );
          })}
        </Container>

        {/* FAVORITE MOVIES */}

        <h2 className="mt-5">Favorite Movies:</h2>

        <Container className="row nowrap">
          {favoriteMovies.length === 0 ? (
            <h3 className="text-center bg-body-tertiary p-5 text-secondary">
              No favorite movies added, yet.
            </h3>
          ) : (
            favoriteMovies.map((favoriteMovie) => {
              return (
                <Card
                  style={{ width: "20rem" }}
                  key={favoriteMovie.imdbID}
                  className="mx-3 my-4 p-2 "
                >
                  <Card.Img variant="top" src={favoriteMovie.Poster} />
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <Card.Title className="mt-2 text-center">
                      {favoriteMovie.Title} ({favoriteMovie.Year})
                    </Card.Title>
                    <FaHeart
                      className="like-icon"
                      onClick={() => removeFavoriteMovie(favoriteMovie)}
                    />
                  </Card.Body>
                </Card>
              );
            })
          )}
        </Container>
      </Container>
    </>
  );
};

export default App;
