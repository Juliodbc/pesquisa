<template>
  <ion-page
    ><ion-header
      ><ion-toolbar
        ><ion-title>Início</ion-title
        ><ion-buttons slot="end"><ion-button @click="logout">Sair</ion-button></ion-buttons></ion-toolbar
      ></ion-header
    ><ion-content class="ion-padding"
      ><main class="welcome">
        <div class="avatar">
          <img v-if="profile?.photoURL" :src="profile.photoURL" alt="Foto de perfil" /><span v-else>{{
            initials
          }}</span>
        </div>
        <p class="eyebrow">SUA ÁREA</p>
        <h1>Olá, {{ profile?.nickname || profile?.fullName || currentUser?.displayName || 'bem-vindo' }}</h1>
        <p class="muted">Acesse e mantenha seus dados pessoais atualizados.</p>
        <ion-button @click="router.push('/perfil')">Visualizar ou editar perfil</ion-button>
        <p v-if="error" class="error">{{ error }}</p>
      </main></ion-content
    ></ion-page
  >
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { signOut } from 'firebase/auth';
import { IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { currentUser } from '../services/session';
import { requireFirebase } from '../services/firebase';
import { getProfile, type UserProfile } from '../services/profile';
const router = useRouter(),
  profile = ref<UserProfile | null>(null),
  error = ref('');
const initials = computed(
  () =>
    profile.value?.fullName?.slice(0, 1).toUpperCase() ||
    currentUser.value?.displayName?.slice(0, 1).toUpperCase() ||
    '',
);
onMounted(async () => {
  if (currentUser.value)
    try {
      profile.value = await getProfile(currentUser.value.uid);
    } catch {
      error.value = 'Não foi possível carregar o perfil.';
    }
});
async function logout() {
  try {
    await signOut(requireFirebase().auth);
    await router.replace('/login');
  } catch {
    error.value = 'Não foi possível encerrar a sessão.';
  }
}
</script>
