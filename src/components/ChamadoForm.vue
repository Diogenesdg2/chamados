<template>  
  <form @submit.prevent="submitChamado" class="form-container">  
    <h1 class="form-title">Abrir Novo Chamado</h1>  
    <div class="form-group">  
      <label for="titulo">Título:</label>  
      <input type="text" v-model="chamado.titulo" class="form-control" required />  
    </div>  

    <!-- Campo de responsável foi removido do formulário da interface -->  

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

    <div class="form-group" v-if="codigo">  
      <p><strong>Código do Chamado:</strong> {{ codigo }}</p>  
    </div>  

    <button type="submit" class="btn-submit">Enviar</button>  
  </form>  
</template>  

<script>  
import { getFirestore, doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";  
import { app } from '../firebaseConfig';  

export default {  
  data() {  
    return {  
      chamado: {  
        titulo: '',  
        descricao: '',  
        prioridade: 'média',  
        dataAbertura: this.getCurrentDate(),  
        departamento: '',  
        aberto: true  
      },  
      codigo: null,  
      erro: null  
    };  
  },  
  mounted() {  
    this.setResponsavel();  
  },  
  methods: {  
    setResponsavel() {  
      const loggedInUser = localStorage.getItem('loggedInUser');  
      if (loggedInUser) {  
        this.chamado.responsavel = loggedInUser;  
      } else {  
        alert('Erro: Usuário não autenticado.');  
      }  
    },  
    async submitChamado() {  
      const db = getFirestore(app);  
      const counterRef = doc(db, "counters", "chamadosCounter");  

      try {  
        const counterDoc = await getDoc(counterRef);  
        let currentNumber = 1;  

        if (counterDoc.exists()) {  
          currentNumber = counterDoc.data().currentNumber + 1;  
        }  

        await setDoc(counterRef, { currentNumber }, { merge: true });  

        const novoChamado = {  
          ...this.chamado,  
          codigo: currentNumber,  
          dataAbertura: this.getCurrentDate()  
        };  

        await addDoc(collection(db, "chamados"), novoChamado);  
        this.codigo = novoChamado.codigo;  

        alert(`Chamado criado com sucesso! Código do chamado: ${novoChamado.codigo}`);  
        
        // Registrar log após criação do chamado  
        await this.registrarLog(novoChamado.codigo, "Chamado criado", this.chamado.responsavel);  
        
        this.limparFormulario();  

      } catch (e) {  
        alert("Erro ao enviar chamado: " + e.message);  
      }  
    },  
    async registrarLog(chamadoId, descricao, usuario) {  
      const db = getFirestore(app);  
      const logsCollectionRef = collection(db, "logsChamados");  
      await addDoc(logsCollectionRef, {  
        chamadoId: chamadoId,  
        descricao: descricao,  
        usuario: usuario,  
        timestamp: new Date().toISOString(),  
      });  
    },  
    getCurrentDate() {  
      const today = new Date();  
      return today.toISOString().split('T')[0];  
    },  
    limparFormulario() {  
      this.chamado = {  
        titulo: '',  
        descricao: '',  
        prioridade: 'média',  
        dataAbertura: this.getCurrentDate(),  
        departamento: '',  
        aberto: true  
      };  
      this.codigo = null;  
      this.erro = null;  
      this.setResponsavel();  
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
  background-color: black;  
}  
</style>