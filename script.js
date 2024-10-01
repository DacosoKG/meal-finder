const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  single_mealEl = document.getElementById("single-meal");

// Get a random meal
const randomUrl = "https://www.themealdb.com/api/json/v1/1/random.php";
// Search a meal by id, i.e. i=53031
const searchUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
// Search a meal by string input, i.e. s=egg
const searchByQueryStrUrl =
  "https://www.themealdb.com/api/json/v1/1/search.php?s=";

random.addEventListener("click", getRandomMeal);

function getRandomMeal() {
  fetchData();
}

function fetchData() {
  fetch(randomUrl)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.meals[0]);
      addSingleMealToDOM(data.meals[0]);
    })
    .catch((err) => console.log(err));
}

//! RANDOM

function addSingleMealToDOM(singleMeal) {
  const { strInstructions, strMeal, strMealThumb, strCategory, strArea } =
    singleMeal;

  // strIngredient1 -  strMeasure1

  const ingredients = []; // [ <li>Egg Plants - 1 lb</li>, <li>Sugar - 2 tbs</li> ]

  for (let i = 1; i <= 20; i++) {
    if (singleMeal["strIngredient" + i]) {
      const sinleIngredient = `<li>${singleMeal["strIngredient" + i]} - ${
        singleMeal["strMeasure" + i]
      }</li>`;
      ingredients.push(sinleIngredient);
    }
  }

  const stringIngredients = ingredients.join("");

  const singleMealElement = `<div class="single-meal">
                                <h1>${strMeal}</h1>
                                <img
                                  src="${strMealThumb}"
                                  alt="${strMeal}"
                                />
                                <div class="single-meal-ingo">
                                  <p>${strCategory}</p>
                                  <p>${strArea}</p>
                                </div>
                                <div class="main">
                                  <p>
                                ${strInstructions}
                                  </p>
                                  <h2>Ingredients</h2>
                                  <ul>
                                    ${stringIngredients}
                                  </ul>
                                </div>
                              </div> `;

  single_mealEl.innerHTML = singleMealElement;
}

submit.addEventListener("submit", searchMeals);

//! SEARCH MEALS

function searchMeals(event) {
  event.preventDefault();

  const queryString = search.value.trim();

  if (queryString) {
    fetch(searchByQueryStrUrl + queryString)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        addMealstoDOM(data.meals, queryString);
      })
      .catch((err) => console.log(err));
  }

  search.value = "";
}

function addMealstoDOM(meals, queryStr) {
  mealsEl.innerHTML = "";
  if (meals === null) {
    //If data doesn't exist
    resultHeading.innerHTML = `<h2>There are no search results. Try again!</h2>`;
  } else {
    //If data exists
    resultHeading.innerHTML = `<h2>Search results for '${queryStr}':</h2>`;
  }

  meals.forEach((meal) => {
    const { strMeal, strMealThumb, idMeal } = meal;
    const eachMeal = `<div class="meal">
                        <img
                          src="${strMealThumb}"
                          alt="${strMeal}"
                        />
                        <div onclick="getMealById(${idMeal})" class="meal-info">
                          <h3>E${strMeal}</h3>
                        </div>
                      </div>`;
    mealsEl.innerHTML += eachMeal;
  });
}

function getMealById(id) {
  fetch(searchUrl + id)
    .then((res) => res.json())
    .then((data) => {
      addSingleMealToDOM(data.meals[0]);
    })
    .catch((err) => console.log(err));
}
