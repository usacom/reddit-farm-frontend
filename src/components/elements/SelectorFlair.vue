<template>
  <v-select
    v-model="localValue"
    :items="flairs"
    :item-text="getFlairName"
    item-value="flair_template_id"
    clearable
    append-icon="mdi-chevron-down"
    clear-icon="mdi-close"
    label="Select Flair"
    @change="selectFlair"
  ></v-select>
</template>
<script>
export default {
  name: 'SelectorFlair',
  props: {
    value: {
      default: null,
    },
    flairs: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    localValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  methods: {
    getFlairName(flair) {
      return flair.flair_text;
    },
    selectFlair(event) {
      console.log(event);
    },
  },
};
</script>
