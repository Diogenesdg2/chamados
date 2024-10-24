import { createRouter, createWebHistory } from 'vue-router';  
import ChamadoForm from '../components/ChamadoForm.vue';  
import Consultar from '../views/Consultar.vue';  
import Manutencao from '../views/Manutencao.vue';  


const routes = [ 
  
  { path: '/', component: ChamadoForm }, // Atualizado para usar ChamadoForm  
  { path: '/consultar', component: Consultar },  
  { path: '/manutencao', component: Manutencao },  
  
];  

const router = createRouter({  
  history: createWebHistory('/'),  
  routes  
});  

export default router;



