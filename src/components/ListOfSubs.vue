<template>
  <div v-if="userSubs !== null">
    <div v-if="dataLoaded">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                <v-checkbox
                  off-icon="mdi-checkbox-blank-outline"
                  on-icon="mdi-checkbox-outline"
                  indeterminate-icon="mdi-minus-box-outline"
                  :indeterminate="statusSelectedPart"
                  v-model="selectAll"
                ></v-checkbox>
              </th>
              <th class="text-left" width="250px">Subreddit</th>
              <th class="text-left" width="150px">Flair</th>
              <th v-if="!customTitle" class="text-left" width="250px">Title</th>
              <th class="text-left" width="250px">Post time</th>
              <th class="text-left">Rules</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, key) in Object.values(dataForPost)" :key="key">
              <td>
                <v-checkbox
                  v-model="item.status"
                  @change="(e) => selectItem(e, item.subreddit)"
                  off-icon="mdi-checkbox-blank-outline"
                  on-icon="mdi-checkbox-outline"
                ></v-checkbox>
              </td>
              <td class="text-left" width="250px">{{ item.subreddit }}</td>
              <td class="text-left" width="150px">
                <selector-flair
                  v-model="item.flair"
                  v-if="item.flairs.length > 0"
                  :flairs="item.flairs"
                ></selector-flair>
                <h4 v-else>this subreddit don't have available flairs</h4>
              </td>
              <td v-if="!customTitle" class="text-left" width="250px">
                <v-text-field label="Title" v-model="item.title"></v-text-field>
              </td>
              <td class="text-left" width="250px">
                <v-datetime-picker
                  v-model="item.timePost"
                  :datetime="item.timePost"
                  label="Select Datetime post"
                  :datePickerProps="{
                    min: getMinDate,
                    'next-icon': 'mdi-chevron-right',
                    'prev-icon': 'mdi-chevron-left',
                  }"
                  @input="(e) => changeDate(e, item.subreddit)"
                >
                  <template slot="dateIcon"> <v-icon>mdi-calendar-month-outline</v-icon> </template>
                  <template slot="timeIcon"> <v-icon>mdi-clock-outline</v-icon> </template>
                </v-datetime-picker>
              </td>
              <td>
                <!-- {{ item.rules }} -->
                <rules-dialog :rules="item.rules"></rules-dialog>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import RulesDialog from './elements/RulesDialog.vue';
import SelectorFlair from './elements/SelectorFlair.vue';
// import _ from 'lodash';

const emits = {
  input: 'input',
};

export default {
  components: { RulesDialog, SelectorFlair },
  name: 'ListOfSubs',
  props: {
    subreddits: {
      type: Array,
      default: () => [],
    },
    customTitle: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      userSubs: null,
      dataLoaded: false,
      subsInfo: [],
      chunkSize: 10,
      dataForPost: {},
      selectedAll: true,
    };
  },
  computed: {
    getMinDate() {
      return moment().format('YYYY-MM-DD');
    },
    statusSelectedPart() {
      const dataPost = Object.entries(this.dataForPost);
      const maped = dataPost.map((item) => item[1].status);
      const filtred1 = maped.filter((item) => item === true);
      const filtred2 = maped.filter((item) => item === false);
      return filtred1.length >= 1 && filtred2.length >= 1;
    },
    selectAll: {
      get() {
        return this.statusSelectedPart ? false : this.selectedAll;
      },
      set(val) {
        this.selectedAll = val;
        const dataPost = Object.entries(this.dataForPost);
        dataPost.forEach((item) => {
          const newVal = item[1];
          newVal.status = val;
          this.$set(this.dataForPost, item[0], newVal);
        });
        this.emitData();
      },
    },
  },
  async created() {
    const loader = await this.$loading.show({
      // Optional parameters
      // container: this.fullPage ? null : this.$refs.formContainer,
      canCancel: false,
    });
    this.$log.debug('$api', this.$api);
    this.$log.debug('loader', loader);
    this.userSubs = (await this.$api.getUserSubreddits()).data;

    if (this.userSubs !== null && this.userSubs.length > 0) {
      this.subsInfo = (await this.$api.getSubredditsInfo(this.userSubs)).data;

      await this.loadDataForPosts(this.subsInfo);
      this.emitData();

      this.dataLoaded = true;
      loader.hide();
    } else {
      this.$log.debug('loader hide');
      loader.hide();
    }

    // this.dataLoaded
  },
  methods: {
    loadDataForPosts(subsInfo) {
      const newData = {};
      subsInfo.forEach((element, id) => {
        // console.log(element, id);
        newData[element.subreddit] = {
          status: true,
          subreddit: element.subreddit,
          title: '',
          flairs: element.flairs,
          rules: element.rules,
          flair: '',
          // timePost: moment().format('YYYY-MM-DD HH.mm'),
          timePost: new Date(Date.now() + 60000 * 15 * (id + 1)),
        };
      });
      this.dataForPost = newData;
    },
    selectItem(event, subreddit) {
      const item = this.dataForPost[subreddit];
      item.status = event;
      this.$set(this.dataForPost, subreddit, item);
      this.emitData();
    },
    changeDate(event, subreddit) {
      console.log('changeDate', event, subreddit);
      const item = this.dataForPost[subreddit];
      item.timePost = event;
      this.$set(this.dataForPost, subreddit, item);
      this.emitData();
    },
    emitData() {
      const postData = Object.entries(this.dataForPost);
      const filtredData = postData.filter((item) => item[1].status);
      const newData = filtredData.map((item) => item[1]);
      console.log('emitData', newData);
      this.$emit(emits.input, newData);
    },
  },
};
</script>
