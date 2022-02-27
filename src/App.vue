<template>
  <v-app>
    <v-app-bar fixed color="deep-purple" shrink-on-scroll dark>
      <!-- <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon> -->
      <v-app-bar-nav-icon @click="drawer = true" name="mdi-menu">
        <v-icon>mdi-menu</v-icon>
      </v-app-bar-nav-icon>

      <v-toolbar-title>{{ currentRouteName }}</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group v-model="group" active-class="deep-purple--text text--accent-4">
          <!-- <v-list-item v-if="tokenStatus !== null">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title> u/{{ tokenStatus.username }} </v-list-item-title>
          </v-list-item> -->
          <v-list-item v-for="(item, id) in availableRoutes" :key="id" @click="goToPath(item.path)">
            <v-list-item-icon>
              <v-icon v-if="icons[item.routeName]">{{ icons[item.routeName].icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              <router-link :to="item.path">{{ item.name }}</router-link>
              <span v-if="item.routeName == 'profile'"> u/{{ auth.username }}</span>
            </v-list-item-title>
          </v-list-item>
          <!-- reg -->
          <v-list-item v-if="!auth.loggedIn">
            <v-btn @click="getRedditAuthLink" class="white--text" color="error" depressed>
              Registration
            </v-btn>
          </v-list-item>
          <!-- Auth -->
          <v-list-item v-if="!auth.loggedIn">
            <v-dialog transition="dialog-bottom-transition" max-width="600">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" v-bind="attrs" v-on="on">Login</v-btn>
              </template>
              <template v-slot:default="dialog">
                <v-card>
                  <v-toolbar color="primary" dark>Login form</v-toolbar>
                  <v-card-text>
                    <form>
                      <v-text-field v-model="username" label="username" required></v-text-field>
                      <v-text-field
                        type="password"
                        v-model="password"
                        label="password"
                        required
                      ></v-text-field>
                    </form>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn text @click="dialog.value = false">Close</v-btn>
                    <v-btn color="primary" @click="login()"> Login </v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <div class="pt-16 pb-16 mt-16"></div>
    <div class="pa-6">
      <router-view />
    </div>
  </v-app>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  data: () => ({
    drawer: false,
    group: null,
    icons: {
      home: {
        icon: 'mdi-home',
      },
      about: {
        icon: 'mdi-information',
      },
      profile: {
        icon: 'mdi-account',
      },
      auth: {
        icon: 'mdi-account',
      },
    },
    items: [],
    username: '',
    password: '',
  }),
  created() {},
  computed: {
    ...mapGetters(['auth']),
    routes() {
      return this.$router.options.routes;
    },
    authRoutes() {
      return this.$router.options.routes.filter((route) => {
        if (route.meta !== undefined && route.meta.middleware !== undefined) {
          const middlewares = route.meta.middleware.map((item) => item.name);
          if (middlewares.indexOf('guest') === -1) {
            return true;
          }
        } else {
          return true;
        }
        return false;
      });
    },
    notAuthRoutes() {
      return this.$router.options.routes.filter((route) => {
        if (route.meta !== undefined && route.meta.middleware !== undefined) {
          const middlewares = route.meta.middleware.map((item) => item.name);
          if (middlewares.indexOf('auth') === -1) {
            return true;
          }
        } else {
          return true;
        }
        return false;
      });
    },
    availableRoutes() {
      if (!this.auth.loggedIn) {
        return this.notAuthRoutes;
      }
      return this.authRoutes;
    },
    currentRouteName() {
      return this.$route.name;
    },
  },
  methods: {
    goToPath(path) {
      if (this.$route.path !== path) this.$router.push(path);
    },
    async getRedditAuthLink() {
      console.log('getRedditAuthLink');
      try {
        const login = (await this.$api.loginLink()).data;
        console.log(login);
        window.open(login, '_self');
      } catch (e) {
        console.log(e);
      }
    },
    login() {
      console.log('username', this.username);
      const params = {
        username: this.username,
        password: this.password,
        grant_type: '',
        scope: '',
        client_id: '',
        client_secret: '',
      };
      this.$api.getToken(params).then((response) => {
        console.log(response);
        console.log('username', this.username);
        console.log('access_token', response.data.access_token);
        console.log('token_type', response.data.token_type);
        if (response.data.token_type === 'bearer') {
          const authToken = `Bearer ${response.data.access_token}`;
          console.log(authToken);
          this.$api.setHeaders({ Authorization: authToken, Accept: 'application/json' });
          this.$router.go();
        }
      });
    },
  },
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
