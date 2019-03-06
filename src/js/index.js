// Global app controller

// import str from './models/Search';   // import default export
// import { add, multiply, ID } from './views/searchView';   // import named export, multiple things

import axios from 'axios';

async function getResults(query) {
  const proxy = 'https://cors-anywhere.herokuapp.com/';
  const searchAPI = 'https://www.food2fork.com/api/search/'
  const key = 'c492ef2abfc2db30b5530e66670307f4';
  
  try {
    const res = await axios(`${proxy}${searchAPI}?key=${key}&query=${query}`);
    const recipes = res.data.recipes;
    console.log(recipes);
  } catch(error) {
    alert(error);
  }
};

getResults('tomato');
