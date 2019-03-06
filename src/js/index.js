// Global app controller

// import { add, multiply, ID } from './views/searchView';   // import named export, multiple things

import {elements} from './views/base';
import Search from './models/Search'; 
import * as searchView from './views/searchView';

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

    // 4) Seach for recipes
    await state.search.getResults();

    // 5) Render result on UI
    // console.log(state.search.result);
    searchView.renderResults(state.search.result);
  }
}

elements.searchForm.addEventListener('submit', e=>{
  e.preventDefault();
  controlSearch();
})