import pages from './pages';
import model from './model';

export default {
  async getNextPhoto() {
    const { friend, id, url } = await model.getNextPhoto();
    this.setFriendAndPhoto(friend, id, url);
  },

  setFriendAndPhoto(friend, id, url) {
    const name = document.querySelector('.component-header-name');
    const avatar = document.querySelector('.component-header-photo');
    const photo = document.querySelector('.component-photo');

    name.innerText = `${friend.first_name} ${friend.last_name}`;
    avatar.style.backgroundImage = `url('${friend.photo_100}')`;
    photo.style.backgroundImage = `url('${url}')`;
  },

  handleEvents() {
    const photo = document.querySelector('.component-photo');
    let coordX = 0;
    photo.addEventListener('mousedown', (e) => {
      e.preventDefault();
      coordX = e.clientX;
    });
    photo.addEventListener('mouseup', async (e) => {
      e.preventDefault();
      if (Math.abs(e.clientX - coordX) > 0) {
        await this.getNextPhoto();
      }
    });
  },
};
