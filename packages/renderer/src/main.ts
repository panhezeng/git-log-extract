import {router} from './router';
import {pinia} from './stores';
import {Dialog, Notify, Quasar} from 'quasar';
import quasarLang from 'quasar/lang/zh-CN';
import {createApp} from 'vue';
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css';

// Import Quasar css
import 'quasar/dist/quasar.css';

// Assumes your root component is App.vue
// and placed in same folder as main.js

import App from './App.vue';

const app = createApp(App);

app.use(router);
app.use(pinia);

app.use(Quasar, {
  plugins: {Notify, Dialog}, // import Quasar plugins and add here
  lang: quasarLang,
});

// Assumes you have a <div id="app"></div> in your index.html
app.mount('#app');
