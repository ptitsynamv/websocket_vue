<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Registration form</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="valid" ref="form" lazy-validation>
              <v-text-field
                prepend-icon="email"
                name="email"
                label="Email"
                type="text"
                v-model="email"
                :rules="emailRules"
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                name="password"
                label="Password"
                type="password"
                :counter="5"
                v-model="password"
                :rules="passwordRules"
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                name="confirm-password"
                label="Confirm Password"
                type="password"
                :counter="5"
                v-model="confirmPassword"
                :rules="confirmPasswordRules"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="onSubmit"
              :disabled="!valid || loading"
              :loading="loading"
            >Registration
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        email: '',
        password: '',
        confirmPassword: '',
        valid: false,
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid'
        ],
        passwordRules: [
          v => !!v || 'Password is required',
          v => (v && v.length >= 5) || 'Password must be > than 5 characters'
        ],
        confirmPasswordRules: [
          v => !!v || 'Confirm Password is required',
          v => v === this.password || 'Passwords should match'
        ]
      }
    },
    methods: {
      onSubmit() {
        if (this.$refs.form.validate()) {
          const user = {
            email: this.email,
            password: this.password
          };
          this.$store.dispatch('registerUser', user)
            .then(() => {
              this.$router.push('/')
            })
            .catch(() => {})
        }

      }
    },
    computed: {
      loading() {
        return this.$store.getters.loading
      }
    }
  }
</script>
