import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query = query;
  };
  async getResults() {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const searchAPI = 'https://www.food2fork.com/api/search/'
    const key = 'c492ef2abfc2db30b5530e66670307f4';
    
    try {
      const res = await axios(`${proxy}${searchAPI}?key=${key}&query=${this.query}`);
      this.result = res.data.recipes;
      console.log(this.result);
    } catch(error) {
      alert(error);
    }
  }
}

