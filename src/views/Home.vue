<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-form v-if="status" v-model="valid" lazy-validation>
        <h2>For continue sing up complite form.</h2>
        <v-text-field
          type="password"
          v-model="password1"
          label="Password"
          :rules="[...passwordRules]"
          required
        ></v-text-field>
        <v-text-field
          type="password"
          v-model="password2"
          label="Re-enter Password"
          :rules="[...passwordRules, passwordConfirmationRule]"
          required
        ></v-text-field>
        <v-btn
          :loading="loading"
          class="mb-3"
          color="primary"
          :disabled="!valid || loading"
          @click="signup"
        >
          Sing up
        </v-btn>
        <v-alert v-if="siginError" prominent type="error" icon="mdi-alert-circle">
          <v-row align="center">
            <v-col class="grow">
              Apparently your key has expired, please try again. {{ siginErrors }}
            </v-col>
            <v-col class="shrink">
              <v-btn @click="getRedditAuthLink">Try again</v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </v-form>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  components: {},
  data() {
    return {
      valid: false,
      loading: false,
      messages: 0,
      username: '',
      password1: '',
      password2: '',
      siginError: false,
      siginErrors: null,
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => (v && v.length >= 8) || 'Password must be more than 8 characters',
        (v) => {
          const regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
          return !regularExpression.test(v);
        },
      ],
    };
  },
  computed: {
    passwordConfirmationRule() {
      return this.password1 === this.password2 || 'Password must match';
    },
    status() {
      return this.$route.query.state !== undefined && this.$route.query.code !== undefined;
    },
  },
  created() {
    if (this.status) {
      console.log('Have auth code');
      console.log('query.state: ', this.$route.query.state);
      console.log('query.code: ', this.$route.query.code);
    } else {
      console.log('Dont have auth code');
    }
  },
  methods: {
    async signup() {
      if (this.valid) {
        this.loading = true;
        try {
          const response = await this.$api.siginUp({
            password: this.password1,
            code: this.$route.query.code,
          });
          this.login(response.data.username, this.password1);
        } catch (e) {
          this.siginError = true;
          this.siginErrors = e;
          console.error(e);
        } finally {
          this.loading = false;
        }
      }
    },
    async getRedditAuthLink() {
      try {
        const login = (await this.$api.loginLink()).data;
        window.open(login, '_self');
      } catch (e) {
        console.error(e);
      }
    },
    login(username, password) {
      console.log('username', username);
      const params = {
        username,
        password,
        grant_type: '',
        scope: '',
        client_id: '',
        client_secret: '',
      };
      this.$api.getToken(params).then((response) => {
        if (response.data.token_type === 'bearer') {
          this.authToken = `Bearer ${response.data.access_token}`;
          console.log(this.authToken);
          this.$api.setHeaders({ Authorization: this.authToken, Accept: 'application/json' });
          this.$router.push({ path: '/profile' });
        }
      });
    },
  },
};
</script>
