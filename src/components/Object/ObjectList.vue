<template>
  <v-container>
    <v-layout row v-if="!loading && myObjects.length !== 0">
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="text--secondary mb-3">Object List</h1>

        <v-card
          class="elevation-10 mb-3"
          v-for="object of myObjects"
          :key="object.id"
        >
          <v-layout row>
            <v-flex xs4>
              <v-card-media
                :src="object.imageSrc"
                height="160px"
              ></v-card-media>
            </v-flex>
            <v-flex xs8>
              <v-card-text>
                <h2 class="text--primary">{{object.title}}</h2>
                <p>{{object.description}}</p>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  class="info"
                  :to="'/object/' + object.id"
                >Open
                </v-btn>
              </v-card-actions>
            </v-flex>
          </v-layout>
        </v-card>

      </v-flex>
    </v-layout>

    <v-layout v-else-if="!loading && myObjects.length === 0" xs12 class="text-xs-center">
      <h1 class="text--primary">You have no objects</h1>
    </v-layout>

    <v-layout v-else>
      <v-flex>
        <app-loading></app-loading>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
  export default {
    computed: {
      myObjects() {
        return this.$store.getters.myObjects
      },
      loading() {
        return this.$store.getters.loading
      }
    }
  }
</script>
