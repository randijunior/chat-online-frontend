<template>
        <div class="limiter" id="signup">
            <div class=".container-fluid form_container">
                <div id="container_login_form">
                    <span class="login-form-title">Criar Conta</span>
                    <span class="user-image"></span>
                    <form @submit="validate">
                        <div v-if="errors.length">
                            <ul>
                                <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
                            </ul>
                        </div>
                        <div style="margin-bottom:20px;">
                            <label for="usuario" >
                                <input type="text" name="usuario" v-model="username" placeholder="Usuario" autocomplete="off" id="usuario" />
                            </label>
                        </div>
                        <div style="margin-bottom: 20px;">
                            <label for="senha">
                                <input type="password" v-model="password" name="senha" placeholder="Senha"  id="senha" />
                            </label>
                        </div>
                        <div style="margin-bottom: 2em;">
                            <label for="senha">
                                <input type="password" v-model="confirm" name="senha" placeholder="Confirmar senha"  id="confirm" />
                            </label>
                        </div>
                        <button type="submit"  v-on:click="validate" id="btn_submit_form">Entrar</button>
                    </form>
                </div>
            </div>
        </div>
</template>
<script>
import axios from "axios";
const HTTP = axios.create({
  baseURL: `https://chat-online-api.herokuapp.com`
});
export default {
    name:'Signup',
    data() {
        return {
            username: null,
            password: null,
            confirm: null,
            errors : []
        }
    },
    methods : {
        validate: function(e) {
                if(this.password === this.confirm && !(/^\d+$/.test(this.username))) {
                    e.preventDefault();
                    HTTP.post('/create_account', 
                {user_name: this.username,user_password: this.password})
                .then(res => {
                    if(res.data.error)this.errors.push(res.data.error)
                    else {
                        this.$router.push({name: 'Login', params: {acc_cr: true}});
                    }
                    })
                .catch(error => this.errors.push(error.response.data));

                }
                this.errors = [];

                if(/^\d+$/.test(this.username)) {
                    this.errors.push('usuario não pode conter só números');
                }

                if(this.password !== this.confirm) {
                    this.errors.push('senhas não coincidem');
                }

                if(!this.username) {
                    this.errors.push('insira um nome de usuario');
                }
                if(!this.password) {
                    this.errors.push('insira uma senha');
                }

                e.preventDefault();
        },

        },
    }
</script>
<style scoped>
#container_login_form{
    text-align: center;
    font-size: 14px;
    display: inline-block;
    width: 390px;
    border-radius: 10px;
    overflow: hidden;
    padding: 77px 55px 33px 55px;
    background-color: white;
    box-shadow: 0 5px 10px 0px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 0 5px 10px 0px rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: 0 5px 10px 0px rgba(0, 0, 0, 0.1);
    -o-box-shadow: 0 5px 10px 0px rgba(0, 0, 0, 0.1);
    -ms-box-shadow: 0 5px 10px 0px rgba(0, 0, 0, 0.1);
}

.login-form-title {
    font-size: 35px;
    color: #333333;
    font-weight: bold;
    margin: 10px;
    display: block;
    font-family: 'Poppins', sans-serif;
}

#btn_submit_form{
    font-size: 12px;
    padding: 5px;
    background-color: #626fdd;
    border: 1px solid #efefefef;
    color: #f8f8f7;
    margin-left: 12px;
}

.user-image{
    content: url("https://api.iconify.design/mdi-account-circle-outline.svg?color=%23333333&height=70");
    vertical-align: -0.125em;
    margin: 1.5rem;
}
.form_container{
padding: 1rem;
 text-align: center;
min-height: 100vh;
background: #f2f2f2;

}

label[for="usuario"]{
    margin-bottom:20px;
    font-family: 'Montserrat', sans-serif;
}

label[for="senha"]{
    font-family: 'Montserrat', sans-serif;
}
</style>