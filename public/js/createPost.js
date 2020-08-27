/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const createPost = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/posts',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `Post created successfully!`);
      location.assign(`/post/${res.data.data.data.slug}`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
