<template>
  <v-dialog v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="light-blue lighten-2" dark v-bind="attrs" v-on="on">
        <v-icon>mdi-information</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 grey lighten-2">Rules</v-card-title>

      <v-card-text>
        <div class="pa-3" v-for="(item, id) in rules" :key="id">
          <h2>{{ item.name }}</h2>
          <p>{{ item.description }}</p>
          <hr />
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'RulesDialog',
  props: {
    rules: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
  computed: {},
  methods: {
    // showRules(id) {},
  },
};
</script>
