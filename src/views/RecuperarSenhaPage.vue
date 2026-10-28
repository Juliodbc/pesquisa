<template>
  <ion-page
    ><ion-content class="auth-content ion-padding"
      ><main class="auth-card">
        <p class="eyebrow">RECUPERAÇÃO DE ACESSO</p>
        <h1>Redefina sua senha</h1>
        <p class="muted">Enviaremos um link oficial de redefinição para seu e-mail.</p>
        <form @submit.prevent="submit">
          <ion-input
            v-model="email"
            label="E-mail"
            label-placement="stacked"
            type="email"
            autocomplete="email"
            required
          />
          <p v-if="message" class="success">{{ message }}</p>
          <p v-if="error" class="error">{{ error }}</p>
          <ion-button expand="block" type="submit" :disabled="busy || !firebaseConfigured">{{
            busy ? 'Enviando…' : 'Enviar link'
          }}</ion-button>
        </form>
        <p class="center"><RouterLink to="/login">Voltar ao login</RouterLink></p>
      </main></ion-content
    ></ion-page
  >
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { IonButton, IonContent, IonInput, IonPage } from '@ionic/vue';
import { firebaseConfigured, requireFirebase } from '../services/firebase';
const email = ref(''),
  error = ref(''),
  message = ref(''),
  busy = ref(false);
async function submit() {
  error.value = '';
  message.value = '';
  busy.value = true;
  try {
    const { auth } = requireFirebase();
    await sendPasswordResetEmail(auth, email.value.trim());
    message.value = 'Se houver uma conta para este e-mail, você receberá o link de recuperação.';
  } catch {
    error.value = 'Não foi possível solicitar a recuperação. Confira o e-mail e tente novamente.';
  } finally {
    busy.value = false;
  }
}
</script>
