<template>
  <v-app>
    <v-navigation-drawer
      app
      temporary
      v-model="drawer"
    >
      <v-list>

        <v-list-tile
          v-for="link of links"
          :key="link.title"
          :to="link.url"
        >
          <v-list-tile-action>
            <v-icon>{{link.icon}}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title v-text="link.title"></v-list-tile-title>
          </v-list-tile-content>

        </v-list-tile>

        <v-list-tile
          v-if="isUserLoggedIn"
          @click="onLogout"
        >
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title v-text="'Logout'"></v-list-tile-title>
          </v-list-tile-content>

        </v-list-tile>


      </v-list>
    </v-navigation-drawer>

    <v-toolbar app dark color="primary">
      <v-toolbar-side-icon
        @click="drawer = !drawer"
        class="hidden-md-and-up"
      >
      </v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" class="pointer">Masha</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn
          v-for="link of links"
          :key="link.title"
          :to="link.url"
          flat
        >
          <v-icon left>{{link.icon}}</v-icon>
          {{link.title}}
        </v-btn>

        <v-btn
          v-if="isUserLoggedIn"
          flat
          @click="onLogout"
        >
          <v-icon left>exit_to_app</v-icon>
          Logout
        </v-btn>

      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>

    <template v-if="error">
      <v-snackbar
        :multi-line="true"
        :timeout="5000"
        color="error"
        @input="closeError"
        :value="true"
      >
        {{ error }}
        <v-btn
          color="dark"
          flat
          @click.native="closeError"
        >
          Close
        </v-btn>
      </v-snackbar>
    </template>

  </v-app>
</template>

<script>
  export default {
    data() {
      return {
        drawer: false,
      }
    },
    methods: {
      closeError() {
        this.$store.dispatch('clearError')
      },
      onLogout() {
        this.$store.dispatch('logoutUser');
        this.$router.push('/');
      }
    },
    computed: {
      error() {
        return this.$store.getters.error
      },
      isUserLoggedIn() {
        return this.$store.getters.isUserLoggedIn
      },
      isUserLoggedInChat() {
        return this.$store.getters.isUserLoggedInChat
      },
      links() {
        let arrayLinks = [];

        if (this.isUserLoggedIn) {
          arrayLinks.push(
            {title: 'Orders', icon: 'bookmark_border', url: '/orders'},
            {title: 'New', icon: 'note_add', url: '/new'},
            {title: 'My object', icon: 'list', url: '/list'},
          )
        }

        if (!this.isUserLoggedIn) {
          arrayLinks.push(
            {title: 'Login', icon: 'lock', url: '/login'},
            {title: 'Registration', icon: 'face', url: '/registration'},
          )
        }
        if (this.isUserLoggedInChat) {
          arrayLinks.push(
            {title: 'Chat', icon: 'chat', url: '/chat'},
            {title: 'Logout from chat', icon: 'chat', url: '/chat-logout'},
          )
        }
        if (!this.isUserLoggedInChat) {
          arrayLinks.push(
            {title: 'Login in chat', icon: 'chat', url: '/chat-login'},
          )
        }
        return arrayLinks;
      }
    }
  }
</script>
<style scoped>
  .pointer {
    cursor: pointer;
  }
</style>
