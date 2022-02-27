import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import Home from '../views/Home.vue';
import LastPosts from '../views/LastPosts.vue';
import PostsSchedule from '../views/PostsSchedule.vue';
import Profile from '../views/Profile.vue';
import PostCreate from '../views/PostCreate.vue';
import Auth from '../views/Auth.vue';
import auth from './middleware/auth';
import guest from './middleware/guest';
import middlewarePipeline from './middlewarePipeline';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    routeName: 'home',
    component: Home,
  },
  {
    path: '/auth',
    name: 'Auth',
    routeName: 'auth',
    component: Auth,
    meta: {
      middleware: [guest],
    },
  },
  {
    path: '/posts/last',
    name: 'Last posts (100)',
    routeName: 'lastPosts',
    component: LastPosts,
    meta: {
      middleware: [auth],
    },
  },
  {
    path: '/posts/schedule',
    name: 'Posts schedule',
    routeName: 'PostsSchedule',
    component: PostsSchedule,
    meta: {
      middleware: [auth],
    },
  },
  {
    path: '/posts/create',
    name: 'Post create',
    routeName: 'PostCreate',
    component: PostCreate,
    meta: {
      middleware: [auth],
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    routeName: 'profile',
    component: Profile,
    meta: {
      middleware: [auth],
    },
  },
  {
    path: '/about',
    name: 'About',
    routeName: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach(async (to, from, next) => {
  // console.log('router.beforeEach');
  await store.dispatch('loadLoginData');
  if (!to.meta.middleware) {
    return next();
  }
  const { middleware } = to.meta;
  const context = {
    to,
    from,
    next,
    store,
  };
  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1),
  });
});

export default router;
