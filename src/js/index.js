// Global app controller

// import { add, multiply, ID } from './views/searchView';   // import named export, multiple things

import Search from './models/Search'; 

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
  const query = 'pizza'; // To do

  if(query) {
    // 2) New search object and add to the state
    state.search = new Search(query);

    // 3) Prepare UI for results

    // 4) Seach for recipes
    await state.search.getResults();

    // 5) Render result on UI
    console.log(state.search.result);
  }
}

document.querySelector('.search').addEventListener('submit', e=>{
  e.preventDefault();
  controlSearch();
})