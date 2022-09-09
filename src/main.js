import { createApp } from 'vue'
import LayoutPage from './pages/LayoutPage';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret, faTrash, faChevronUp, faChevronDown, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add([faUserSecret, faTrash, faChevronUp, faChevronDown, faPlus])

import router from './router'

createApp(LayoutPage).use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
