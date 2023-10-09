// eslint-disable-next-line no-unused-vars

// eslint-disable-next-line no-unused-vars

let friends;

VK.init({
  apiId: 51763971
});

export default {

  getRandomElement (array) {
    const count = array.length;
    if (count === 0) {
      return null;
    }
    const index = Math.floor(Math.random() * count);
    return array[index];
  },

  async getNextPhoto() {
    const friend = this.getRandomElement(friends.items);
    const photos = await this.getFriendPhotos(friend.id);
    const photo = this.getRandomElement(photos.items);

    let photoSize;

    (() => {
      let maxSize = 0;
      for (let size of photo.sizes) {
        if (size.width >= 360 && size.width > maxSize) {
          maxSize = size.width;
          photoSize = size;
        }
      }
    })();

      return {friend, id: photo.id, url: photoSize.url};

  },

  login() {
    return new Promise ((resolve, reject) => {
      VK.Auth.login(data => {
        if (data.session) {
          resolve();
        } else {
          reject(new Error('Не удалось авторизоваться'));
        }
      },4);
    });
  },

  async init() {
    this.photoCache = {};

    function getfriends () {
      return new Promise((resolve, reject) => {
        VK.api('friends.get',{v: '5.154', fields: 'first_name, last_name, photo_100'}, (data) => {
          if(data.Error) {
            reject(data.Error);
          } else {
            resolve(data.response);
          }
        });
      });
    }

    friends = await getfriends();
  },

  photoCache: {},

  async getFriendPhotos(id) {
    let photos = this.photoCache[id];

  if (photos) {
    return photos;
  }

  function getphotos (id) {
    return new Promise((resolve, reject) => {
      VK.api('photos.getAll',{v: '5.154', owner_id: id}, (data) => {
        if(data.Error) {
          reject(data.Error);
        } else {
          resolve(data.response);
        }
      });
    });
  }
  photos = await getphotos(id);

  this.photoCache[id] = photos;

  return photos;
},
};
