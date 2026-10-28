import { IonicVue } from '@ionic/vue';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* Theme variables */
import './theme/variables.css';
import { initializeSession } from './services/session';

// Inicia a restauração da sessão sempre que o app tem Firebase configurado.
initializeSessionIfConfigured();

function initializeSessionIfConfigured() {
  try {
    initializeSession();
  } catch {
    /* Firebase ainda não foi configurado no ambiente. */
  }
}

const app = createApp(App).use(IonicVue).use(router);

router.isReady().then(() => {
  app.mount('#app');
});
