import { createApp } from 'vue'
import LayoutPage from './pages/LayoutPage';

import router from './router'

createApp(LayoutPage).use(router).mount('#app')
