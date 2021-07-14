<template>
<div id="wraped-form">
    <div id="container-login-form">
        <span class="login-form-title">ChatApp</span>
        <span class="form-subtitule">Bem-vindo</span>
        <div v-if="acc_cr" style="margin:10px;color:green">Conta criada com sucesso!</div>
        <div v-if="login_err == true" style="color:red;margin:10px;">Usuário ou senha inválidos</div>
        <div v-else>
            <div v-if="loading" style="margin:10px;">Carregando...</div>
        </div>
        <div class="form">
            <div>
                <label for="user">
                    <span v-if="userError" style="color:red">{{userError}}</span>
                    <input type="text" v-model="username" placeholder="Usuario" name="user" spellcheck="false" autocomplete="off" id="user">
                </label>
            </div>
            <div style="margin-bottom:2em">
                <label for="password">
                    <span v-if="passwordError" style="color:red">{{passwordError}}</span>
                   <input type="password" v-model="password" placeholder="Senha" name="password" autocomplete="off" id="password">
                </label>
            </div>
            <button  @click="login" id="btn_submit_form">Entrar</button>
            <div style="margin-top:2em;font-family: 'Poppins', sans-serif;">Não possui uma conta?</div>
            <a href="/signup">Cadastre-se</a>
        </div>
    </div>
    <!--
    <div class="form">
  <h1>Chat App</h1>
  <input placeholder="Username" type="text" required="">
  <input placeholder="Password" type="password" required="">
  <button>Submit</button>
</div> 
-->
</div>
</template>
<script>
import axios from "axios";
const HTTP = axios.create({
  baseURL: `https://chat-online-api.herokuapp.com`
});


export default {
    name: 'Login',
    data() {
        return {
            username: null,
            password : null,
            login_err: false,
            loading: false,
            userError: undefined,
            passwordError: undefined
        }
    },
    props: {
        acc_cr: Boolean
    },
    created() {
    },
    methods: {
        login() {
            if(this.username && this.password) {
            this.loading = true;
            HTTP.post('/auth',{user_name: this.username, 
            user_password: this.password})
            .then(response => {
                let res = response.data.error;
                if(res == 'auth_fail') {
                    this.login_err = true;
                }else {
                    this.login_err = false;
                    localStorage.setItem('token', response.data.token);
                    this.$router.push({name:'home'});
                }
            }).catch(err =>{
                if(err.response) {
                    console.log(err.response.data);
                }
            })
            }
            if (!this.username){
                this.userError = 'Insira um nome de usuário'
            }else {
                this.userError = ''
            }
            if(!this.password) {
                this.passwordError = 'Insira uma senha'
            }else {
                this.passwordError = ''
            }

            
            
        }
    }
}
</script>
<!--
<style scoped>
.form {
    box-sizing: border-box;
    width: 260px;
    margin: 100px auto 0;
}

</style>
-->
<style scoped>
    #wraped-form {
        height: 94.8%;
        padding: 1rem;
        text-align: center;
        /*background: #c1cbef;*/
    }

    #container-login-form {
        text-align: center;
        font-size: 14px;
        display: inline-block;
        width: 390px;
        overflow: hidden;
        padding: 77px 55px 33px 55px;
        background-color: inherit;
        margin-top: 2rem;
    }
    a {
        color: #3b5f9e;
    }
    .login-form-title{
        font-size: 35px;
        color: #333333;
        font-weight: bold;
        margin: 10px;
        display: block;
    }
    .form-subtitule {
    margin: 1.5rem;
    display: block;
    font-size: 16px;
    }
    label {display: inline-block;}
    input {
        outline: none;
            padding: 13px 16px 11px;
    }
label[for="user"]{
    margin-bottom:20px;
    font-family: 'Montserrat', sans-serif;
}

label[for="password"]{

    font-family: 'Montserrat', sans-serif;
}
#btn_submit_form {
    font-size: 12px;
    padding: 10px;
    border-radius: 5px;
    margin-left: 14px;
    background-color: #e2e2ff;
    border: 1px solid #e2e2e2;
    cursor: pointer;
    outline: none;

}
</style>