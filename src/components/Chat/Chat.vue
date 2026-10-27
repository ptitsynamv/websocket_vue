<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>

      <v-flex d-flex md4>
        <v-card color="purple lighten-1" dark>
          <v-card-title primary class="title">{{currentUser.email}}</v-card-title>
          <v-card-text>

            <v-subheader inset>Users</v-subheader>

            <v-list-tile v-for="user in users" :key="user.id">
              <v-layout v-if="user.isOnline || currentUser.isAdmin">
                <v-list-tile-avatar v-if="user.isOnline" >
                 o
                </v-list-tile-avatar>

                <v-list-tile-content>
                  {{ user.email }}
                </v-list-tile-content>

                <v-list-tile-action>
                  <template v-if="currentUser.isAdmin">
                    <v-btn flat small color="grey lighten-2" @click="onBan(user.id)">{{user.isBan ? 'UnBan' : 'Ban'}}
                    </v-btn>
                    <v-btn flat small color="grey lighten-2" @click="onMute(user.id)"> {{user.isMute ? 'UnMute' :
                      'Mute'}}
                    </v-btn>
                  </template>
                </v-list-tile-action>
              </v-layout>
            </v-list-tile>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex d-flex md8>
        <v-layout column wrap>

          <v-flex d-flex>
            <v-card color="deep-purple lighten-3" dark>
              <v-flex text-xs-center v-show="isExistPreviousMessage">

                <div>
                  <v-btn color="primary" @click="getPreviousMessage()">Previous message</v-btn>
                </div>

              </v-flex>

              <v-layout v-for="message in messages" :key="message.date">
                <v-flex md5 :class="getClassMessageCard(message.userId)">
                  <v-card-text>
                    <span :style="'color: ' + message.color">{{message.userName}}</span><br>
                    {{message.comment}}
                  </v-card-text>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>

          <v-flex d-flex>
            <v-layout row wrap>
              <v-flex d-flex xs12>
                <v-card color="grey lighten-1" dark>
                  <v-card-text>

                    <v-form ref="form" v-model="valid" lazy-validation>
                      <v-text-field
                        v-model="message"
                        :rules="messageRules"
                        :counter="80"
                        label="Message"
                        required
                      ></v-text-field>

                      <v-btn
                        class="primary"
                        :disabled="!valid"
                        @click="submit"
                      >
                        submit
                      </v-btn>
                      <v-btn
                        class="primary"
                        @click="clear"
                      >clear
                      </v-btn>
                    </v-form>

                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        items2: [
          {icon: 'assignment', iconClass: 'blue white--text', title: 'Vacation itinerary', subtitle: 'Jan 20, 2014'},
          {icon: 'call_to_action', iconClass: 'amber white--text', title: 'Kitchen remodel', subtitle: 'Jan 10, 2014'}
        ],
        valid: true,
        message: '',
        messageRules: [
          v => !!v || 'Message is required',
          v => (v && v.length <= 80) || 'Message must be less than 80 characters'
        ],
        paginationSkip: 0,
        paginationLimit: 2,
        isExistPreviousMessage: true,
        isCanSendMessage: true
      }
    },
    methods: {
      submit() {
        if (this.currentUser.isMute || this.currentUser.isBan || !this.isCanSendMessage) {
          this.$store.commit('setError', `Current user Cant Send Message`);
          return;
        }
        this.isCanSendMessage = false;

        const newMessage = {
          sender: this.currentUser.token,
          comment: this.message,
        };

        this.$socket.emit('message', newMessage);

        setTimeout(() => {
          this.isCanSendMessage = true;
        }, 15000);
      },
      clear() {
        this.message = ''
      },
      getPreviousMessage() {
        this.paginationSkip += this.paginationLimit;

        this.$socket.emit('getPreviousMessage', {
          paginationSkip: this.paginationSkip,
          paginationLimit: this.paginationLimit
        });
      },
      getClassMessageCard(userId) {
        return userId === this.currentUser.id ? 'offset-md9' : '';
      },
      onMute(userForMuteId) {
        if (!this.currentUser.isAdmin) {
          this.$store.commit('setError', `Current user is not admin`);
        }
        this.$socket.emit('mute', {
          userForMuteId: userForMuteId,
          sender: this.currentUser.token
        })
      },
      onBan(userForBanId) {
        if (!this.currentUser.isAdmin) {
          this.$store.commit('setError', `Current user is not admin`);
          return;
        }
        this.$socket.emit('ban', {
          userForBanId: userForBanId,
          sender: this.currentUser.token
        })
      }
    },
    computed: {
      users() {
        return this.$store.getters.users;
      },
      messages() {
        return this.$store.getters.messages;
      },
      currentUser() {
        return this.$store.getters.userChat;
      }
    },
    created() {
      this.$socket.emit('login', this.$store.getters.userChat.token);

      this.$options.sockets.allUsers = (data) => {
        this.$store.dispatch('setUsers', data)
      };

      this.$options.sockets.message = (data) => {
        if (data.message.length < this.paginationLimit && !data.isNewMessage) {
          this.isExistPreviousMessage = false;
        }
        this.$store.dispatch('setMessages', data)
      };

      this.$options.sockets.serverError = (data) => {
        this.$store.commit('setError', `code: ${data.code}, message: ${data.message}`)
      };

      this.$options.sockets.disconnect = (data) => {
        console.log('disconnect');
        this.$socket.emit('logout', this.$store.getters.userChat.token);
        this.$store.dispatch('chatLogoutUser');
        this.$router.push('/')
      };
    },
    beforeDestroy() {
      this.$store.dispatch('clearSocket');
    }
  }
</script>
