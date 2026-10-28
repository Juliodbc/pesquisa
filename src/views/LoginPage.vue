<template>
  <ion-page
    ><ion-content class="auth-content ion-padding"
      ><main class="auth-card">
        <p class="eyebrow">PORTAL PESSOAL</p>
        <h1>Bem-vindo de volta</h1>
        <p class="muted">Entre para acessar seu perfil.</p>
        <ion-note v-if="!firebaseConfigured" color="warning"
          >Configure as credenciais do Firebase no arquivo .env para habilitar o acesso.</ion-note
        >
        <form @submit.prevent="submit">
          <ion-input
            v-model="email"
            label="E-mail"
            label-placement="stacked"
            type="email"
            autocomplete="email"
            required
          /><ion-input
            v-model="password"
            label="Senha"
            label-placement="stacked"
            type="password"
            autocomplete="current-password"
            required
          />
          <p v-if="error" class="error">{{ error }}</p>
          <ion-button expand="block" type="submit" :disabled="busy || !firebaseConfigured">{{
            busy ? 'Entrando…' : 'Entrar'
          }}</ion-button>
        </form>
        <nav>
          <RouterLink to="/recuperar-senha">Esqueci minha senha</RouterLink
          ><span>Não tem uma conta? <RouterLink to="/cadastro">Criar conta</RouterLink></span>
        </nav>
      </main></ion-content
    ></ion-page
  >
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { IonButton, IonContent, IonInput, IonNote, IonPage } from '@ionic/vue';
import { requireFirebase, firebaseConfigured } from '../services/firebase';
const email = ref(''),
  password = ref(''),
  error = ref(''),
  busy = ref(false);
const router = useRouter();
async function submit() {
  error.value = '';
  busy.value = true;
  try {
    const { auth } = requireFirebase();
    await signInWithEmailAndPassword(auth, email.value.trim(), password.value);
    await router.replace('/inicio');
  } catch {
    error.value = 'Não foi possível entrar. Confira o e-mail e a senha.';
  } finally {
    busy.value = false;
  }
}
</script>
