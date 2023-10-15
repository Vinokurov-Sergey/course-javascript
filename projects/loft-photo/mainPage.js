import pages from './pages';
import model from './model';
import profilePage from './profilePage';

export default {

  friend: {},

  async getNextPhoto() {
    const { friend, id, url } = await model.getNextPhoto();
    this.setFriendAndPhoto(friend, id, url);
  },

  setFriendAndPhoto(friend, id, url) {
    this.friend = friend;

    const userPhoto = document.querySelector('.component-footer-photo');
    const name = document.querySelector('.component-header-name');
    const avatar = document.querySelector('.component-header-photo');
    const photo = document.querySelector('.component-photo');

    userPhoto.style.backgroundImage = `url('${model.user[0].photo_100}')`;
    name.innerText = `${friend.first_name} ${friend.last_name}`;
    avatar.style.backgroundImage = `url('${friend.photo_100}')`;
    photo.style.backgroundImage = `url('${url}')`;
  },

  handleEvents() {
    const photo = document.querySelector('.component-photo');
    const friendinHeader = document.querySelector('.component-header-profile-link');
    const userinFooter = document.querySelector('.component-footer-container-profile-link');
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
    friendinHeader.addEventListener('click', async ()=> {
      await profilePage.setUser(this.friend);
      pages.openPage('profile');
    });
    userinFooter.addEventListener('click', async ()=> {
      await profilePage.setUser(model.user[0]);
      pages.openPage('profile');
    });
  },
};
