<template>  
    <form @submit.prevent="submitChamado" class="form-container">  
      <h1 class="form-title">Abrir Novo Chamado</h1>  
      <div class="form-group">  
        <label for="titulo">Título:</label>  
        <input type="text" v-model="chamado.titulo" class="form-control" required />  
      </div>  
      
      <div class="form-group">  
        <label for="responsavel">Responsável:</label>  
        <textarea v-model="chamado.responsavel" class="form-control" required></textarea>  
      </div>  
      
      <div class="form-group">  
        <label for="descricao">Descrição:</label>  
        <textarea v-model="chamado.descricao" class="form-control" required></textarea>  
      </div>  
  
      <div class="form-group">  
        <label for="prioridade">Prioridade:</label>  
        <select v-model="chamado.prioridade" class="form-control" required>  
          <option value="alta">Alta</option>  
          <option value="média">Média</option>  
          <option value="baixa">Baixa</option>  
        </select>  
      </div>  
  
      <div class="form-group">  
        <label for="dataAbertura">Data de Abertura:</label>  
        <input type="date" v-model="chamado.dataAbertura" class="form-control form-control-date" required />  
      </div>  
  
      <div class="form-group">  
        <label for="departamento">Departamento:</label>  
        <select v-model="chamado.departamento" class="form-control" required>  
          <option value="departamento-contabil">Departamento Contábil</option>  
          <option value="departamento-extra-contabil">Departamento Extra Contábil</option>  
          <option value="departamento-fiscal">Departamento Fiscal</option>  
          <option value="departamento-pessoal">Departamento Pessoal</option>  
          <option value="diretoria">Diretoria</option>  
          <option value="financeiro">Financeiro</option>  
        </select>  
      </div>  
  
      <button type="submit" class="btn-submit">Enviar</button>  
    </form>  
  </template>  
  
  <script>  
  import { getFirestore, collection, addDoc } from "firebase/firestore";  
  import { app } from '../firebaseConfig';  
  
  export default {  
    data() {  
      return {  
        chamado: {  
          titulo: '',  
          responsavel: '',  
          descricao: '',  
          prioridade: 'média',  
          dataAbertura: this.getCurrentDate(),  
          departamento: '',  
          aberto: true // Incluímos o campo "aberto" com valor true  
        }  
      };  
    },  
    methods: {  
      async submitChamado() {  
        const db = getFirestore(app);  
        try {  
          await addDoc(collection(db, "chamados"), this.chamado);  
          alert("Chamado enviado com sucesso!");  
          
          // Reinicie o formulário mantendo os valores padrão  
          this.chamado = {   
            titulo: '',   
            responsavel: '',   
            descricao: '',   
            prioridade: 'média',   
            dataAbertura: this.getCurrentDate(),   
            departamento: '',  
            aberto: true   
          };  
        } catch (e) {  
          alert("Erro ao enviar chamado: " + e.message);  
        }  
      },  
      getCurrentDate() {  
        const today = new Date();  
        return today.toISOString().split('T')[0];  
      }  
    }  
  }  
  </script>  
  
  <style scoped>  
  .form-container {  
    max-width: 600px;  
    margin: 0 auto;  
    padding: 2rem;  
    background-color: #f9f9f9;  
    border-radius: 8px;  
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);  
  }  
  
  .form-title {  
    margin-bottom: 1.5rem;  
    font-size: 1.5rem;  
    color: #333;  
    text-align: center;  
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
  
  .form-control:focus {  
    border-color: #007BFF;  
    outline: none;  
  }  
  
  .form-control-date {  
    width: 50%;  
    max-width: 200px;  
  }  
  
  .btn-submit {  
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
  
  .btn-submit:hover {  
    background-color: #0056b3;  
  }  
  </style>