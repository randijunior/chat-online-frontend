<template>
<div id="list-friends">
  <div class="list-wrapper tab-panel" v-if="this.friends && this.friends.length">
      <div v-for="item in this.friends" v-bind:key="item.friend_id">
          <div class="friend-list" v-on:click="initNewChat(item)">
            <div v-if="!item.friend_image" class="friend-icon">
              <font-awesome-icon
                icon="user"
                size="3x"
                style="color: rgb(206, 205, 205);"
            /></div>
            <img v-else style="width:40px;height:40px;margin-left:0px;margin-right:9px;" v-bind:src="item.friend_image +'?'+new Date().getTime()" class="img-friend">
            <div class="friend-list-name">
                <div style="font-weight:700">{{ item.friend_name }}</div>
                <div v-if="item.online">online</div>
                <div v-else>offline</div>
            </div>
            
          </div>
      </div>
  </div>
    <div style="margin: 10px 0px 20px 20px;" v-else>Você não tem amigos :(</div>
  <div style="text-align:end"><button @click="showDialogEvent" class="btn-new-friend">Novo Amigo</button></div>
</div>

</template>

<script>
export default {
  name: "ListFriends",
  props: {
    friends: Array
  },
  methods: {
      showDialogEvent: function() {
          this.$emit('showDialogListener');
      },
      initNewChat : function(e) {
        this.$emit('newChatListener', e);
      }
  }
};
</script>
<style scoped>
.btn-new-friend{
    outline: none;
    background-color: white;
    border:none;
    color:#4ca04c;
    cursor:pointer;
}
.list-wrapper {
    cursor: pointer;
    padding: 10px;
}
.list-wrapper > div:hover {
    background-color: #e3f1e8;
}
.friend-list {
    display: flex;
    min-width: 280px;
    margin-bottom: 7px;
}
.friend-list > div {
    margin-right: 10px;
}
.friend-icon {
    flex:10%;
    border-radius: 50%;
    text-align: center;
}
.friend-list-name {
    display: flex;
    flex-direction: column;
    flex: 90%;
    align-items: flex-start;
}
.friend-list-name > div {
    margin-bottom:5px;
}
</style>