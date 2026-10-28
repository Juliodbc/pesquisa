<template>
  <ion-page
    ><ion-content class="auth-content ion-padding"
      ><main class="auth-card">
        <p class="eyebrow">NOVA CONTA</p>
        <h1>Crie seu acesso</h1>
        <p class="muted">Seus dados ficam associados à sua conta.</p>
        <form @submit.prevent="submit">
          <ion-input
            v-model="name"
            label="Nome completo"
            label-placement="stacked"
            autocomplete="name"
            required
            :minlength="2"
          /><ion-input
            v-model="email"
            label="E-mail"
            label-placement="stacked"
            type="email"
            autocomplete="email"
            required
          /><ion-input
            v-model="password"
            label="Senha (mínimo 6 caracteres)"
            label-placement="stacked"
            type="password"
            required
            :minlength="6"
          /><ion-input
            v-model="confirm"
            label="Confirme a senha"
            label-placement="stacked"
            type="password"
            required
            :minlength="6"
          />
          <p v-if="error" class="error">{{ error }}</p>
          <ion-button expand="block" type="submit" :disabled="busy || !firebaseConfigured">{{
            busy ? 'Criando…' : 'Criar conta'
          }}</ion-button>
        </form>
        <p class="center">Já tem conta? <RouterLink to="/login">Entrar</RouterLink></p>
      </main></ion-content
    ></ion-page
  >
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { IonButton, IonContent, IonInput, IonPage } from '@ionic/vue';
import { firebaseConfigured } from '../services/firebase';
import { createAccount } from '../services/session';
const name = ref(''),
  email = ref(''),
  password = ref(''),
  confirm = ref(''),
  error = ref(''),
  busy = ref(false);
const router = useRouter();
async function submit() {
  error.value = '';
  if (password.value !== confirm.value) {
    error.value = 'As senhas não coincidem.';
    return;
  }
  busy.value = true;
  try {
    await createAccount(name.value.trim(), email.value.trim(), password.value);
    await router.replace('/inicio');
  } catch (e) {
    error.value =
      e instanceof Error && e.message.includes('Configure')
        ? e.message
        : 'Não foi possível criar a conta. Verifique os dados e tente outro e-mail.';
  } finally {
    busy.value = false;
  }
}
</script>
