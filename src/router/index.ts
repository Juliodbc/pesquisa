import { createRouter, createWebHistory } from '@ionic/vue-router';
import { watch } from 'vue';
import type { RouteRecordRaw } from 'vue-router';

import { firebaseConfigured } from '../services/firebase';
import { currentUser, initializeSession, sessionReady } from '../services/session';
import LoginPage from '../views/LoginPage.vue';
import CadastroPage from '../views/CadastroPage.vue';
import RecuperarSenhaPage from '../views/RecuperarSenhaPage.vue';
import BoasVindasPage from '../views/BoasVindasPage.vue';
import PerfilPage from '../views/PerfilPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { guest: true },
  },
  { path: '/cadastro', name: 'Cadastro', component: CadastroPage, meta: { guest: true } },
  { path: '/recuperar-senha', name: 'RecuperarSenha', component: RecuperarSenhaPage, meta: { guest: true } },
  { path: '/inicio', name: 'Inicio', component: BoasVindasPage, meta: { auth: true } },
  { path: '/perfil', name: 'Perfil', component: PerfilPage, meta: { auth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  if (!firebaseConfigured) return to.meta.auth ? '/login' : true;
  initializeSession();
  if (!sessionReady.value)
    await new Promise<void>((resolve) => {
      const stop = watch(
        sessionReady,
        (ready) => {
          if (ready) {
            stop();
            resolve();
          }
        },
        { immediate: true },
      );
    });
  if (to.meta.auth && !currentUser.value) return '/login';
  if (to.meta.guest && currentUser.value) return '/inicio';
  return true;
});

export default router;
