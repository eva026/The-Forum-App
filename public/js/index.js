/* eslint-disable */
import '@babel/polyfill';
import FormData from 'form-data';

import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';
import { showAlert } from './alerts';
import { createPost } from './createPost';
import { createComment } from './createComment';
import { timeSince } from './time';
import { updateVote } from './updateVote';

// DOM Elments
const loginForm = document.querySelector('.login-form');
const signupForm = document.querySelector('.signup-form');
const logoutBtn = document.querySelector('.nav--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');
const inpFile = document.getElementById('post-image');
const previewImage = document.getElementById('output');
const inpPhotoFile = document.getElementById('photo');
const previewPhotoImage = document.getElementById('output_image');
const postForm = document.querySelector('.form-create-post');
const commentForm = document.querySelector('.form-create-comment');
const userImage = document.querySelector('.nav__user-img');

// Log In
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

// Log Out
if (logoutBtn) logoutBtn.addEventListener('click', logout);

// Sign Up
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const signupName = document.getElementById('signupName').value;
    const signupEmail = document.getElementById('signupEmail').value;
    const signupPassword = document.getElementById('signupPassword').value;
    const signupPasswordConfirm = document.getElementById(
      'signupPasswordConfirm'
    ).value;
    signup(signupName, signupEmail, signupPassword, signupPasswordConfirm);
  });
}

// Update Settings
if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Processing';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    console.log(passwordCurrent, password, passwordConfirm);
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

// CreatePost
if (postForm)
  postForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();

    form.append('community', document.getElementById('community-select').value);
    form.append('title', document.getElementById('post-title').value);
    form.append('text', document.getElementById('post-text').value);
    form.append('image', document.getElementById('post-image').files[0]);

    createPost(form);
  });

// Create comment
if (commentForm)
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const comment = document.getElementById('comment').value;
    const post = document.getElementById('post-detail-id').value;

    createComment(comment, post);
  });

// Display like and dislike
const uplist = document.querySelectorAll('.fa-arrow-up');
if (userImage)
  if (uplist) {
    for (let i = 0; i < uplist.length; i++) {
      uplist[i].addEventListener('click', function (e) {
        uplist[i].classList.toggle('like');

        const id = e.target.dataset.id;
        updateVote(id, 'up');
      });
    }
  }
const downlist = document.querySelectorAll('.fa-arrow-down');
if (userImage)
  if (downlist) {
    for (let i = 0; i < downlist.length; i++) {
      downlist[i].addEventListener('click', function (e) {
        downlist[i].classList.toggle('dislike');
        const id = e.target.dataset.id;
        updateVote(id, 'down');
      });
    }
  }

// Preview Post image
if (inpFile)
  inpFile.addEventListener('change', function () {
    const file = this.files[0];

    if (file) {
      const reader = new FileReader();

      console.log(previewImage.classList);
      previewImage.classList.remove('d-none');

      reader.addEventListener('load', function () {
        console.log(this);
        previewImage.setAttribute('src', this.result);
        console.log(previewImage);
      });
      reader.readAsDataURL(file);
    } else {
      previewImage.classList.remove('d-none');
    }
  });

// Preview Account image
if (inpPhotoFile)
  inpPhotoFile.addEventListener('change', function () {
    const file = this.files[0];

    if (file) {
      const reader = new FileReader();

      reader.addEventListener('load', function () {
        console.log(this);
        previewPhotoImage.setAttribute('src', this.result);
        console.log(previewPhotoImage);
      });
      reader.readAsDataURL(file);
    }
  });

// Display post time
const createdAtArr = document.querySelectorAll('.post-time');
if (createdAtArr)
  createdAtArr.forEach((el) => {
    const timestamp = Date.parse(el.innerText) / 1000;
    el.innerText = timeSince(timestamp);
  });

// Show alert
const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 10);
