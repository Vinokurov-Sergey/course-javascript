// eslint-disable-next-line no-unused-vars

// eslint-disable-next-line no-unused-vars

const userID = 51763971;
let friends;

VK.init({
  apiId: userID
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

  getPhotoSize(photo) {
    let maxSize = 0;
    let photoSize;
      for (let size of photo.sizes) {
        if (size.width >= 360 && size.width > maxSize) {
          maxSize = size.width;
          photoSize = size;
        }
      }
      return photoSize;
  },

  async getNextPhoto() {
    const friend = this.getRandomElement(friends.items);
    const photos = await this.getFriendPhotos(friend.id);
    const photo = this.getRandomElement(photos.items);

    let photoSize = this.getPhotoSize(photo);

    return {friend, id: photo.id, url: photoSize.url};

  },

  token: {},

  login() {
    return new Promise ((resolve, reject) => {
      VK.Auth.login(data => {
        if (data.session) {
          this.token = data.session.sid;
          resolve();
        } else {
          reject(new Error('Не удалось авторизоваться'));
        }
      },4);
    });
  },

  user: {},

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
    
    this.user = await this.getUsers(userID);
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

logout() {
  return new Promise ((resolve) => {
    VK.Auth.revokeGrants(resolve);
  });
},

getFriends() {},

async getUsers(ids) {
    const users = (ids) => {
    return new Promise((resolve, reject) => {
      VK.api('users.get',{v: '5.154', ids, fields: 'photo_100'}, (data) => {
        if(data.Error) {
          reject(data.Error);
        } else {
          resolve(data.response);
        }
      });
    });
  }
  return await users(ids);
},

async callserver(method, queryParams, body) {
  queryParams = {method, ...queryParams};
  const query = Object.entries(queryParams)
    .reduce((all, [name,value]) => {
      all.push(`${name}=${encodeURIComponent(value)}`);
      return all;
    }, [])
    .join('&');
    const params = {
      headers: {
        vk_token: this.token,
      },
    };
    if (body) {
      params.method = 'POST';
      params.body = JSON.stringify(body);
    }

    const response = await fetch(`/loft-photo/api/?${query}`, params);
    return response.json();
},

async like(photo) {
  return this.callserver('like', {photo});
},

async photoStats(photo) {
  return this.callserver('photoStats', {photo});
},

async getComments(photo) {
  return this.callserver('getComments', {photo});
},

async postComment(photo, text) {
  return this.callserver('postComment', {photo}, {text});
},


};
