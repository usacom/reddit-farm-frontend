export default function auth({ next, store }) {
  console.log('middleware auth: ', store.getters.auth.loggedIn);
  if (!store.getters.auth.loggedIn) {
    return next({
      name: 'Auth',
    });
  }

  return next();
}
