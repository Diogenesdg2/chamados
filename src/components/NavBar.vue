<!-- Navbar.vue -->  
<template>  
    <nav class="navbar">  
      <ul class="nav-list">  
        <li class="nav-item">  
          <router-link to="/" class="nav-link">Home</router-link>  
        </li>  
        <li class="nav-item">  
          <router-link to="/consultar" class="nav-link">Consultar</router-link>  
        </li>  
        <li class="nav-item">  
          <router-link to="/manutencao" class="nav-link">Manutenção</router-link>  
        </li>  
      </ul>  
    </nav>  
  </template>  
  
  <script>  
  export default {  
    name: 'Navbar',  
  }  
  </script>  
  
  <style scoped>  
  .navbar {  
    position: fixed; /* Fixa a barra de navegação no topo */  
    top: 0;  
    width: 100%; /* Largura total da tela */  
    background-color: #007BFF;  
    padding: 1rem;  
    display: flex;  
    justify-content: center;  
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);  
    z-index: 1000; /* Garante que a navbar ficará sobre outros elementos */  
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