import pages from './pages';
import model from './model';
import profilePage from './profilePage';
import commentsTemplate from './commentsTemplate.hbs';

export default {

  friend: {},
  id: {},

  async getNextPhoto() {
    const { friend, id, url } = await model.getNextPhoto();
    const stats = await model.photoStats(id);
    this.setFriendAndPhoto(friend, id, url, stats);
  },

  setFriendAndPhoto(friend, id, url, stats) {
    this.friend = friend;
    this.id = id;

    const userPhoto = document.querySelector('.component-footer-photo');
    const name = document.querySelector('.component-header-name');
    const avatar = document.querySelector('.component-header-photo');
    const photo = document.querySelector('.component-photo');

    userPhoto.style.backgroundImage = `url('${model.user[0].photo_100}')`;
    name.innerText = `${friend.first_name} ${friend.last_name}`;
    avatar.style.backgroundImage = `url('${friend.photo_100}')`;
    photo.style.backgroundImage = `url('${url}')`;
    this.setLikes(stats.likes, stats.liked);
    this.setComments(stats.comments);
  },

  async loadComments(photo) {
    const listElememt = document.querySelector('.component-comments-container-list');
    const comments = await model.getComments(photo);
    const commentsElements = commentsTemplate({
      list: comments.map((comment) => {
        return {
          name: `${comment.user.first_name ?? ''} ${comment.user.last_name ?? ''}`,
          photo: comment.user.photo_50,
          text: comment.text,
        };
      }),
    });
    listElememt.innerHTML = '';
    listElememt.innerHTML = commentsElements;
    this.setComments(comments.length);
  },

  setLikes(total, liked) {
    const likes = document.querySelector('.component-footer-container-social-likes');
    likes.innerHTML = total;
    if (liked) {
      likes.classList.add('liked');
    } else {
      likes.classList.remove('liked');
    }
  },

  setComments(total) {
    const comments = document.querySelector('.component-footer-container-social-comments');
    comments.innerHTML = total;
  },

  handleEvents() {
    const photo = document.querySelector('.component-photo');
    const friendinHeader = document.querySelector('.component-header-profile-link');
    const userinFooter = document.querySelector('.component-footer-container-profile-link');
    const likes = document.querySelector('.component-footer-container-social-likes');
    const comments = document.querySelector('.component-footer-container-social-comments');
    const commentsList = document.querySelector('.component-comments');
    const input = document.querySelector('.component-comments-container-form-input');
    const send = document.querySelector('.component-comments-container-form-send');
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
    likes.addEventListener('click', async () => {
      const {likes, liked} = await model.like(this.id);
      this.setLikes(likes, liked);
    });
    comments.addEventListener('click', async () => {
      commentsList.classList.remove('hidden');
      await this.loadComments(this.id);
    });
    commentsList.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        commentsList.classList.add('hidden');
      }
    });
    send.addEventListener('click', async () => {
      if (input.value.trim().length > 0) {
        await model.postComment(this.id, input.value.trim());
        input.value = '';
        await this.loadComments(this.id);
      }
    });
  },
};
