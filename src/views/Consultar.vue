<template>  
  <div class="consulta-container">  
    <h1 class="consulta-title">Consultar Chamados</h1>  

    <!-- Formulário de Filtro -->  
    <form @submit.prevent="consultarChamados" class="consulta-form">  
      <!-- Campos do formulário -->  
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
          <option value="">Todos</option>  
          <option value="departamento-contabil">Departamento Contábil</option>  
          <option value="departamento-extra-contabil">Departamento Extra Contábil</option>  
          <option value="departamento-fiscal">Departamento Fiscal</option>  
          <option value="departamento-pessoal">Departamento Pessoal</option>  
          <option value="diretoria">Diretoria</option>  
          <option value="financeiro">Financeiro</option>  
        </select>  
      </div>  

      <div class="button-group">  
        <button type="submit" class="btn-consultar">Consultar</button>  
        <button type="button" @click="limparFiltros" class="btn-limpar">Limpar</button>  
      </div>  
    </form>  

    <!-- Exibição dos Resultados -->  
    <div v-if="resultados.length > 0" class="resultados-container">  
      <h2>Resultados da Consulta:</h2>  
      <ul>  
        <li v-for="(chamado, index) in resultados" :key="index">  
          <p><strong>Código:</strong> {{ chamado.codigo }}</p>  
          <p><strong>Título:</strong> {{ chamado.titulo }}</p>  
          <p><strong>Responsável:</strong> {{ chamado.responsavel }}</p>  
          <p><strong>Departamento:</strong> {{ chamado.departamento }}</p>  
          <div v-if="!chamado.aberto">  
            <p><strong>Fechado em:</strong> {{ chamado.dataFechamento }}</p>  
            <p class="tratamento-detalhe1"><strong>Tratamento Realizado:</strong></p>  
            <p class="tratamento-detalhe">{{ chamado.tratamento }}</p>  
            <p><strong>Resp. Fechamento:</strong> {{ chamado.nomeResponsavelFechamento }}</p>  
          </div>  
          <div v-else>  
            <p><strong>Data de Abertura:</strong> {{ chamado.dataAbertura }}</p>  
          </div>  
          <hr>  
        </li>  
      </ul>  
    </div>  
  </div>  
</template>  

<script>  
import { getFirestore, collection, query, where, getDocs, addDoc } from "firebase/firestore";  
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
        departamento: ''  
      },  
      resultados: []  
    };  
  },  
  methods: {  
    async consultarChamados() {  
      const db = getFirestore(app);  
      const chamadosRef = collection(db, 'chamados');  
      const conditions = [];  

      const loggedInUser = localStorage.getItem('loggedInUser') || '';  

      // Lista de usuários com acesso total  
      const usuariosComAcessoTotal = ['Diogenes', 'Ricardo', 'Milena', 'Corinta'];  

      // Verificar se o usuário tem acesso total      
      if (!usuariosComAcessoTotal.includes(loggedInUser)) {  
        conditions.push(where('responsavel', '==', loggedInUser)); // Restringe aos chamados do próprio usuário  
      }  

      // Aplicar condições de filtro  
      if (this.filtros.dataAberturaInicio) {  
        conditions.push(where('dataAbertura', '>=', this.filtros.dataAberturaInicio));  
      }  

      if (this.filtros.dataAberturaFim) {  
        conditions.push(where('dataAbertura', '<=', this.filtros.dataAberturaFim));  
      }  

      if (this.filtros.dataFechamentoInicio) {  
        conditions.push(where('dataFechamento', '>=', this.filtros.dataFechamentoInicio));  
      }  

      if (this.filtros.dataFechamentoFim) {  
        conditions.push(where('dataFechamento', '<=', this.filtros.dataFechamentoFim));  
      }  

      if (this.filtros.responsavel) {  
        conditions.push(where('responsavel', '==', this.filtros.responsavel));  
      }  

      if (this.filtros.aberto !== null) {  
        conditions.push(where('aberto', '==', this.filtros.aberto));  
      }  

      if (this.filtros.departamento) {  
        conditions.push(where('departamento', '==', this.filtros.departamento));  
      }  

      // Executar a consulta com as condições estabelecidas  
      const q = query(chamadosRef, ...conditions);  
      const querySnapshot = await getDocs(q);  
      this.resultados = querySnapshot.docs.map(doc => doc.data());  

      // Registrar log da consulta  
      await this.registrarLogConsulta(loggedInUser, this.filtros);  
    },  
    async registrarLogConsulta(usuario, filtros) {  
      const db = getFirestore(app);  
      const logsCollectionRef = collection(db, "logsConsultas");  
      const logData = {  
        usuario: usuario,  
        filtrosAplicados: { ...filtros },  
        timestamp: new Date().toISOString()  
      };  
      
      await addDoc(logsCollectionRef, logData);  
    },  
    limparFiltros() {  
      this.filtros = {  
        dataAberturaInicio: '',  
        dataAberturaFim: '',  
        dataFechamentoInicio: '',  
        dataFechamentoFim: '',  
        responsavel: '',  
        aberto: null,  
        departamento: ''  
      };  
      this.resultados = [];  
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

.button-group {  
  display: flex;  
  justify-content: space-between;  
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

.btn-consultar, .btn-limpar {  
  width: 48%;  
  padding: 0.75rem;  
  font-size: 1rem;  
  color: #fff;  
  border: none;  
  border-radius: 4px;  
  cursor: pointer;  
  transition: background-color 0.3s;  
}  

.btn-consultar {  
  background-color: #007BFF;  
}  

.btn-consultar:hover {  
  background-color: black;  
}  

.btn-limpar {  
  background-color: #007BFF;  
}  

.btn-limpar:hover {  
  background-color: black;  
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