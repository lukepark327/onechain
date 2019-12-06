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
                label="Input Text"
                append-icon="add"
                solo
                flat
                hide-details
                v-model="text"
                @keyup.enter="inputText(text)"
                @click:append="inputText(text)"
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
          <v-card-text>
            <v-simple-table dense>
              <tbody>
                <tr v-for="text in texts" :key="text">
                  <td>
                    <span>
                      {{ text }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn depressed
              :disabled="loading"
              @click="removeTexts()"
            >
              CLEAR
            </v-btn>
            <v-btn depressed
              color="blue"
              class="white--text"
              :loading="loading"
              :disabled="loading"
              @click="sendTexts(loader = 'loading')"
            >
              SEND
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: function () {
    return {
      texts: [],
      loader: null,
      loading: false,
      goDark: this.$vuetify.theme.dark
    }
  },
  watch: {
    loader () {},
  },
  methods: {
    inputText: function (text) {
      this.texts.push(text);
    },
    removeTexts: function () {
      this.texts = [];
    },
    sendTexts: function () {
      const l = this.loader;
      this[l] = true;

      const baseURI = 'http://localhost:3001';
      this.$http.post(`${baseURI}/mineBlock`, {
        headers: {
          'Content-type': 'application/json'
        },
        data: this.texts
      })
      .then(() => {
      })
      .catch((error) => {
        alert(error);
      });

      setTimeout(() => {
        this.removeTexts();
        this[l] = false;
      }, 2000);
      this.loader = null;
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
