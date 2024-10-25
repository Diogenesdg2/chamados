<template>  
    <div class="login-container">  
      <h1>Login</h1>  
      <form @submit.prevent="login">  
        <div class="form-group">  
          <label for="username">Usuário:</label>  
          <input type="text" v-model="username" class="form-control" required />  
        </div>  
        <div class="form-group">  
          <label for="password">Senha:</label>  
          <input type="password" v-model="password" class="form-control" required />  
        </div>  
        <button type="submit" class="btn-login">Login</button>  
      </form>  
      
      <button class="btn-register" @click="toggleRegister">Cadastro</button>  
    
      <div v-if="showRegister" class="register-container">  
        <h2>Cadastro de Usuário</h2>  
        <form @submit.prevent="register">  
          <div class="form-group">  
            <label for="new-username">Novo Usuário:</label>  
            <input type="text" v-model="newUsername" class="form-control" required />  
          </div>  
          <div class="form-group">  
            <label for="new-password">Nova Senha:</label>  
            <input type="password" v-model="newPassword" class="form-control" required />  
          </div>  
          <button type="submit" class="btn-register-submit">Registrar</button>  
        </form>  
      </div>  
    </div>  
  </template>  
  
  <script>  
  import { collection, query, where, getDocs, addDoc } from "firebase/firestore";  
  import { db } from '../firebaseConfig';  
  import { useRouter } from 'vue-router';  
    
  export default {  
    data() {  
      return {  
        username: '',  
        password: '',  
        newUsername: '',  
        newPassword: '',  
        showRegister: false  
      };  
    },  
    setup() {  
      const router = useRouter();  
      return { router };  
    },  
    methods: {  
      async login() {  
        const usuariosRef = collection(db, 'usuarios');  
        const q = query(usuariosRef, where('username', '==', this.username));  
        const querySnapshot = await getDocs(q);  
    
        if (querySnapshot.empty) {  
          alert('Usuário não encontrado!');  
          return;  
        }  
    
        querySnapshot.forEach((doc) => {  
          const userData = doc.data();  
          if (userData.password === this.password) {  
            alert('Login bem-sucedido!');  
            localStorage.setItem('loggedInUser', this.username);   
            console.log('Setting User:', this.username);  
            this.router.push('/cadastro').then(() => {  
              window.location.reload(); // Recarrega a página após o redirecionamento  
            });  
          } else {  
            alert('Senha incorreta!');  
          }  
        });  
      },  
      toggleRegister() {  
        this.showRegister = !this.showRegister;  
      },  
      async register() {  
        try {  
          const usuariosRef = collection(db, 'usuarios');  
          const q = query(usuariosRef, where('username', '==', this.newUsername));  
          const querySnapshot = await getDocs(q);  
    
          if (!querySnapshot.empty) {  
            alert('Nome de usuário já existe!');  
            return;  
          }  
    
          await addDoc(usuariosRef, {  
            username: this.newUsername,  
            password: this.newPassword  
          });  
    
          alert('Cadastro bem-sucedido!');  
          this.newUsername = '';  
          this.newPassword = '';  
          this.toggleRegister();  
        } catch (error) {  
          console.error('Erro ao cadastrar novo usuário:', error);  
          alert('Erro no cadastro!');  
        }  
      }  
    }  
  }  
  </script>  
  
  <style scoped>  
  .login-container, .register-container {  
    max-width: 400px;  
    margin: 2rem auto;  
    padding: 2rem;  
    background-color: #f7f7f7;  
    border-radius: 8px;  
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);  
  }  
  
  .form-group {  
    margin-bottom: 1rem;  
  }  
  
  .form-control {  
    width: 100%;  
    padding: 0.5rem;  
    margin-bottom: 1rem;  
    border: 1px solid #ccc;  
    border-radius: 4px;  
  }  
  
  .btn-login, .btn-register, .btn-register-submit {  
    width: 100%;  
    padding: 0.75rem;  
    margin-top: 1rem;  
    background-color: #007BFF;  
    color: white;  
    border: none;  
    border-radius: 4px;  
    cursor: pointer;  
    display: block;  
    text-align: center;  
  }  
  
  .btn-login:hover, .btn-register:hover, .btn-register-submit:hover {  
    background-color: black;  
  }  
  </style>