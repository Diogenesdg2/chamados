<template>  
  <div id="app">  
    <!-- Navbar renderizada condicionalmente com base na rota -->  
    <Navbar v-if="shouldShowNavbar" />  

    <!-- Conteúdo principal -->  
    <main class="main-content">  
      <router-view />  
    </main>  
  </div>  
</template>  

<script>  
import Navbar from './components/Navbar.vue';  

export default {  
  components: {  
    Navbar,  
  },  
  computed: {  
    shouldShowNavbar() {  
      // Verifica se a rota atual não é a de login  
      return this.$route.path !== '/login';  
    }  
  }  
}  
</script>  

<style>  
body {  
  margin: 0;  
  font-family: Arial, sans-serif;  
}  

.main-content {  
  margin-top: 70px; /* Ajuste conforme a altura da sua navbar */  
  padding: 1rem;  
}  

#app {  
  min-height: 100vh;  
}  
</style>