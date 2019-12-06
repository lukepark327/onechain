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
        @change="getLatestBlocks(12)"
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
                @keyup.enter="gotoBlockPage(blockNumber)"
                @click:append="gotoBlockPage(blockNumber)"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-card>          
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex
        xs12
        sm6
        lg4
        xl3
        v-for="(block, index) in blocks"
        :key="index"
      >
        <v-card>
          <v-card-title>
            <v-btn
              text
              @click="gotoBlockPage(block.header.index)"
            >
              Block #{{block.header.index}}
            </v-btn>
          </v-card-title>
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
                    <span>{{ value | truncate(12) }}</span>
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
      blocks: [],
      switch1: false,
      inter1: undefined,
      goDark: this.$vuetify.theme.dark
    }
  },
  created: function () {
    this.getLatestBlocksOnce(12);
  },
  methods: {
    isHash: function (key) {
      return (key === "previousHash" || key === "merkleRoot");
    },
    getLatestBlocks: function (n) {
      n = n | 0;
      if (this.switch1) {
        this.inter1 = setInterval(() => {
          const baseURI = 'http://localhost:3001';
          this.$http.get(`${baseURI}/blocks`)
          .then((result) => {
            this.blocks = result.data.slice((-1 * n)).reverse();
          })
          .catch((error) => {
            alert(error);
          });
        }, 2000);
      }
      else if (this.inter1 != undefined) {
        clearInterval(this.inter1);
      }
    },    
    getLatestBlocksOnce: function (n) {
      n = n | 0;
      const baseURI = 'http://localhost:3001';
      this.$http.get(`${baseURI}/blocks`)
      .then((result) => {
        this.blocks = result.data.slice((-1 * n)).reverse();
      })
      .catch((error) => {
        alert(error);
      });
    },
    gotoBlockPage: function (n) {
      this.$router.push({ name: 'block', params: {number: n} });
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
}
</script>
