import {elements, renderLoader, clearLoader} from './views/base';
import Search from './models/Search'; 
import Recipe from './models/Recipe'; 
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

/*******************
 *** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

 const state = {};


/********************
* Search Controller
*/

const controlSearch = async() => {
  // 1) Get query from view
  // const query = 'pizza'; // To do
  const query = searchView.getInput();

  if(query) {
    // 2) New search object and add to the state
    state.search = new Search(query);

    // 3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    // debugger;
    try {
      // 4) Seach for recipes
      await state.search.getResults();

      // 5) Render result on UI
      clearLoader();
      // console.log(state.search.result);
      searchView.renderResults(state.search.result);
    } catch(err) {
      alert('Wrong with search...');
      clearLoader();
    }
    
  }
}

elements.searchForm.addEventListener('submit', e=>{
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if(btn) {
    const goTOPage = parseInt(btn.dataset.goto, 10) // base 10, 0-9
    searchView.clearResults();
    searchView.renderResults(state.search.result, goTOPage);
  }
});

/********************
* Recipe Controller
*/

const controlRecipe = async() => {
  // Get ID from URL
  const id = window.location.hash.replace('#', '');

  if(id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe)

    // Highlight selected search item
    if (state.search) searchView.highlightSelected(id);

    // Create new recipe object
    state.recipe = new Recipe(id);
    window.r = state.recipe; // For testing
    
    try {
      // Get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render recipe
      //console.log(state.recipe);
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch(err) {
      console.log(err);
    }
  }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));