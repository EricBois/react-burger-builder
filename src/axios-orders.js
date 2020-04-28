import axios from  'axios';

const instance = axios.create({
  baseURL: 'https://burger-creator-16439.firebaseio.com/'
})

export default instance;