import { createApp } from 'vue'
import LayoutPage from './pages/LayoutPage';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret, faTrash, faSave, faChevronUp, faChevronDown, faPlus, faBookOpen, faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add([faUserSecret, faTrash, faSave, faChevronUp, faChevronDown, faPlus, faBookOpen, faPencil])

import router from './router'

createApp(LayoutPage).use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
