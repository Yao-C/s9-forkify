import axios from 'axios';
import {proxy, recipeAPI, key} from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`${proxy}${recipeAPI}?key=${key}&rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
      //console.log(res);
    } catch(error) {
      alert(error);
    }

    // Assume every three ingredients need 15mins
    calcTime() {
      const numIng = this.ingredients.length;
      const periods = Math.ceil(numIng / 3);
      this.time = periods * 15;
    }

    // Assume for 4 personer
    calcServings() {
      this.servings = 4;
    }
  }
}
