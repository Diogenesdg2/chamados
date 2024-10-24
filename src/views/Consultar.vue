<template>  
    <div class="consulta-container">  
      <h1 class="consulta-title">Consultar Chamados</h1>  
  
      <!-- Formulário de Filtro -->  
      <form @submit.prevent="consultarChamados" class="consulta-form">  
        <div class="form-group">  
          <label for="dataInicio">Data inicial da abertura:</label>  
          <input type="date" v-model="filtros.dataAberturaInicio" class="form-control" />  
        </div>  
  
        <div class="form-group">  
          <label for="dataFim">Data final da abertura:</label>  
          <input type="date" v-model="filtros.dataAberturaFim" class="form-control" />  
        </div>  
  
        <div class="form-group">  
          <label for="dataFechamentoInicio">Data inicial do fechamento:</label>  
          <input type="date" v-model="filtros.dataFechamentoInicio" class="form-control" />  
        </div>  
  
        <div class="form-group">  
          <label for="dataFechamentoFim">Data final do fechamento:</label>  
          <input type="date" v-model="filtros.dataFechamentoFim" class="form-control" />  
        </div>  
  
        <div class="form-group">  
          <label for="responsavel">Responsável:</label>  
          <input type="text" v-model="filtros.responsavel" class="form-control" placeholder="Nome do responsável" />  
        </div>  
  
        <div class="form-group">  
          <label for="aberto">Estado do Chamado:</label>  
          <select v-model="filtros.aberto" class="form-control">  
            <option :value="true">Aberto</option>  
            <option :value="false">Fechado</option>  
            <option :value="null">Todos</option>  
          </select>  
        </div>  
  
        <div class="form-group">  
          <label for="departamento">Departamento:</label>  
          <select v-model="filtros.departamento" class="form-control">  
            <option value="">Todos</option> <!-- Option para não filtrar por departamento -->  
            <option value="departamento-contabil">Departamento Contábil</option>  
            <option value="departamento-extra-contabil">Departamento Extra Contábil</option>  
            <option value="departamento-fiscal">Departamento Fiscal</option>  
            <option value="departamento-pessoal">Departamento Pessoal</option>  
            <option value="diretoria">Diretoria</option>  
            <option value="financeiro">Financeiro</option>  
          </select>  
        </div>  
  
        <button type="submit" class="btn-consultar">Consultar</button>  
      </form>  
  
      <!-- Exibição dos Resultados -->  
      <div v-if="resultados.length > 0" class="resultados-container">  
        <h2>Resultados da Consulta:</h2>  
        <ul>  
          <li v-for="(chamado, index) in resultados" :key="index">  
            <strong>{{ chamado.titulo }}</strong> - {{ chamado.responsavel }}  
            <div v-if="!chamado.aberto">  
              <p><strong>Fechado em:</strong> {{ chamado.dataFechamento }}</p>  
              <p class="tratamento-detalhe1"><strong>Tratamento Realizado:</strong></p>  
              <p class="tratamento-detalhe">{{ chamado.tratamento }}</p>  
              <p><strong>Responsável pelo Fechamento:</strong> {{ chamado.nomeResponsavelFechamento }}</p>  
            </div>  
            <div v-else>  
              <p><strong>Data de Abertura:</strong> {{ chamado.dataAbertura }}</p>  
            </div>  
          </li>  
        </ul>  
      </div>  
    </div>  
  </template>  
  
  <script>  
  import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";  
  import { app } from '../firebaseConfig';  
  
  export default {  
    data() {  
      return {  
        filtros: {  
          dataAberturaInicio: '',  
          dataAberturaFim: '',  
          dataFechamentoInicio: '',  
          dataFechamentoFim: '',  
          responsavel: '',  
          aberto: null,  
          departamento: '' // Adicionado campo para filtro por departamento  
        },  
        resultados: []  
      };  
    },  
    methods: {  
      async consultarChamados() {  
        const db = getFirestore(app);  
        const chamadosQuery = collection(db, 'chamados');  
        const conditions = [];  
  
        // Filtros para data de abertura  
        if (this.filtros.dataAberturaInicio && this.filtros.dataAberturaFim) {  
          conditions.push(where('dataAbertura', '>=', this.filtros.dataAberturaInicio));  
          conditions.push(where('dataAbertura', '<=', this.filtros.dataAberturaFim));  
        }  
  
        // Filtros para data de fechamento  
        if (this.filtros.dataFechamentoInicio) {  
          conditions.push(where('dataFechamento', '>=', this.filtros.dataFechamentoInicio));  
        }  
  
        if (this.filtros.dataFechamentoFim) {  
          conditions.push(where('dataFechamento', '<=', this.filtros.dataFechamentoFim));  
        }  
  
        // Filtro por responsável  
        if (this.filtros.responsavel) {  
          conditions.push(where('responsavel', '==', this.filtros.responsavel));  
        }  
  
        // Filtro pelo estado do chamado  
        if (this.filtros.aberto !== null) {  
          conditions.push(where('aberto', '==', this.filtros.aberto));  
        }  
  
        // Filtro por departamento  
        if (this.filtros.departamento) {  
          conditions.push(where('departamento', '==', this.filtros.departamento));  
        }  
  
        const q = query(chamadosQuery, ...conditions);  
        const querySnapshot = await getDocs(q);  
  
        this.resultados = querySnapshot.docs.map(doc => doc.data());  
      }  
    }  
  }  
  </script>  
  
  <style scoped>  
  .consulta-container {  
    max-width: 700px;  
    margin: 0 auto;  
    padding: 2rem;  
    background-color: #f9f9f9;  
    border-radius: 8px;  
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);  
  }  
  
  .consulta-title {  
    margin-bottom: 1.5rem;  
    font-size: 1.8rem;  
    color: #333;  
    text-align: center;  
  }  
  
  .consulta-form {  
    margin-bottom: 2rem;  
  }  
  
  .form-group {  
    margin-bottom: 1rem;  
  }  
  
  label {  
    display: block;  
    margin-bottom: 0.5rem;  
    color: #555;  
  }  
  
  .form-control {  
    width: 100%;  
    padding: 0.5rem;  
    font-size: 1rem;  
    border: 1px solid #ccc;  
    border-radius: 4px;  
    transition: border-color 0.3s;  
  }  
  
  .btn-consultar {  
    width: 100%;  
    padding: 0.75rem;  
    font-size: 1rem;  
    color: #fff;  
    background-color: #007BFF;  
    border: none;  
    border-radius: 4px;  
    cursor: pointer;  
    transition: background-color 0.3s;  
  }  
  
  .btn-consultar:hover {  
    background-color: #0056b3;  
  }  
  
  .resultados-container {  
    margin-top: 2rem;  
    padding: 1rem;  
    background-color: #fff;  
    border-radius: 8px;  
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);  
  }  
  
  ul {  
    padding: 0;  
    list-style-type: none;  
  }  
  
  li {  
    margin-bottom: 0.5rem;  
  }  
  
  p {  
    margin: 0.25rem 0;  
  }  
  
  .tratamento-detalhe {  
    min-height: 5em;  
    max-width: 100%;  
    white-space: pre-wrap;  
    overflow: hidden;  
    word-break: break-word;  
    padding: 0.5rem;  
    border: 1px solid #ddd;  
    border-radius: 4px;  
    background-color: #f4f4f4;  
  }  
  
  .tratamento-detalhe1 {  
    min-height: 1em;  
    max-width: 100%;  
    white-space: pre-wrap;  
    overflow: hidden;  
    word-break: break-word;  
    padding: 0.5rem;  
    border: 1px solid #ddd;  
    border-radius: 4px;  
    background-color: #f4f4f4;  
  }  
  </style>