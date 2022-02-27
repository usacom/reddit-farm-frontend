<template>
  <div v-if="userInfo !== null">
    username:
    <a target="_blank" :href="`https://www.reddit.com/user/${userInfo.username}`">
      u/{{ userInfo.username }}
    </a>
  </div>
</template>
<script>
export default {
  name: 'Profile',
  data() {
    return {
      userInfo: null,
    };
  },
  computed: {

  },
  async created() {
    console.log('$api', this.$api);
    this.userInfo = (await this.$api.userInfo()).data;
  },
};
</script>
