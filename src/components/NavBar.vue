<template>  
  <nav class="navbar">  
    <ul class="nav-list">  
      <li class="nav-item" v-if="loggedInUser">  
        <span class="nav-link">Bem-vindo, {{ loggedInUser }}</span>  
      </li>  
      <li class="nav-item" v-if="loggedInUser">  
        <router-link to="/cadastro" class="nav-link">Home</router-link>  
      </li>  
      <li class="nav-item" v-if="loggedInUser">  
        <router-link to="/consultar" class="nav-link">Consultar</router-link>  
      </li>  
      <li class="nav-item" v-if="mostrarMenuManutencao">  
        <router-link to="/manutencao" class="nav-link">Manutenção</router-link>  
      </li>  
      <li class="nav-item" v-if="loggedInUser">  
        <a href="#" @click.prevent="logOff" class="nav-link">Sair</a>  
      </li>  
    </ul>  
  </nav>  
</template>  

<script>  
import { ref, computed, onMounted } from 'vue';  
import { useRouter } from 'vue-router';  

export default {  
  name: 'Navbar',  
  setup() {  
    const router = useRouter();  
    const loggedInUser = ref('');  

    const usuariosComAcessoTotal = ['Diogenes', 'Ricardo', 'Milena', 'Corinta'];  

    const mostrarMenuManutencao = computed(() => {  
      return usuariosComAcessoTotal.includes(loggedInUser.value);  
    });  

    onMounted(() => {  
      loggedInUser.value = localStorage.getItem('loggedInUser') || '';  
      console.log('Logged In User:', loggedInUser.value);  
    });  

    const logOff = () => {  
      localStorage.removeItem('loggedInUser');  
      loggedInUser.value = '';   
      router.push('/');  
    };  

    return {  
      loggedInUser,  
      mostrarMenuManutencao,  
      logOff  
    };  
  }  
}  
</script>  

<style scoped>  
.navbar {  
  position: fixed;   
  top: 0;  
  width: 100%;  
  background-color: #007BFF;  
  padding: 1rem;  
  display: flex;  
  justify-content: center;  
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);  
  z-index: 1000;  
}  

.nav-list {  
  list-style-type: none;  
  margin: 0;  
  padding: 0;  
  display: flex;  
  gap: 2rem;  
}  

.nav-item {}  

.nav-link {  
  color: white;  
  text-decoration: none;  
  font-weight: bold;  
  transition: color 0.3s;  
}  

.nav-link:hover {  
  color: #ffdd57;  
}  
</style>