<template>
      <div class="list-wrapper tab-panel" v-if="chatList && chatList.length">
        <div
          class="friend-chat-container"
          v-on:click="$emit('onClickChat', item, false)"
          v-for="item in chatList"
          v-bind:key="item.id"
        >
          <md-list class="md-triple-line">
            <md-list-item>
              <md-avatar
                ><font-awesome-icon v-if="!item.friend.friend_image"
                  icon="user"
                  size="2x"
                  style="color: rgb(206, 205, 205); margin-top: 5px"
              /><img v-else v-bind:src="item.friend.friend_image +'?'+new Date().getTime()" style="margin-right:10px" class="img-friend"></md-avatar>
              <div class="md-list-item-text">
                <span style="font-weight:bold;color:grey" v-if="item.friend.user_name">{{ item.friend.user_name }}</span>
                <span style="font-weight:bold;color:grey" v-else>{{ item.friend.friend_name }}</span>
                <div
                  class="last-message"
                  v-if="item.messages[item.messages.length-1].user_id == userId"
                >
                  <span style="position: relative;top: 1.4px;color:#5eca5e;"
                    >Você: </span
                  ><span style="display: inline-block;position: absolute;top: 1px;margin-left: 3px;text-overflow:ellipsis">{{ "  " + item.messages[item.messages.length-1].message }}</span>
                </div>
                <div class="last-message" v-else>
                  <span style="position: relative;top: 1.4px;color:#7171d4;"
                    >Ele:</span
                  ><span style="display: inline-block;position: absolute;top: 1px;margin-left: 3px;text-overflow:ellipsis">{{ "  " + item.messages[item.messages.length-1].message }}</span>
                </div>
              </div>
              <div style="
background: #38af61;
    width: 24px;
    height: 24px;
    text-align: center;
    border-radius: 50%;
    color: white;" v-if="item.unread_messages">
  <span style="font-size: 10px;">{{item.unread_messages}}</span>
</div>
            </md-list-item>
            <md-divider class="md-inset"></md-divider>
          </md-list>
        </div>
        <!--<div class="friend-chat-container" v-on:click="$emit('onClickChat', item)" v-for="item in chatList" v-bind:key="item.id">
            <span class="img-friend" style="width:52px;height:52px;text-align:center;background:white"><font-awesome-icon icon="user" size="2x" style="color:rgb(206, 205, 205);margin-top: 5px;" /></span>
            <span class="friend-name">{{ item.friend.user_name}}</span>
            <div class="last-message" v-if="item.messages[item.messages.length-1].user_id == userId"><span style="position: relative;top: 1.4px;"><img src="@/assets/icons8-up-right-24.png" style="width:10px;"></span><span>{{ "  " + item.messages[item.messages.length-1].message }}</span></div>
            <div class="last-message" v-else><span style="position: relative;top: 1.4px;"><img src="@/assets/icons8-up-left-24 (1).png" style="width:10px;"></span><span>{{ "  " + item.messages[item.messages.length-1].message }}</span></div>
        </div>-->
      </div>    
</template>

<script>

export default {
    name : "ListDialogs",
    props: {
        chatList: Array,
        userId: String,
    },
    emits: ["onClickChat"]
};

</script>
<style scoped>
.md-list-item-text * {
  width:70%;
}
.friend-name {
  display: inline-block;
  margin: 5px 0 0 0;
  font-weight: 200;
  font-size: 17px;
  color: #565656;
}
.md-list-item-text * {
  width:70%;
}
.md-dialog-title {
    margin-bottom: 20px;
    padding: 2px 24px 0;
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

.last-message {
  margin: 5px 0 0 0;
  padding: 0;
  font-size: 14px;
  position: relative;
  text-overflow: ellipsis;
  max-width: 180px;
}
.user-details {
  flex: 4.9%;
  padding: 0.85rem;
  background-color: /*#81c3d7*/#81d7aa;
}
.tab-friend-message {
  flex: 5%;
}
</style>