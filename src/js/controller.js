import * as modal from './modal.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { async } from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    resultsView.update(modal.getSearchResultsPage());
    bookmarksView.update(modal.state.bookmarks);
    // 1. Loading the recipe
    await modal.loadRecipe(id);

    // 2. render recipe
    recipeView.render(modal.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();

    await modal.loadSearchResults(query);
    // if (modal.state.search.results.length === 0) {
    //   throw 'No results found for that query! Please try again :)';
    // }
    resultsView.render(modal.getSearchResultsPage());
    // pagination section
    paginationView.render(modal.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(modal.getSearchResultsPage(goToPage));
  paginationView.render(modal.state.search);
};

const controlServings = function (newServings) {
  // update the recipe servings (in state)
  modal.updateServings(newServings);
  // update the view
  // recipeView.render(modal.state.recipe);
  recipeView.update(modal.state.recipe);
};

const controlAddBookmark = function () {
  // add / remove bookmark
  if (!modal.state.recipe.bookmarked) modal.addBookmark(modal.state.recipe);
  else modal.delBookmark(modal.state.recipe.id);
  // update recipe view
  recipeView.update(modal.state.recipe);
  // render bookmarks
  bookmarksView.render(modal.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(modal.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    // console.log(object);
    // Upload the new recipe data
    await modal.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(modal.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(modal.state.bookmarks);

    // change id url ( state, title, url)
    window.history.pushState(null, '', `#${modal.state.recipe.id}`);
    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    // console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('Welcome to the application');
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};

init();
