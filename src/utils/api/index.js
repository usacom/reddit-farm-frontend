import axios from 'axios';
import qs from 'querystring';

class API {
  constructor(basePath) {
    this.axios = axios;
    // this.axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    // this.axios.defaults.headers.common['Access-Control-Allow-Methods'] = [
    //   'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    // ];
    // this.axios.defaults.headers.common['Access-Control-Allow-Headers'] = [
    //   'X-Requested-With, content-type, Authorization',
    // ];
    // const polis = {
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    //   'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    // };

    this.basePath = basePath;
    this.loadHeaders();
    console.log('basePath:', basePath);
  }

  // settings
  loadHeaders() {
    this.headers = JSON.parse(localStorage.getItem('headers')) || {};
    console.log('headers', this.headers);
  }

  setHeaders(headers) {
    console.log('setHeaders', headers);
    localStorage.setItem('headers', JSON.stringify(headers));
    this.headers = headers;
  }

  getConfig() {
    return { headers: this.headers };
  }

  // methods
  testApi() {
    console.log(this.headers);
    console.log(this.basePath);
    return 'test';
  }

  tokenStatus() {
    return this.GET('status');
  }

  loginLink() {
    return this.GET('login');
  }

  siginUp(request) {
    return this.POST('signup', request, false);
  }

  getToken(request) {
    return this.POST('token', request);
  }

  getUserPosts() {
    return this.GET('posts');
  }

  getSchedulePosts(filter) {
    return this.GET(`posts/schedule?filter=${filter}`);
  }

  userInfo() {
    return this.GET('users/me');
  }

  getUserSubreddits() {
    return this.GET('users/subreddits');
  }

  getSubredditInfo(subreddit) {
    return this.GET('post/subreddit-info/', { subreddit });
  }

  getSubredditsInfo(subreddits) {
    return this.POST('post/subreddits-info/', subreddits, false);
  }

  createPosts(posts, type = 'SCHEDULED') {
    const postsDTO = posts.map((post) => ({
      url: '',
      status: type, // SAVED or SCHEDULED
      scheduled_time: post.timePost,
      nsfw: true,
      spoiler: true,
      ...post,
    }));
    return this.POST('posts/', postsDTO, false);
  }

  canclePost(id) {
    return this.POST(`post/cancle/${id}`);
  }

  publishPost(id) {
    return this.POST(`post/manual/${id}`);
  }

  // base methods

  GET(path) {
    console.log(path);
    console.log(this.basePath + path);
    console.log('config', this.getConfig());
    // return fetch(this.basePath + path, {
    //   method: 'GET', // *GET, POST, PUT, DELETE, etc.
    //   mode: 'cors', // no-cors, *cors, same-origin
    //   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //   credentials: 'same-origin', // include, *same-origin, omit
    //   // headers: {
    //   //   'Content-Type': 'application/json',
    //   //   // 'Content-Type': 'application/x-www-form-urlencoded',
    //   // },
    //   redirect: 'follow', // manual, *follow, error

    //   ...this.getConfig(),
    // });
    return this.axios.get(this.basePath + path, this.getConfig());
  }

  POST(path, request, convert = true) {
    console.log(path);
    if (convert) {
      console.log(this.basePath + path);
      console.log('qs.stringify', qs.stringify(request));
    } else {
      console.log(this.basePath + path, request);
    }
    const link = this.basePath + path;
    const data = convert ? qs.stringify(request) : request;

    // return fetch(link, {
    //   method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //   mode: 'cors', // no-cors, *cors, same-origin
    //   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //   credentials: 'same-origin', // include, *same-origin, omit
    //   redirect: 'follow', // manual, *follow, error
    //   referrerPolicy: 'no-referrer',
    //   body: data,
    //   ...this.getConfig(),
    // });
    return this.axios.post(link, data, this.getConfig());
  }
  // Authorization
}

export default function (basePath) {
  return new API(basePath);
}
