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

  parseIngredients() {
    // need to write -s first, otherwise -s can not be replaced
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

    const newIngredients = this.ingredients.map (el => {
      // 1) Uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });

      // 2) Remove parentheses, google regExp
      // "1 teaspoon (heaping) Baking Powder"
      // "1 teaspoon (scant) Baking Soda"
      ingredient = ingredient.replace(/.*\([^)]*\)*/g, ' ');

      // 3) Parse ingredients into count, unit, and ingredient
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));
      let objIng;

      if (unitIndex > -1){
        // There is a unit
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount, length === 1) {
          // 4 cups, arrCount = [4],  eval --> 4
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          // 4 1/2 cups, arrCount = [4, 1/2],  eval --> 4.5
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        };
      } else if (parseInt(arrIng[0], 10)) {
        // No unit, 1st element er number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        }
      } else if (unitIndex === -1) {
        // No unit, no number
        objIng = {
          count: 1,
          unit: '',
          ingredient
        }
      }
      return objIng;
    });
    return this.ingredients = newIngredients;
  } // end of parseIngredients

} // end of class Recipe

