<template>
  <v-container class="pt-16">
    <!-- {{ posts }} -->
    <v-card class="mx-auto" v-for="(item, id) in posts" :key="id">
      <v-card-text>
        <h2>{{ item.title }}</h2>
        <v-row>
          <v-col>
            Subreddit:
            <a target="_blank" :href="'https://www.reddit.com/r/' + item.subreddit">
              r/{{ item.subreddit }}
            </a>
          </v-col>
          <v-col> Flair: `{{ item.flair }}` </v-col>
        </v-row>

        <!-- <h4></h4> -->
        <!-- <h4></h4> -->
        <v-row no-gutters class="my-4">
          <v-col>
            <h3>status: {{ item.status }}</h3>
          </v-col>
          <v-col>
            <h3>scheduled time post: {{ getFormatedDate(item.scheduled_time) }}</h3>
          </v-col>
        </v-row>
        <p v-if="item.type !== 'url'">{{ item.content }}</p>
        <v-img
          v-if="item.type === 'url'"
          :lazy-src="item.content"
          max-width="100%"
          :src="item.content"
        >
        </v-img>
        <v-row no-gutters class="my-4">
          <v-col>
            <h3>created at: {{ getFormatedDate(item.created_at) }}</h3>
          </v-col>
          <v-col>
            <h3>updated at: {{ getFormatedDate(item.created_at) }}</h3>
          </v-col>
        </v-row>
        <v-row no-gutters class="my-4">
          <v-col v-if="item.status === 'PUBLISHED'">
            <h3>
              link to post:
              <a target="_blank" :href="'https://www.reddit.com' + item.url">
                {{ item.url }}
              </a>
            </h3>
          </v-col>
          <v-col v-if="item.status !== 'PUBLISHED' && item.status !== 'CANCELED'">
            <v-btn color="primary" elevation="2" @click="publish(item)"> Manual publish </v-btn>
          </v-col>
          <v-col v-if="item.status !== 'PUBLISHED' && item.status !== 'CANCELED'">
            <v-btn color="error" elevation="2" @click="cancel(item)"> Cancel </v-btn>
          </v-col>
        </v-row>
        <code>{{ item }}</code>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import moment from 'moment';

export default {
  name: 'PostsSchedule',
  components: {},
  data() {
    return {
      posts: null,
    };
  },
  async created() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      const loader = await this.$loading.show({
        // Optional parameters
        // container: this.fullPage ? null : this.$refs.formContainer,
        canCancel: false,
      });
      try {
        this.posts = (await this.$api.getSchedulePosts('NOTCANCELED')).data;
      } catch (e) {
        console.error(e);
      } finally {
        loader.hide();
      }
    },
    getFormatedDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm');
    },
    async cancel(item) {
      console.log('cancle post', item);
      const responce = await this.$api.canclePost(item.id);
      console.log('responce', responce);
      await this.loadData();
    },
    async publish(item) {
      console.log('publish post', item);
      const responce = await this.$api.publishPost(item.id);
      console.log('responce', responce);
      await this.loadData();
    },
  },
};
</script>
