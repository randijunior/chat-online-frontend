<template>
  <div id="main-chat"  v-bind:style="{ visibility: isVisible }">
    <div class="item" id="item1">
      <div class="friend-chat-container">
        <span v-if="!currentChat.friend.friend_image"
          class="img-friend"
          style="
            border: 1px solid #efefef;
            margin-top: 4px;
            width: 36px;
            height: 36px;
            text-align: center;
            background: white;
          "
          ><font-awesome-icon
            icon="user"
            size="lg"
            style="color: rgb(206, 205, 205); margin-top: 5px"
        /></span>
        <img v-else v-bind:src="currentChat.friend.friend_image +'?'+new Date().getTime()" style="width:48px;height:48px;" class="img-friend">
        <span class="friend-name" v-if="currentChat.friend.user_name">{{ currentChat.friend.user_name }}</span>
        <span class="friend-name" v-else>{{ currentChat.friend.friend_name }}</span>


        <div class="status">
          <span v-if="currentChat.friend.online"
            ><!--<span style="position: relative;bottom: 1px;"><font-awesome-icon icon="circle" size="lg" style="color:green;font-size:8px;"/></span>-->
            <span>online</span></span
          >
          <span v-else
            ><!--<span style="position: relative;bottom: 1px;"><font-awesome-icon icon="circle" size="lg" style="color:red;font-size:8px;"/></span>-->
            <span>offline</span></span
          >
        </div>
      </div>
    </div>
    <div class="item" id="item2" ref="chatContainer">
      <div
        v-for="(item, index) in currentChat.messages"
        v-bind:key="item._id"
        v-bind:class="[msgAlign(item) ? 'isSend' : 'isReceived', 'message',`index-${index}`]"
      >
        <div class="msg-send">
          <div>{{ item.message }}</div>
          <!--<div v-if="msgAlign(item)"><img src="@/assets/done_black_24dp.svg"></div>-->
        </div>
      </div>
    </div>
    <div class="item" id="item3">
      <!--<button class="btn">
        <font-awesome-icon icon="smile" size="lg" />
      </button>-->
      <div class="text">
        <div class="text2">
          <div tabindex="-1" class="_1JAUF _2x4bz">
            <div class="OTBsx" style="visibility: hidden;">Digite uma mensagem</div>
            <div class="_2_1wd" contentEditable="true" spellcheck="false" ref="messageInput" @blur="changeMessage($event.target)"></div>
          </div>
          <!--<input type="text" class="msg" spellcheck="false" v-model="message"
            placeholder="Mensagem" />-->
        </div>
      </div>
      <button class="btn" @click="onSend">
        <font-awesome-icon icon="paper-plane" size="lg" />
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: "MainChat",
  components: {},
  props: {
    isVisible: String,
    currentChat: Object,
  },
  watch: {
    isVisible : function() {
      this.$nextTick(function() {
          let e = this.$refs.chatContainer;
          e.scrollTop = e.scrollHeight - e.clientHeight;
      })
    }
  }
  ,
  data: function () {
    return {
      showMsg: "inherit",
      messages: this.currentChat,
      message: "",
    };
  },
  methods: {
    msgAlign(item) {
     
      if (item.user_id == undefined) return true;
      return item.user_id == this.currentChat.userId;
    },
    onSend() {
       var chat_c = this.$refs.chatContainer;
      let new_message = {
        friend_id: this.currentChat.friendId,
        message: this.message,
      };

      if (!this.messages.messages) {
        this.messages.messages = [];
      }
      this.$emit("createMessage", new_message, chat_c);
     this.$refs.messageInput.textContent = '';
      this.message = '';
    },
    changeMessage(e) {
      this.message = e.textContent;
    },
  },
};
</script>



<style scoped>
#main-chat {
  flex: 70%;
  display: flex;
  flex-direction: column;
}
.friend-name {
  color:white;
  font-weight: 700;
}
.item {
  flex: 1;
}
#item1 {
  flex-grow: 0.26;
  font-size: 16px;
}
#item2 {
  flex-grow: 2;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 10px;
  position: relative;
}
/*::-webkit-scrollbar {
  width: 5px;
  height: 10px;
  background-color: #d6d6d6;
}*/
#item3 {
  flex-grow: 0;
  padding: 5px 10px;
  display: flex;
  flex-direction: row;
  border-top: 1px solid rgb(232 232 232 / 90%);
  background: rgb(232 232 232 / 90%);
}

.text {
  margin: 5px 10px;
  padding: 9px 12px 11px;
  background-color: white;
  flex: 1 1 auto;
  border-radius: 20px;
}
.text2 {
  position: relative;
  width: 100%;
  min-height: 20px;
  word-wrap: break-word;
}
._1JAUF{
position: relative;
    display: flex;
    flex: 1;
    overflow: hidden;
    cursor: text;
}
._1JAUF .OTBsx {
  position: absolute;
    top: 2px;
    bottom: 2px;
    z-index: 2;
    font-size: 15px;
    line-height: 20px;
    top: 0;
    left: 4px;

}

._2_1wd{
  max-height: 100px;
  min-height: 20px;
  outline: none;
  width: 52rem;
  max-width: 52rem;
}
.msg {
  min-width: 0;
  word-break: break-word;
  outline: none;
  width: 99%;
  font-size: 17px;
  border: none;
}
.btn {
  border: 0;
  outline: none;
  background-color: inherit;
  cursor: pointer;
  cursor: pointer;
  color: #6b8ba7;
}
.friend-chat-container {
  padding-top: 6px;
  height: 100%;
  background-color:#81d7aa;
}
.status {
  margin: 5px 0 0 0;
  padding: 0;
  font-size: 13px;
  color:white;
}
.message {
  /*margin-top: 3em;*/
  padding: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  
}
.message > div {
  border-radius: 5px;
  padding: 5px;
  max-width: 200px;
    word-break: break-word;
}
.isSend > div {
  background-color: rgb(201 241 200 / 90%);
  margin-right: 20px;
}
.isSend {
  align-items: flex-end;
}

.isReceived > div {
  border: 1px solid #b7b5b5;
}
.isReceived {
  align-items: flex-start;
  margin-left: 20px;
}

.msg-send {
  display: flex;
}
</style>