<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>onechain</span>
        <span class="font-weight-light"> explorer</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="https://github.com/twodude/onechain/releases/latest"
        target="_blank"
        color=blue
      >
        <span class="mr-0">Latest Release</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
</script>
