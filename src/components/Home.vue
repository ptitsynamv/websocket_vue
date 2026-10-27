<template>
  <div v-if="!loading">
    <v-container fluid>
      <v-layout row>
        <v-flex xs12>
          <v-carousel>
            <v-carousel-item
              v-for="object of promoObjects"
              :key="object.id"
              :src="object.imageSrc"
            >
              <div class="car-link">
                <v-btn class="error" :to="'/' + object.id">{{object.title}}</v-btn>
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container grid-list-lg>
      <v-layout row wrap>
        <v-flex
          xs12
          sm6
          md4
          v-for="object of objects"
          :key="object.id"
        >
          <v-card>
            <v-card-media
              :src="object.imageSrc"
              height="200px"
            ></v-card-media>

            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{object.title}}</h3>
                <div>{{object.description}}</div>
              </div>
            </v-card-title>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat color="orange" :to="'/object/' + object.id">Open</v-btn>

              <app-buy-modal :object="object"></app-buy-modal>

            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
  <div v-else>
    <app-loading></app-loading>
  </div>
</template>

<script>
  export default {
    computed: {
      promoObjects() {
        return this.$store.getters.promoObjects
      },
      objects() {
        return this.$store.getters.objects
      },
      loading() {
        return this.$store.getters.loading
      }
    }
  }
</script>

<style scoped>
  .car-link {
    position: absolute;
    bottom: 50px;
    left: 50%;
    background: rgba(0, 0, 0, .5);
    transform: translate(-50%, 0);
    padding: 50px 15px;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
  }
</style>
