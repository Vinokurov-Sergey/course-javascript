// eslint-disable-next-line no-unused-vars
import photosDB from './photos.json';
// eslint-disable-next-line no-unused-vars
import friendsDB from './friends.json';

export default {
  getRandomElement (array) {
    const count = array.length;
    if (count === 0) {
      return null;
    }
    const index = Math.floor(Math.random() * count);
    return array[index];
  },
  getNextPhoto() {
    // const friendsDB = require('./friends.json');
    // const photosDB = require('./photos.json');
    const friend = this.getRandomElement(friendsDB);
    const name = friend.firstName;
    const photo = this.getRandomElement(photosDB[friend.id]);
    const url = photo.url;

    return {name, url};
  },
};
