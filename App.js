const container = document.querySelector(".movie-container");
let favouriteMovies = JSON.parse(localStorage.getItem("favourite-movie")) || [];
let allMovies = [];
let currPage = 1;

const sortRealeaeBtn = document.getElementById("sort-by-date");
const sortRatingBtn = document.getElementById("sort-by-rating");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const currBtn = document.getElementById("curr-btn");
const allBtn = document.getElementById("all-btn");
const favBtn = document.getElementById("fav-btn");
const movieSearchBtn = document.getElementById("movie-searchBtn");
const inputByUser = document.getElementById("input-movie");

sortRealeaeBtn.addEventListener("click", handleSortReleaseBTN);
sortRatingBtn.addEventListener("click", handleSortRatingBTN);
prevBtn.addEventListener("click", () => handleNextPrevBtn(currPage - 1));
nextBtn.addEventListener("click", () => handleNextPrevBtn(currPage + 1));
favBtn.addEventListener("click", handleFavourateBtn);
allBtn.addEventListener("click", handleAllBtn);
movieSearchBtn.addEventListener("click", () => handleSearch(inputByUser.value));

async function callAPI() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=${currPage}`
  );
  const data = await res.json();
  allMovies = data.results;
  displatData(allMovies);
}

function displatData(movies) {
  const movieContainer = document.querySelector(".movie-container");
  movieContainer.innerHTML = "";
  movies.forEach((movie) => {
    let isFav = favouriteMovies.some((mov) => mov.id == movie.id);
    const id = movie.id;

    const div = document.createElement("div");
    const img = document.createElement("img");
    const i = document.createElement("i");
    const h3 = document.createElement("h3");
    const p1 = document.createElement("p");
    const p2 = document.createElement("p");
    img.src = `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`;
    img.alt = "movie-img";
    i.className =
      (isFav ? "fa-solid" : "fa-regular") + " fa-heart fa-2xl heart-logo";
    h3.textContent = movie.title;
    p1.textContent = `Votes: ${movie.vote_count}`;
    p2.textContent = `Rating: ${movie.vote_average}`;
    i.addEventListener("click", (e) => handleFavourate(id, e));
    div.appendChild(img);
    div.appendChild(i);
    div.appendChild(h3);
    div.appendChild(p1);
    div.appendChild(p2);
    div.className = "movie-card";
    container.appendChild(div);
  });
}

function handleFavourate(id, ele) {
  ele = ele.target;
  if (ele.classList.contains("fa-regular")) {
    //favourite
    ele.classList.remove("fa-regular");
    ele.classList.add("fa-solid");
    let currentFavMovie = allMovies.filter((movie) => movie.id == id);
    favouriteMovies.push(currentFavMovie[0]);
  } else {
    //remove favourite
    ele.classList.remove("fa-solid");
    ele.classList.add("fa-regular");
    let curr = favouriteMovies.filter((movie) => movie.id != id);
    favouriteMovies = curr;
  }
  if (favBtn.classList.contains("active-btn")) displatData(favouriteMovies);
  addToLocalStorage();
}

function addToLocalStorage() {
  localStorage.setItem("favourite-movie", JSON.stringify(favouriteMovies));
}

function sortOnRating() {
  allMovies.sort((a, b) => a.vote_average - b.vote_average);
}

function sortOnDate() {
  allMovies.sort(
    (a, b) =>
      new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
  );
}

function handleSortRatingBTN() {
  sortOnRating();
  displatData(allMovies);
}

function handleSortReleaseBTN() {
  sortOnDate();
  displatData(allMovies);
}

function handleNextPrevBtn(num) {
  if (num === 3) nextBtn.disabled = true;
  else if (num === 1) prevBtn.disabled = true;
  else if (prevBtn.disabled) prevBtn.disabled = false;
  else if (nextBtn.disabled) nextBtn.disabled = false;
  currPage = num;
  callAPI();
  currBtn.textContent = `Current Page: ${currPage}`;
}

function handleFavourateBtn(e) {
  e.target.classList.add("active-btn");
  allBtn.classList.remove("active-btn");
  if (favouriteMovies.length > 0) displatData(favouriteMovies);
  else {
    container.innerHTML = `<h1>No Favourate Movies</h1>`;
  }
}

function handleAllBtn(e) {
  e.target.classList.add("active-btn");
  favBtn.classList.remove("active-btn");
  displatData(allMovies);
}

function handleSearch(inp) {
  let filteredArr = allMovies.filter((movie) =>
    movie.title.toLowerCase().includes(inp.toLowerCase())
  );
  displatData(filteredArr);
}

callAPI();
