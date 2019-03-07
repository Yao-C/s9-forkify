import axios from 'axios';
//import {proxy, searchAPI, key} from '../config';
import {proxy, searchAPI, key2} from '../config';

export default class Search {
  constructor(query) {
    this.query = query;
  };
  async getResults() {
    try {
      //const res = await axios(`${proxy}${searchAPI}?key=${key}&query=${this.query}`);
      const res = await axios(`${proxy}${searchAPI}?key=${key2}&query=${this.query}`);
      this.result = res.data.recipes; // Instead of get a single res, it is better to be an attribute inside Search
      //console.log(res);
    } catch(error) {
      alert(error);
    }
  }
}

