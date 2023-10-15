import model from './model';
import mainPage from './mainPage';
import pages from './pages';

export default {

  user: {},

  async setUser(user) {
    const avatar = document.querySelector('.component-user-info-photo');
    const name = document.querySelector('.component-user-info-name');
    const container = document.querySelector('.component-user-photos');
    const photos = await model.getFriendPhotos(user.id);

    this.user = user;
    container.innerHTML = '';
    avatar.style.backgroundImage = `url('${user.photo_100}')`;
    name.innerText = `${user.first_name} ${user.last_name}`;

    for (let photo of photos.items) {
      const photoSize = model.getPhotoSize(photo);
      const divPhoto = document.createElement('div');
      divPhoto.classList.add('component-user-photo');
      divPhoto.style.backgroundImage = `url(${photoSize.url})`;
      container.append(divPhoto);
    }
  },

  handleEvents() {
    const container = document.querySelector('.component-user-photos');
    const backButton = document.querySelector('.page-profile-back');
    const exitButton = document.querySelector('.page-profile-exit');

    container.addEventListener('click', async (e) => {
      if (e.target.classList.contains('component-user-photo')) {
        mainPage.setFriendAndPhoto(this.user, 0, e.target.style.backgroundImage.slice(5, -1));
        pages.openPage('main');
      }
    });
    
    backButton.addEventListener('click', async () => pages.openPage('main'));

    exitButton.addEventListener('click', async () => {
      await model.logout();
      pages.openPage('login');
    });
  },
};