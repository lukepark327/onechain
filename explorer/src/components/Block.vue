<template>
  <v-container grid-list-xl>
    <v-layout raw wrap>
      <v-switch
        class="ma-4"
        label="Realtime Updates"
        v-model=switch1
        color=blue
        hide-details
        inset
        disabled
      >
      </v-switch>
      <v-spacer></v-spacer>
      <v-switch
        class="ma-4"
        label="Dark Theme"
        v-model=goDark
        color=blue
        hide-details
        inset
        @change="setTheme()"
      >
      </v-switch>
      <v-flex xs12 sm12>
        <v-card color=blue>      
          <v-row>
            <v-col cols="12">
              <v-text-field
                class="ma-4"
                label="Search by Block Number"
                append-icon="search"
                solo
                flat
                hide-details
                v-model="blockNumber"
                @keyup.enter="reloadBlockPage(blockNumber)"
                @click:append="reloadBlockPage(blockNumber)"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-card>          
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 sm12>
        <v-card>
          <v-card-title>
            <v-btn
              text
              @click="reloadBlockPage(block.header.index)"
            >
              Block #{{block.header.index}}
            </v-btn>
          </v-card-title>
          <!-- header -->
          <v-card-text>
            <v-simple-table dense>
              <tbody>
                <tr v-for="(value, name) in block.header" :key="name">
                  <td>
                    <span>
                      {{ name }}
                    </span>
                  </td>
                  <td>
                    <span v-if=isHash(name)>{{"0x"}}</span>
                    <span>{{ value | truncate(36) }}</span>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
          <!-- data -->
          <v-card-text v-if="block.data.length > 0">
            <v-simple-table dense>
              <tbody>
                <tr v-for="(value, index) in block.data" :key="index">
                  <td>
                    <!-- <span>{{ value | truncate(36) }}</span> -->
                    <span>{{value}}</span>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: function () {
    return {
      block: {},
      goDark: this.$vuetify.theme.dark
    }
  },
  created: function () {
    this.block = this.getBlock(this.$route.params.number);
  },
  methods: {
    isHash: function (key) {
      return (key === "previousHash" || key === "merkleRoot");
    },
    getBlock: function (n) {
      const baseURI = 'http://localhost:3001';
      this.$http.get(`${baseURI}/block/` + n)
      .then((result) => {
        this.block = result.data;
      })
      .catch((error) => {
        alert(error);
      });
    },
    reloadBlockPage: function (n) {
      this.$router.push({ name: 'block', params: {number: n} });
      this.block = this.getBlock(this.$route.params.number);
    },
    setTheme: function () {
      if (this.goDark == true) {
        return (this.$vuetify.theme.dark = true);
      }
      else {
        return (this.$vuetify.theme.dark = false);
      }
    }
  }
};
</script>
