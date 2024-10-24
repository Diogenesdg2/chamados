<template>  
  <div id="app">  
    <!-- Navbar aparece em todas as views -->  
    <Navbar />  

    <!-- Conteúdo principal tem margin-top suficiente para não sobrepor a navbar -->  
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