const BODY_FIXED_CLASSNAME = "body-fixed";
const CARD_POPUP_ON_CLASSNAME = "card-popup-on";

const myFavorites = [
    {
        id: 0,
        imdbID: "tt1745960",
        title: "Top Gun: Maverick",
        completed: false,
        hidden: false,
    },
    {
        id: 1,
        imdbID: "tt0079501",
        title: "Mad Max",
        completed: false,
        hidden: false,
    },
];

let activeCard = {};

const bodyNode = document.querySelector("body");
const movieSearchNode = document.getElementById("movieSearch");
const movieSearchBtnNode = document.getElementById("movieSearchBtn");

// consider deletion:
let searchResultNode = document.getElementById("searchResult");

const cardPopUpNode = document.getElementById("cardPopUp");
const cardPopUpContentNode = document.getElementById("cardPopUpContent");
const cardPopUpReturnBtnNode = document.getElementById("cardPopUpReturnBtn");
const cardPopUpAddFavorBtnNode = document.getElementById(
    "cardPopUpAddFavorBtn"
);
const cardDetailsNode = document.getElementById("cardDetails");
const myFavoritesListNode = document.getElementById("myFavoritesList");

movieSearchBtnNode.addEventListener("click", function () {
    const movieName = movieSearchNode.value;
    const url = `https://www.omdbapi.com/?s=${movieName}&apikey=${key}`;
    if (movieName.length <= 0) {
        searchResultNode.innerHTML = `<h3 class="msg">Please enter a movie name...</h3>`;
    } else {
        fetch(url)
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data);
                if (data.Response === "False") {
                    renderNoFindings();
                } else {
                    renderSearchResult(data);
                }
            });
    }
});

renderFavorites();

cardPopUpReturnBtnNode.addEventListener("click", toggleCardPopUp);

cardPopUpNode.addEventListener("click", (event) => {
    const isClickOutsideContent = !event
        .composedPath()
        .includes(cardPopUpContentNode);
    if (isClickOutsideContent) {
        toggleCardPopUp();
    }
});

cardPopUpAddFavorBtnNode.addEventListener("click", function () {
    // console.log(`activeCard.imdbID = ${activeCard.imdbID}`);

    if (isActiveInFavorites()) {
        alert(`Action failed: ${activeCard.Title} is already in Favorites`);
        return;
    } else {
        addFavoriteItem(activeCard);
        renderFavorites();
        return;
    }
});

function clearInputField() {
    return (movieSearchNode.value = "");
}

function clearSearchResult() {
    return (searchResultNode.innerHTML = "");
}

function renderNoFindings() {
    searchResultNode.innerHTML = `<h3 class="msg">Sorry, nothing in database. Try again.</h3>`;
}

function renderSearchResult(result) {
    let htmlCode = "";
    clearSearchResult();

    result.Search.forEach((item) => {
        // Set path to "No Poster" image placeholder
        const posterSrc =
            item.Poster !== "N/A"
                ? item.Poster
                : "./resources/img_no-poster.png";

        htmlCode += `
        <li id="${item.imdbID}" class="movie-search__card_wrapper">
            <div class="movie-search__card_poster-wrapper">
                <img
                    class="movie-search__card_poster"
                    src="${posterSrc}"
                    alt="No Poster"
                />
            </div>
            <div class="movie-search__card_description-wrapper">
                <h3 class="movie-search__card_title">
                    ${item.Title}
                </h3>
                <p class="movie-search__card_year">${item.Year}</p>
                <p class="movie-search__card_type">${item.Type}</p>
            </div>
        </li>
        `;
    });
    searchResultNode.innerHTML = htmlCode;
    clearInputField();

    const cardSelector = document.querySelectorAll(
        // ".movie-search__card_wrapper"
        ".search-result"
    );
    cardSelector.forEach((card) => {
        card.addEventListener("click", handleCardSelector);
    });
}

function handleCardSelector(event) {
    const cardSelected = event.target.closest(".movie-search__card_wrapper");
    if (!cardSelected) return; // ignore clicks outside the card wrapper
    console.log(cardSelected);

    const cardId = cardSelected.id;
    console.log(cardId);

    console.log(`Selected Card ID ${cardId}`);
    createDetailedCard(cardId);
}

function createDetailedCard(cardId) {
    const urlCard = `https://www.omdbapi.com/?i=${cardId}&apikey=${key}`;
    fetch(urlCard)
        .then((resp) => resp.json())
        .then((data) => {
            // console.log(data);
            renderDetailedCard(data);
        });
}

function renderDetailedCard(cardData) {
    cardDetailsNode.innerHTML = "";

    // Set path to "No Poster" image placeholder
    const cardPosterSrc =
        cardData.Poster !== "N/A"
            ? cardData.Poster
            : "./resources/img_no-poster.png";

    const htmlCodeDetailed = `
    <h2 class="card-popup__title">${cardData.Title}</h2>
    <div class="card-popup__description-wrapper">
        <div class="card-popup__poster-wrapper">
            <img
                class="card-popup__poster"
                src="${cardPosterSrc}"
                alt="No Poster"
            />
        </div>
        <div class="card-popup__wrapper-inner">
            <p>Year: ${cardData.Year}</p>
            <p>Rated: ${cardData.Rated}</p>
            <p>Released: ${cardData.Released}</p>
            <p>Runtime: ${cardData.Runtime}</p>
            <p>Genre: ${cardData.Genre}</p>
            <p>Director: ${cardData.Director}</p>
            <p>Writer: ${cardData.Writer}</p>
            <p>Actors: ${cardData.Actors}</p>
        </div>
    </div>
    <p class="card-popup__plot">${cardData.Plot}</p>
    `;

    cardDetailsNode.innerHTML = htmlCodeDetailed;
    toggleCardPopUp();
    activeCard = cardData;
    console.log(activeCard);
    console.log(activeCard.imdbID);
}

function toggleCardPopUp() {
    bodyNode.classList.toggle(BODY_FIXED_CLASSNAME);
    cardPopUpNode.classList.toggle(CARD_POPUP_ON_CLASSNAME);
}

function clearMyFavorites() {
    return (myFavoritesListNode.innerHTML = "");
}

function isActiveInFavorites() {
    console.log("isActiveInFavorites function runs:");
    console.log(`activeCard.imdbID = ${activeCard.imdbID}`);
    console.log(myFavorites);

    // NOTE: the return in below cycle DOES NOT EXIT the isActiveInFavorites function!
    // myFavorites.forEach((item) => {
    //     if (item.imdbID === activeCard.imdbID) {
    //         return true;
    //     }
    // });

    // USE 'for...of' instead:
    for (const item of myFavorites) {
        console.log(`myFavorites.imdbID = ${item.imdbID}`);
        if (item.imdbID === activeCard.imdbID) {
            return true;
        }
    }
    return false;
}

function addFavoriteItem(activeCard) {
    const newFavoriteItem = {
        id: generateUniqueId(myFavorites),
        imdbID: activeCard.imdbID,
        title: activeCard.Title,
        completed: false,
        hidden: false,
    };

    console.log(newFavoriteItem);
    myFavorites.push(newFavoriteItem);
    console.log(myFavorites);
    alert(`Success: ${activeCard.Title} was added to Favorites.`);
}

function generateUniqueId(arrayList) {
    let id = 0;
    while (arrayList.some((item) => item.id === id)) {
        id++;
    }
    return id;
}

function createFavotiteItem(item) {
    const listItem = document.createElement("li");
    if (item.completed) {
        listItem.className = "display-item-wrapper completed";
    } else {
        listItem.className = "display-item-wrapper";
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `checkbox_${item.id}`;
    checkbox.className = "item-checkbox";
    checkbox.checked = item.completed;

    const label = document.createElement("label");
    label.className = "display-item";
    label.htmlFor = `checkbox_${item.id}`;
    label.innerText = item.title;

    const hideButton = document.createElement("button");
    hideButton.className = "item-hide-btn";
    hideButton.id = `btn_${item.id}`;
    // hideButton.innerText = '';

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(hideButton);

    return listItem;
}

function renderFavorites() {
    clearMyFavorites();

    myFavorites.forEach((item) => {
        if (!item.hidden) {
            const favoriteItem = createFavotiteItem(item);
            myFavoritesListNode.appendChild(favoriteItem);
            console.log(`favoriteItem : ${favoriteItem}`);
        }
    });

    const checkboxes = document.querySelectorAll(".item-checkbox");
    checkboxes.forEach((checkbox) =>
        checkbox.addEventListener("click", handleCheckboxChange)
    );

    const hideButtons = document.querySelectorAll(".item-hide-btn");
    hideButtons.forEach((button) =>
        button.addEventListener("click", handleHideButtonClick)
    );
}

function handleCheckboxChange(event) {
    const checkbox = event.target;
    // get item ID from checkbox ID
    const itemId = parseInt(checkbox.id.split("_")[1]);

    // update check-status for relvant ID
    const item = myFavorites.find((item) => item.id === itemId);
    if (item) {
        item.completed = checkbox.checked;
        console.log(`favorite item ${itemId} check-status: ${item.completed}`);
    }
    renderFavorites();
}

function handleHideButtonClick(event) {
    const button = event.target;
    // get item ID from checkbox ID
    const itemId = parseInt(button.id.split("_")[1]);

    if (!confirm("Please confirm permanent deletion")) {
        return;
    }

    // update check-status for relvant ID
    const item = myFavorites.find((item) => item.id === itemId);
    if (item) {
        item.hidden = true;
        console.log(`favorite item ${itemId} hidden-status: ${item.hidden}`);
    }
    renderFavorites();
}
