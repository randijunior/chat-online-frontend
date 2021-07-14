<template>
  <div id="home" v-if="showHome">
        <Dialogs
      ref="chat"
      v-bind:messages="messages"
      v-bind:friends="friends"
      v-bind:chatList="chatList"
      v-bind:userId="user.id"
      v-bind:logged="logged"
      @onClickFriendChatListener="onClickFriendChatListener"
      @reload="reloadImg"
      v-bind:currentChat="currentChat"
      v-bind:isVisible="isVisible"
    />
    <MainChat v-bind:currentChat="currentChat" v-bind:isVisible="isVisible"
    @createMessage="createUserMessage" />
  </div>
  <div style="border: 1px solid #2d2d2d;
    display: flex;
    justify-content: center;
    height: 100vh;
    align-items: center;" v-else><md-progress-spinner md-mode="indeterminate"></md-progress-spinner></div>
</template>

<script>

import MainChat from '@/components/MainChat.vue';
import Dialogs from '@/components/Dialogs.vue';
import VueJwtDecode from 'vue-jwt-decode';

import axios from "axios";
const HTTP = axios.create({
  baseURL: `https://chat-online-api.herokuapp.com`
});

export default {
  name: "Home",
  components: {
      MainChat,
      Dialogs
  },
  data: function () {
    return {
      isVisible: "hidden",
      currentChat: { friend: {}, messages: [] },
      chatList : [],
      messages: [],
      friends: [],
      user : {},
      errors: [],
      logged : {},
      showHome: false
    }
  },
  sockets: {
    connect: function () {
    },
    userList: function(data) {

        //console.log(`o usuario: ${data} conectou`);
        this.changeFriendStatus(true,data);
    },
    exit: function(data) {
      this.changeFriendStatus(false,data);
      //console.log(`o usuario: ${data} desconectou`);
    },
    messageReceived: function(data) {
      let friend = this.friends.find(element => element.friend_id == data[1]._id);
      if(!friend) {
          this.friends.push(data[1]);
      }
      this.messages.push(data[0]);
      if(data[0].user_id !== this.user.id)
        this.currentChat.messages = this.getFriendMessages(data[1]._id);
      let chatListM = this.chatList.find(e=>e.id == data[1]._id);
      if(this.currentChat.friendId == data[1]._id) {
        let dataM = {userId: this.user.id, friendId: data[1]._id};
        this.$socket.emit('message read', dataM);
      }else if(data[0].user_id != this.user.id){
        chatListM.unread_messages++;
      }
      
      chatListM.messages.push(data[0]);
    }
  },
  methods: {
    onClickFriendChatListener(id, isNewChat) {
      if(isNewChat) {
       this.isVisible = "visible"
       if(this.user.id == id.friend_id)this.currentChat.messages = this.messages.filter(m => m.friend_id == this.user.id)
       else this.currentChat.messages = this.getFriendMessages(id.friend_id);
      }else {
      this.isVisible = "visible"
      this.currentChat.friend = id.friend
      this.currentChat.friendId = id.id
      this.currentChat.userId = this.user.id
      id.messages.forEach(element => {
        if(element.readed == false)element.readed = true;
      });
      this.chatList.find(e => e.id == id.id).unread_messages = 0;
      let data = {userId: this.user.id, friendId: id.id};
      this.$socket.emit('message read', data);
      //Alterar mensagens não lidas no banco de dados
      if(id.id == this.user.id) {
        this.currentChat.messages = id.messages.filter(m => Object.prototype.hasOwnProperty.call(m,'__v') && m.friend_id == this.user.id && m.user_id == this.user.id)
      }else {
        this.currentChat.messages = id.messages;
      }

      }

      

    },
    getUserDetails() {
        let token = localStorage.getItem('token');
        try {
          let decoded = VueJwtDecode.decode(token);
          this.user = decoded
        }catch(error) {
          console.log(error,'erro ao decodificar token');
        }
    },
    getFriendMessages(friendID) {
        return this.messages.filter(message => 
        message.friend_id == friendID || 
        message.user_id == friendID);
    },
    createUserMessage(message, e) {
      message['user_id'] = this.user.id;
      message['readed'] = false;
      message['friend_id'] = this.currentChat.friendId;
      this.currentChat.messages.push({message: message.message,user_id: message.user_id, 
      friend_id: message.friend_id,readed: false});
      this.$nextTick(function() {
          e.scrollTop = e.scrollHeight - e.clientHeight;
      })
      let chatListM = this.chatList.findIndex(e=>e.id == message.friend_id);
      if(chatListM == -1) {
             this.chatList.push({
                  id: message.friend_id,
                  friend: this.currentChat.friend,
                  messages: this.currentChat.messages,
                  
                })
      }
      this.$socket.emit('chat message',message);
    },
    changeFriendStatus(status, id) {
      let indexFriend = this.chatList.findIndex(element => element.id === id);
      let indexFriendList = this.friends.findIndex(element => element.friend_id === id)
      
      //adiciona propriedade online ao amigo
      if(indexFriend !== -1)
        this.chatList[indexFriend].friend['online'] = status;
      if(indexFriendList !== -1)
        this.friends[indexFriendList].online = status;
    },
    getLastMessage(id) {
        let message_arr = this.getFriendMessages(id);
        return message_arr[message_arr.length-1];
    },
    async getUserInfo(id) {
      try{
        const response = await HTTP.get(`users/${id}`);
        return response.data
      }catch(error) {
        console.error(error);
      }
      
    },
    reloadImg(image) {
         this.logged['user_image'] = image
    }
  },
  created() {
    this.getUserDetails();
    this.$socket.emit('user connected',this.user.id);
    this.$socket.connect();
    this.logged.online = true;
  },
  mounted() {
    const AUTH_TOKEN = `Bearer ${localStorage.getItem('token')}`;
    HTTP.defaults.headers.common['authorization'] = AUTH_TOKEN;
    HTTP.get('/messages')
      .then( async(response) => {
        this.messages = response.data;
        let ids = [];
        for(let x = 0; x < this.messages.length; x++)ids.push(this.messages[x].user_id);
        let uniques = [...new Set(ids)];
        for(let x = 0; x < uniques.length;x++) {
          //se id unico igual a id do usuario
          if(uniques[x] == this.user.id) {
            //msg é igual a mensagem do array mensagens em q user_id == id único
          let msg = this.messages.find(m => m.user_id == uniques[x]);
          //se estiver mensagens em q o usuário não enviou para ele
          if(this.messages.findIndex(m => m.user_id == msg.friend_id) == -1) {
            let mObj = this.messages.find(message => message.user_id == uniques[x]);
            let r =  await HTTP.get(`users/${mObj.friend_id}`);
              let obj = {
                  id: mObj.friend_id,
                  friend: {online: r.data.online, user_name:r.data.user_name,_id: r.data._id,friend_image:r.data.user_image},
                  messages: this.getFriendMessages(uniques[x]),
                  
                }
                this.chatList.push(obj);
          }
          else {
              if(this.messages.find(m => m.user_id === m.friend_id)) {
              let r =  await HTTP.get(`users/${this.user.id}`);
              this.chatList.push({
                  id: this.user.id,
                  friend: {online: r.data.online, user_name:r.data.user_name,_id: r.data._id,friend_image:r.data.user_image},
                  messages: this.getFriendMessages(uniques[x])})
              }

          } 
          }
          else {
          let r =  await HTTP.get(`users/${uniques[x]}`);
          let f_m = this.getFriendMessages(uniques[x])
         let unr = f_m.filter(el => el.readed == false && el.user_id != this.user.id).length;
        let obj = {
                  id: uniques[x],
                  friend: {online: r.data.online, user_name:r.data.user_name,_id: r.data._id,friend_image:r.data.user_image},
                  messages: f_m,
                  unread_messages: unr
                }
          this.chatList.push(obj);
          }
        }
      })
      .catch((e) => {
        this.errors.push(e);
      }).finally(()=>this.showHome = true),
      HTTP.get('/friends').then((response) => {
        this.friends = response.data;
      })
      HTTP.get(`users/${this.user.id}`).then(response => {
            this.logged = response.data
            this.logged.online = true
            delete this.logged.user_password
      })
  }
};
</script>

<style>
#home {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  display: flex;
  height: inherit;
}

</style>
<style scoped>
</style>
