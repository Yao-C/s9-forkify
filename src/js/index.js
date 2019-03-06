// Global app controller

// import { add, multiply, ID } from './views/searchView';   // import named export, multiple things

import Search from './models/Search'; 

const search = new Search('pizza');
console.log(search);
search.getResults();  