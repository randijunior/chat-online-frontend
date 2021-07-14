import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueSocketIO from 'vue-socket.io'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import { MdDialog, MdButton, MdList, MdAvatar, MdDivider, MdField, MdProgress } from 'vue-material/dist/components'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPaperPlane, faSmile, faSearch, faUser, faCircle,faAngleLeft,faAngleRight, faBars, faEllipsisV, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon, FontAwesomeLayers } from "@fortawesome/vue-fontawesome";



Vue.config.productionTip = false

library.add(faPaperPlane, faSmile, faSearch, faUser, faCircle, faAngleLeft, faAngleRight, faBars, faEllipsisV, faCheck);
Vue.use(MdDialog);
Vue.use(MdButton);
Vue.use(MdList);
Vue.use(MdAvatar);
Vue.use(MdDivider);
Vue.use(MdField);
Vue.use(MdProgress);

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)

Vue.use(new VueSocketIO({
  debug: false,
  connection: 'https://chat-online-api.herokuapp.com'
}))



new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
