<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <v-card v-if="!loading">
          <v-card-media
            :src="object.imageSrc"
            height="300px"
          ></v-card-media>
          <v-card-text>
            <h1 class="text--primary">{{object.title}}</h1>
            <p>{{object.description}}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <addEditObjectModal :object="object" v-if="isOwner"></addEditObjectModal>

            <app-buy-modal :object="object"></app-buy-modal>

          </v-card-actions>
        </v-card>

        <div v-else>
          <app-loading></app-loading>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import EditObjectModal from './EditObjectModal'

  export default {
    props: ['id'],
    computed: {
      object() {
        return this.$store.getters.objectById(this.id)
      },
      loading() {
        return this.$store.getters.loading
      },
      isOwner() {
        return this.object.ownerId === this.$store.getters.user.id
      }
    },
    components: {
      addEditObjectModal: EditObjectModal
    },
  }
</script>
