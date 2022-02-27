<template>
  <v-card>
    <v-toolbar color="primary" dark>Login form</v-toolbar>
    <v-card-text>
      <form>
        <v-text-field v-model="username" label="username" required></v-text-field>
        <v-text-field type="password" v-model="password" label="password" required></v-text-field>
      </form>
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn color="primary" @click="login()"> Login </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
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
