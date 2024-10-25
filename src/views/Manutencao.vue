<template>  
    <div class="manutencao-container">  
      <h1 class="manutencao-title">Manutenção de Chamados</h1>  
  
      <!-- Lista de Chamados Abertos -->  
      <div class="lista-chamados">  
        <h2>Chamados Abertos:</h2>  
        <ul>  
          <li v-for="(chamado, index) in chamadosAbertos" :key="index" @click="selecionarChamado(chamado)">  
            <strong>{{ chamado.titulo }}</strong> - {{ chamado.responsavel }} <br>  
            <em>Aberto em: {{ chamado.dataAbertura }}</em>  
          </li>  
        </ul>  
      </div>  
  
      <!-- Detalhes do Chamado Selecionado -->  
      <div v-if="chamadoSelecionado" class="detalhes-chamado">  
        <h3>Detalhes do Chamado Selecionado:</h3>  
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
  
          <div class="form-group">  
            <label for="nomeResponsavel">Nome do Responsável pelo Fechamento:</label>  
            <input type="text" v-model="nomeResponsavelFechamento" class="form-control" required />  
          </div>  
  
          <button type="submit" class="btn-fechar">Fechar Chamado</button>  
        </form>  
      </div>  
    </div>  
  </template>  
  
  <script>  
  import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";  
  import { app } from '../firebaseConfig';  
  
  export default {  
    data() {  
      return {  
        chamadosAbertos: [],  
        chamadoSelecionado: null,  
        tratamento: '',  
        nomeResponsavelFechamento: ''  
      };  
    },  
    methods: {  
      async carregarChamadosAbertos() {  
        const db = getFirestore(app);  
        const chamadosQuery = query(collection(db, "chamados"), where("aberto", "==", true));  
        const querySnapshot = await getDocs(chamadosQuery);  
        this.chamadosAbertos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));  
      },  
      selecionarChamado(chamado) {  
        this.chamadoSelecionado = chamado;  
        this.tratamento = ''; // Reinicia o campo de tratamento ao selecionar um novo chamado  
        this.nomeResponsavelFechamento = ''; // Reinicia o nome do responsável  
      },  
      async tratarChamado() {  
        if (!this.chamadoSelecionado) return;  
  
        const db = getFirestore(app);  
        const chamadoRef = doc(db, "chamados", this.chamadoSelecionado.id);  
  
        await updateDoc(chamadoRef, {  
          aberto: false,  
          tratamento: this.tratamento,  
          nomeResponsavelFechamento: this.nomeResponsavelFechamento,  
          dataFechamento: new Date().toISOString().split('T')[0]  
        });  
  
        alert("Chamado fechado com sucesso!");  
  
        // Atualiza a lista de chamados abertos removendo o chamado tratado  
        this.chamadosAbertos = this.chamadosAbertos.filter(ch => ch.id !== this.chamadoSelecionado.id);  
        this.chamadoSelecionado = null; // Desseleciona o chamado atual  
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
    border-color: #007BFF;  
  }  
  
  .btn-fechar {  
    margin-top: 1rem;  
    padding: 0.75rem;  
    font-size: 1rem;  
    color: #fff;  
    background-color: #007BFF;  
    border: none;  
    border-radius: 4px;  
    cursor: pointer;  
    transition: background-color 0.3s;  
  }  
  
  .btn-fechar:hover {  
    background-color: black;  
  }  
  </style>