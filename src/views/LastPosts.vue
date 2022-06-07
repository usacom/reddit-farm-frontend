<template>
  <v-container>
    <v-card class="mx-auto" v-for="(item, id) in posts" :key="id">
      <v-card-text>
        <h2>{{ item.title }}</h2>
        <span>Subreddit: {{ item.subreddit }} </span>
        <br />
        <span>Score: {{ item.score }}</span>
        <p>{{ item.selftext }}</p>
        <v-img :lazy-src="item.url" max-width="100%" :src="item.url"></v-img>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'LastPosts',
  components: {},
  data() {
    return {
      posts: null,
    };
  },
  async created() {
    const loader = await this.$loading.show({
      // Optional parameters
      // container: this.fullPage ? null : this.$refs.formContainer,
      canCancel: false,
    });
    try {
      this.posts = (await this.$api.getUserPosts()).data;
    } catch (e) {
      console.error(e);
    } finally {
      loader.hide();
    }
  },
  methods: {},
};
</script>
