import {elements, renderLoader, clearLoader} from './views/base';
import Search from './models/Search'; 
import Recipe from './models/Recipe'; 
import List from './models/List'; 
import Likes from './models/Likes'; 
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

/*******************
 *** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};
window.state = state; // for testing 

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
    if (state.list) state.list.items = [];
    // Prepare UI for changes
    recipeView.clearRecipe();
    listView.clearList();
    renderLoader(elements.recipe)

    // Highlight selected search item
    if (state.search) searchView.highlightSelected(id);

    // Create new recipe object
    state.recipe = new Recipe(id);
    //window.r = state.recipe; // For testing
    
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
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch(err) {
      console.log(err);
    }
  }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/********************
* List Controller
*/

// window.l = new List();

const controlList = () => { // Called in recipe button handle
  if (!state.list) state.list = new List();

  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });

};

// Handle delete and update list item events - own
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  //debugger;
  // Delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state
    state.list.deleteItem(id);
    
    // Delete from UI
    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

/********************
* Likes Controller
*/
// In window load now
// state.likes = new Likes(); // fix isLiked of undefined first, for testing
// likesView.toggleLikeMenu(state.likes.getLikesNum()); // For loading is not showing also, testing

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();

  const currentID = state.recipe.id;
  if (!state.likes.isLiked(currentID)) { // Not like
    // Add like to state
    const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);
    
    // Toggle like button
    likesView.toggleLikeBtn(true); // icon-heart
    // Add like to UI list
    //console.log(state.likes);
    likesView.renderLike(newLike);
  } else {                             // Liked
    // Remove like from state
    state.likes.deleteLike(currentID);
    // Toggle like from button
    likesView.toggleLikeBtn(false); // icon-heart-outlined
    // Remove like from UI list
    //console.log(state.likes);
    likesView.deleteLike(currentID);
  }

  likesView.toggleLikeMenu(state.likes.getLikesNum());
};


// Restore liked recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();
  state.likes.readStorage(); // Restore likes
  likesView.toggleLikeMenu(state.likes.getLikesNum());
  state.likes.likes.forEach(like => likesView.renderLike(like));
});


// Handle recipe button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsView(state.recipe);
    } 
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc');
    recipeView.updateServingsView(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    controlLike();
  }
});