/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const updateVote = async (id, type) => {
  try {
    const url =
      type === 'up'
        ? `/api/v1/posts/vote-up/${id}`
        : `/api/v1/posts/vote-down/${id}`;

    const res = await axios({
      method: 'PUT',
      url,
    });
    if (res.data.status === 'success') {
      console.log('success');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
