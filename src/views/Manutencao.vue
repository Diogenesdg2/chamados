<template>  
  <div class="manutencao-container">  
    <h1 class="manutencao-title">Manutenção de Chamados</h1>  

    <!-- Lista de Chamados Abertos -->  
    <div class="lista-chamados">  
      <h2>Chamados Abertos:</h2>  
      <ul>  
        <li v-for="(chamado, index) in chamadosAbertos" :key="index" @click="selecionarChamado(chamado)">  
          <p><strong>Código do Chamado:</strong> {{ chamado.codigo }}</p>  
          <p><strong>{{ chamado.titulo }}</strong> - {{ chamado.responsavel }}</p>  
          <p><em>Aberto em: {{ chamado.dataAbertura }}</em></p>   
          <p><strong>Prioridade:</strong> {{ chamado.prioridade }}</p>  
          <hr />  
        </li>  
      </ul>  
    </div>  

    <!-- Detalhes do Chamado Selecionado -->  
    <div v-if="chamadoSelecionado" class="detalhes-chamado">  
      <h3>Detalhes do Chamado Selecionado:</h3>  
      <p><strong>Código:</strong> {{ chamadoSelecionado.codigo }}</p>  
      <p><strong>Título:</strong> {{ chamadoSelecionado.titulo }}</p>  
      <p><strong>Responsável:</strong> {{ chamadoSelecionado.responsavel }}</p>  
      <p><strong>Descrição:</strong> {{ chamadoSelecionado.descricao }}</p>  
      <p><strong>Prioridade:</strong> {{ chamadoSelecionado.prioridade }}</p>  
      <p><strong>Data de Abertura:</strong> {{ chamadoSelecionado.dataAbertura }}</p>  

      <!-- Formulário para Tratamento do Chamado -->  
      <form @submit.prevent="tratarChamado" class="tratamento-form">  
        <div class="form-group">  
          <label for="tratamento">Tratamento Realizado:</label>  
          <textarea v-model="tratamento" class="form-control" required></textarea>  
        </div>  

        <button type="submit" class="btn-fechar">Fechar Chamado</button>  
      </form>  
    </div>  
  </div>  
</template>  

<script>  
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";  
import { app } from '../firebaseConfig';  

export default {  
  data() {  
    return {  
      chamadosAbertos: [],  
      chamadoSelecionado: null,  
      tratamento: '',  
      nomeResponsavelFechamento: '', // Armazena o nome do usuário logado  
    };  
  },  
  methods: {  
    async carregarChamadosAbertos() {  
      const db = getFirestore(app);  
      const chamadosQuery = query(collection(db, "chamados"), where("aberto", "==", true));  
      const querySnapshot = await getDocs(chamadosQuery);  

      // Organiza os chamados por prioridade  
      this.chamadosAbertos = querySnapshot.docs  
        .map(doc => ({ id: doc.id, ...doc.data() }))  
        .sort((a, b) => this.compararPrioridade(a.prioridade, b.prioridade));  
    },  

    compararPrioridade(prioridadeA, prioridadeB) {  
      const ordemPrioridade = { 'alta': 1, 'média': 2, 'baixa': 3 };  
      return ordemPrioridade[prioridadeA] - ordemPrioridade[prioridadeB];  
    },  

    selecionarChamado(chamado) {  
      this.chamadoSelecionado = chamado;  
      this.tratamento = ''; // Reinicia o campo de tratamento ao selecionar um novo chamado  
    },  

    async tratarChamado() {  
      if (!this.chamadoSelecionado) return;  

      const loggedInUser = localStorage.getItem('loggedInUser') || 'Usuário Desconhecido'; // Obtém o usuário logado   

      const db = getFirestore(app);  
      const chamadoRef = doc(db, "chamados", this.chamadoSelecionado.id);  

      await updateDoc(chamadoRef, {  
        aberto: false,  
        tratamento: this.tratamento,  
        nomeResponsavelFechamento: loggedInUser,  // Usa o usuário logado  
        dataFechamento: new Date().toISOString().split('T')[0]  
      });  

      alert("Chamado fechado com sucesso!");  

      // Atualiza a lista de chamados abertos removendo o chamado tratado  
      this.chamadosAbertos = this.chamadosAbertos.filter(ch => ch.id !== this.chamadoSelecionado.id);  
      this.chamadoSelecionado = null; // Desseleciona o chamado atual  
      
      // Registrar log da manutenção  
      await this.registrarLogManutencao(this.chamadoSelecionado, this.tratamento, loggedInUser);  
    },  

    async registrarLogManutencao(chamado, tratamento, loggedInUser) {  
      const db = getFirestore(app);  
      const logsCollectionRef = collection(db, "logsManutencao");  
      const logData = {  
        codigo: chamado.codigo,  
        tratamentoRealizado: tratamento,  
        responsavelFechamento: loggedInUser,  
        dataFechamento: new Date().toISOString().split('T')[0]  
      };  
      
      await addDoc(logsCollectionRef, logData);  
    }  
  },  
  mounted() {  
    this.carregarChamadosAbertos();  
  }  
}  
</script>  

<style scoped>  
.manutencao-container {  
  max-width: 800px;  
  margin: 0 auto;  
  padding: 2rem;  
  background-color: #f9f9f9;  
  border-radius: 8px;  
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);  
}  

.manutencao-title {  
  margin-bottom: 1.5rem;  
  font-size: 1.8rem;  
  color: #333;  
  text-align: center;  
}  

.lista-chamados {  
  margin-bottom: 2rem;  
}  

ul {  
  padding: 0;  
  list-style-type: none;  
}  

li {  
  margin: 0.5rem 0;  
  padding: 0.5rem;  
  background-color: #fff;  
  border-radius: 4px;  
  cursor: pointer;  
}  

li:hover {  
  background-color: #f0f0f0;  
}  

.detalhes-chamado {  
  padding: 1rem;  
  background-color: #fff;  
  border-radius: 8px;  
}  

.tratamento-form {  
  margin-top: 1rem;  
}  

.form-group {  
  margin-bottom: 1rem;  
}  

textarea, input[type="text"] {  
  width: 100%;  
  padding: 0.5rem;  
  font-size: 1rem;  
  border: 1px solid #ccc;  
  border-radius: 4px;  
  transition: border-color 0.3s;  
  outline: none;  
}  

textarea:focus, input[type="text"]:focus {  
  border-color: black;  
}  

.btn-fechar {  
  margin-top: 1rem;  
  padding: 0.75rem;  
  font-size: 1rem;  
  color: #fff;  
  background-color: #2c3e50;  
  border: none;  
  border-radius: 4px;  
  cursor: pointer;  
  transition: background-color 0.3s;  
}  

.btn-fechar:hover {  
  background-color: #007BFF;  
}  
</style>