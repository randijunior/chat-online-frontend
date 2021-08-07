<template>
  <div id="friend-list-panel" v-click-outside="onClickOutside">
    <div>
      <md-dialog :md-active.sync="showDialog">
        <md-dialog-title><p>Novo Amigo</p></md-dialog-title>
        <md-dialog-content>
          <div>
                <md-field :class="messageClass">
      <label>Nome</label>
      <md-input v-model="nickName"></md-input>
      <span class="md-error">{{ errorMessage }}</span>
    </md-field>
          </div>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button @click="addFriend">Adicionar</md-button>
        </md-dialog-actions>
      </md-dialog>
    </div>
    <div>
      <md-dialog class="dialog-profile" :md-active.sync="showProfile">
        <md-dialog-title><p>Perfil</p>
          <div 
          class="img-friend"
          style="
            margin-top: 4px;
            width: 46px;
            margin-left:0px;
            height: 46px;
            text-align: center;
            background: white;
          "
          >
          <span v-if="!logged.user_image" id="profile-img">
            <font-awesome-icon
            icon="user"
            size="lg"
            style="color: rgb(206, 205, 205); margin-top: 5px;"
        /></span>
        <span v-else><img  class="img-friend" style="margin-left:0px;" v-bind:src="logged.user_image"></span>
      <md-avatar>
    </md-avatar>
        </div>

          <div class="profile-container">
        <p>{{logged.user_name}}</p>
        <p class="user-status" v-if="logged.online">online</p>
        </div>
        </md-dialog-title>
        <md-dialog-content>
          <img id="output">
        </md-dialog-content>
      </md-dialog>
    </div>
    <div>
      <md-dialog :md-active.sync="newChat">
        <md-dialog-title><p>Amigos</p></md-dialog-title>
        <md-dialog-content>
          <ListFriends v-bind:friends="friends" @newChatListener="createNewChat" @showDialogListener="showDialogEvent" />
        </md-dialog-content>
      </md-dialog>
    </div>
    <div class="user-details">
      <div style="height: 35px; position: relative">
        <button
          class="btn-context-menu"
          @click="showContextMenu = !showContextMenu;"
        >
          <font-awesome-icon
            size="lg"
            :icon="['fas', 'ellipsis-v']"
            style="color: white"
          />
        </button>
        <button
          style="
            position: absolute;
            right: 40px;
            top: 5px;
            background-color: inherit;
            border: none;
            cursor: pointer;
          "
          @click="newChat = true; showContextMenu = false"
        >
          <img src="@/assets/chat_black_24dp.svg" />
        </button>
        <div id="context-menu-wrapper" v-if="showContextMenu">
          <div class="context-menu-child" v-on:click="showProfile = true; showContextMenu = false">
            Perfil
          </div>
          <div class="context-menu-child" v-on:click="logout">Desconectar</div>
        </div>
          <label for="profile"
          class="img-friend"
          style="
            margin-top: 4px;
            width: 36px;
            margin-left:0px;
            height: 36px;
            text-align: center;
            background: white;cursor:pointer;
          "
          >
          <span v-if="!logged.user_image" id="profile-img">
            <font-awesome-icon
            icon="user"
            size="lg"
            style="color: rgb(206, 205, 205); margin-top: 5px;"
        /></span>
        <span v-else><img  class="img-friend" style="margin-left:0px;" v-bind:src="logged.user_image"></span>
      <md-avatar>
       <canvas  id="canvas" width="70px" height="70px" style="display:none"></canvas>
    </md-avatar>
        </label>
        <input type="file"  accept="image/*" name="avatar" id="profile"  v-on:change="loadFile($event)" style="display: none;">
      </div>
    </div>

    <div class="friend-list-child">
      <ListDialogs v-bind:chatList="chatList" v-bind:userId="userId"  @onClickChat="onClickChat"/>
    </div>
  </div>
</template>
<script>
import ListDialogs from '@/components/ListDialogs';
import vClickOutside from 'v-click-outside';
import ListFriends from '@/components/ListFriends';

import axios from "axios";
const HTTP = axios.create({
  baseURL: `https://chat-online-api.herokuapp.com`
});
export default {
  name: "Dialogs",
  directives: {
    clickOutside: vClickOutside.directive
  },
  components: {
    ListDialogs,
    ListFriends
  },
  props: {
    messages: Array,
    friends: Array,
    userId: String,
    chatList: Array,
    logged: Object,
    currentChat : Object,
    isVisible : String
  },
  /*watch: {
    chatList: function(newVal, oldVal) {
      console.log(newVal, oldVal);
    }
  },*/
  data() {
    return {
      showDialog: false,
      showProfile: false,
      showContextMenu: false,
      newChat: false,
      nickName: null,
      hasMessages: false,
      errorMessage: String
    };
  },
  emits: ["onClickChat"],
  methods: {
    logout: function () {
      localStorage.removeItem('token');
      this.$socket.emit('user disconnect');
      this.$router.push({name:'Login'});
    },
    onClickChat: function(item) {
        this.$emit('onClickFriendChatListener', item, false);
    },
    onClickOutside: function() {
      this.showContextMenu = false;
    },
    showDialogEvent: function() {
      this.showDialog = true;
      this.newChat = false;
    },
    addFriend: function() {
      if(this.friends.findIndex(obj => obj.friend_name == this.nickName) != -1) {
this.errorMessage = 'Esse usuário ja é seu amigo'
this.hasMessages = true;
      }
        
      else {
   const AUTH_TOKEN = `Bearer ${localStorage.getItem('token')}`;
    HTTP.defaults.headers.common['authorization'] = AUTH_TOKEN;
    HTTP.post('/friends', {friend_name: this.nickName})
    .then((response) => {
      if(response.data.err) {
            this.errorMessage = response.data.err;
            this.hasMessages = 'Show';
          }else {
            this.friends.push(response.data);
            this.showDialog = false;
            this.newChat = true;
            this.nickName = null;
              this.errorMessage = '';
              this.hasMessages = false;
          }
    })
      
    }
      },
      createNewChat : function(e) {
        this.currentChat.friend = e;
        this.currentChat.friendId = e.friend_id
        this.currentChat.userId = this.userId
        this.newChat = false;
        this.$emit('onClickFriendChatListener', e, true);
      },
      loadFile : function(event) {
          //var image = document.getElementById('output');
          let self = this;
          this.displayProfileImg = false;
          var imageObj = new Image();
          imageObj.src = URL.createObjectURL(event.target.files[0]);
          
          //image.src = URL.createObjectURL(event.target.files[0]);
          var canvas = document.getElementById('canvas');
          var ctx = canvas.getContext('2d');
          imageObj.onload = function() {
            ctx.drawImage(imageObj, imageObj.width/4,imageObj.height/3,imageObj.width/2, imageObj.height/2, 0, 0, 70, 80);
          canvas.toBlob(function(blob) {
            const formData = new FormData();
            formData.append('image',blob, `profile.jpg`)
               const AUTH_TOKEN = `Bearer ${localStorage.getItem('token')}`;
    HTTP.defaults.headers.common['authorization'] = AUTH_TOKEN;
            HTTP.post('/profile', formData).then((res)=>  {self.$emit('reload',res.data.image);self.$forceUpdate()})
          })
          }
          
      }
      

  },
    computed: {
      messageClass () {
        return {
          'md-invalid': this.hasMessages
        }
      }
    }
};
</script>
<style>
.profile-container {
  display: flex;
  flex-direction: column;
}
.profile-container p {
    margin: 0px 0px 4px 0px;
}
.user-status {
  font-size: 13px;
}
.btn-context-menu {
  position: absolute;
  right: 0;
  background-color: inherit;
  border: none;
  top: 5px;
  cursor: pointer;
  border-radius: 3px;
}
#context-menu-wrapper {
  z-index: 1000;
  position: absolute;
  background-color: white;
  right: 20px;
  top:40px;
  visibility: visible;
  padding: 9px 0px;
}

.context-menu-child {
  padding-right: 58px;
  padding-left: 24px;
  padding-top: 13px;
  height: 35px;
  font-size: 14.5px;
  cursor: pointer;
  line-height: 14.5px;
}

.context-menu-child:hover {
  background-color: #b9b9b9;
}

.img-friend {
  border-radius: 50%;
  float: left;
  margin-right: 15px;
  height: 99%;
  margin-left: 7px;
}

.md-triple-line:hover {
  background-color: #e1eaec;
}
.md-list-item-content{
  cursor: pointer;
}

</style>
<style scoped>
.img-friend >>> .md-avatar {
  width: 100%;
  height: 100%;
}
.dialog-profile {
  height: 420px !important;
  
}
.dialog-profile >>> .md-dialog-container{
min-width: 380px !important;
}
.md-dialog-title {
    margin-bottom: 20px;
    padding: 2px 24px 15px;
    background: #6ac56a;
    color:white;
}
.md-dialog-title > p {
  font-size: 14px;
  font-weight: 700;
}
.friend-chat-container {
  padding: 0.4rem;
}
#friend-list-panel {
  flex: 30%;
  border-right: 1px solid #b9b9b9;
  /*background: #f0f4f8;*/
  display: flex;
  flex-direction: column;
}
.friend-list-child {
  flex: 85%;
  background-color: white;
}

.user-details {
  flex: 5%;
  padding: 0.81em;
  background-color: /*#81c3d7*/#81d7aa;
}
.tab-friend-message {
  flex: 5%;
}
.chat-search {
  flex: 10%;
  position: relative;
  border-bottom: 1px solid #ccc;
}
.chat-search label {
  box-sizing: border-box;
  outline: none;
  top: 15px;
  left: 5px;
  right: 12px;
  padding-right: 22px;
  padding-left: 45px;
  align-items: center;
  height: 100%;
  display: flex;
  background: white;
}
.chat-search input {
  flex: 1;
  outline: none;
  border: none;
}
.chat-search button {
  position: absolute;
  left: 15px;
  color: #828689;
}
.search-btn {
  outline: none;
  border: 0;
  padding: 0;
  background: none;
  cursor: pointer;
}
</style>