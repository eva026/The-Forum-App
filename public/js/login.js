/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Log in successfully!');

      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// Log out
export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/users/logout',
    });

    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    console.log(err.response.data.message);
    showAlert('error', 'Error logging out! Try again!');
  }
};
