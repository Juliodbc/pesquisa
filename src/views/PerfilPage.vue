<template>
  <ion-page
    ><ion-header
      ><ion-toolbar
        ><ion-buttons slot="start"><ion-back-button default-href="/inicio" /></ion-buttons
        ><ion-title>Meu perfil</ion-title></ion-toolbar
      ></ion-header
    ><ion-content class="ion-padding"
      ><main class="profile-card">
        <div class="avatar profile-avatar">
          <img v-if="preview || form.photoURL" :src="preview || form.photoURL" alt="Pré-visualização da foto" /><span
            v-else
            >JC</span
          >
        </div>
        <ion-button fill="outline" @click="choosePhoto">Selecionar foto da galeria</ion-button>
        <p class="muted">Imagem JPG, PNG ou equivalente, até 5 MB.</p>
        <form @submit.prevent="save">
          <ion-input
            v-model="form.fullName"
            label="Nome completo"
            label-placement="stacked"
            autocomplete="name"
            required
            :minlength="2"
          /><ion-input
            v-model="form.nickname"
            label="Nickname"
            label-placement="stacked"
            autocomplete="nickname"
            :maxlength="30"
          /><ion-input
            v-model="form.birthDate"
            label="Data de nascimento"
            label-placement="stacked"
            type="date"
            :max="today"
          />
          <p v-if="error" class="error">{{ error }}</p>
          <p v-if="message" class="success">{{ message }}</p>
          <ion-button expand="block" type="submit" :disabled="busy">{{
            busy ? 'Salvando…' : 'Salvar alterações'
          }}</ion-button>
        </form>
      </main></ion-content
    ></ion-page
  >
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { currentUser } from '../services/session';
import { getProfile, saveProfile, emptyProfile, type UserProfile } from '../services/profile';
const form = reactive<UserProfile>(emptyProfile()),
  preview = ref(''),
  error = ref(''),
  message = ref(''),
  busy = ref(false),
  photo = ref<Blob>();
const today = new Date().toISOString().slice(0, 10);
onMounted(async () => {
  if (currentUser.value)
    try {
      Object.assign(form, await getProfile(currentUser.value.uid));
    } catch {
      error.value = 'Não foi possível carregar seus dados.';
    }
});
async function choosePhoto() {
  error.value = '';
  try {
    const result = await Camera.getPhoto({
      quality: 85,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    });
    if (!result.webPath) return;
    const blob = await (await fetch(result.webPath)).blob();
    if (blob.size > 5 * 1024 * 1024) {
      error.value = 'Escolha uma imagem com até 5 MB.';
      return;
    }
    photo.value = blob;
    preview.value = result.webPath;
  } catch (e) {
    if (e instanceof Error && e.message.toLowerCase().includes('cancel')) return;
    error.value = 'Não foi possível selecionar a foto. Verifique a permissão da galeria.';
  }
}
async function save() {
  error.value = '';
  message.value = '';
  if (!currentUser.value) return;
  if (form.birthDate && form.birthDate > today) {
    error.value = 'A data de nascimento não pode estar no futuro.';
    return;
  }
  busy.value = true;
  try {
    const saved = await saveProfile(
      currentUser.value.uid,
      { ...form, fullName: form.fullName.trim(), nickname: form.nickname.trim() },
      photo.value,
    );
    Object.assign(form, saved);
    photo.value = undefined;
    preview.value = '';
    message.value = 'Perfil salvo com sucesso.';
  } catch (e) {
    error.value =
      e instanceof Error && (e.message.includes('Configure') || e.message.includes('grande demais'))
        ? e.message
        : 'Não foi possível salvar o perfil. Tente novamente.';
  } finally {
    busy.value = false;
  }
}
</script>
