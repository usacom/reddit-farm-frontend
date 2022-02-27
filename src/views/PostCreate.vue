<template>
  <div class="text-left">
    <div>
      <h2>Title</h2>
      <v-radio-group v-model="radioTitle" row>
        <v-radio
          off-icon="mdi-radiobox-blank"
          on-icon="mdi-radiobox-marked"
          label="Title default"
          :value="true"
        ></v-radio>
        <v-radio
          off-icon="mdi-radiobox-blank"
          on-icon="mdi-radiobox-marked"
          label="Title custom"
          :value="false"
        ></v-radio>
      </v-radio-group>
      <v-text-field :disabled="!radioTitle" label="Title" v-model="title"></v-text-field>
    </div>
    <div>
      <h2>Image or url</h2>
      <v-radio-group v-model="radioContentType" row>
        <v-radio
          off-icon="mdi-radiobox-blank"
          on-icon="mdi-radiobox-marked"
          label="Link (url to img/video)"
          value="url"
        ></v-radio>
        <v-radio
          off-icon="mdi-radiobox-blank"
          on-icon="mdi-radiobox-marked"
          label="Image"
          value="image"
        ></v-radio>
      </v-radio-group>
      <v-text-field v-if="radioContentType === 'url'" label="Link" v-model="link"></v-text-field>
      <h3 v-if="radioContentType === 'image'">Not released now.</h3>
      <v-file-input
        v-if="radioContentType === 'image'"
        disabled
        prepend-icon="mdi-attachment"
        accept="image/*"
        truncate-length="15"
      ></v-file-input>
    </div>
    <div>
      <h2>Addons options</h2>
      <v-row>
        <v-col>
          <v-checkbox
            off-icon="mdi-checkbox-blank-outline"
            on-icon="mdi-checkbox-outline"
            v-model="nsfw"
            :label="`nsfw`"
          >
          </v-checkbox>
        </v-col>
        <v-col>
          <v-checkbox
            off-icon="mdi-checkbox-blank-outline"
            on-icon="mdi-checkbox-outline"
            v-model="spoiler"
            :label="`spoiler`"
          >
          </v-checkbox>
        </v-col>
      </v-row>
    </div>
    <div class="d-flex justify-center">
      <v-btn color="primary" elevation="2" @click="save"> Save to schedule post(s) </v-btn>
    </div>
    <div>
      <h2>List of subs</h2>
      <list-of-subs :custom-title="radioTitle" v-model="subreddits"></list-of-subs>
    </div>
    <div class="d-flex justify-center">
      <v-btn color="primary" elevation="2" @click="save"> Save to schedule post(s) </v-btn>
    </div>
    <v-overlay :z-index="zIndex" :value="overlay">
      <code>{{ overlayContent }}</code>
      <v-btn class="white--text" color="teal" @click="overlay = false"> Hide Overlay </v-btn>
    </v-overlay>
  </div>
</template>
<script>
import ListOfSubs from '../components/ListOfSubs.vue';

export default {
  components: { ListOfSubs },
  name: 'Post',
  data() {
    return {
      subreddits: [],
      userSubs: null,
      title: '',
      link: '',
      radioTitle: true,
      radioContentType: 'url',
      overlay: false,
      overlayContent: '',
      zIndex: 0,
      nsfw: true,
      spoiler: false,
    };
  },
  computed: {},
  methods: {
    async save() {
      console.log('save');
      console.log('radioTitle', this.radioTitle);
      console.log('title', this.title);
      console.log('radioContentType', this.radioContentType);
      console.log('link', this.link);
      console.log('subreddits', this.subreddits);
      const dataPost = this.subreddits.map((item) => {
        const content = {};
        content.subreddit = item.subreddit;

        if (this.radioTitle) {
          content.title = this.title;
        } else {
          content.title = item.title;
        }
        if (this.radioContentType === 'url') {
          content.type = 'url';
          content.content = this.link;
        } else {
          console.warn('Now work only link type post');
        }
        content.flair = item.flair;
        content.timePost = item.timePost;
        content.nsfw = this.nsfw;
        content.spoiler = this.spoiler;

        return content;
      });
      const loader = await this.$loading.show({
        // Optional parameters
        // container: this.fullPage ? null : this.$refs.formContainer,
        canCancel: false,
      });
      console.log('dataPost', dataPost);

      try {
        const responce = await this.$api.createPosts(dataPost).data;
        console.log(responce);
        this.overlay = true;
        this.overlayContent = responce;
      } catch (e) {
        console.error(e);
      } finally {
        loader.hide();
      }
    },
  },
};
</script>
