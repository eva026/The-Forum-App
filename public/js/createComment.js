/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const createComment = async (comment, post) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/comments',
      data: {
        comment,
        post,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', `Comment posted successfully!`);
      console.log(res.data);
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
