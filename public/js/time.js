/* eslint-disable */

export const timeSince = (date) => {
  var seconds = Math.floor(new Date().getTime() / 1000 - date);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + ' year ago';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' month ago';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' d ago';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hr ago';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' min ago';
  }
  return Math.floor(seconds) + ' sec ago';
};
