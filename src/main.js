import { createApp } from 'vue'

import App from './App.vue'
import BaseCard from './components/UI/BaseCard.vue'
import BaseButton from './components/UI/BaseButton.vue'
import BaseDialog from './components/UI/BaseDialog.vue'
import BaseDialogNoButton from './components/UI/BaseDialogNoButton.vue'
import JsonCSV from 'vue-json-csv'


const app = createApp(App)

app.component('base-card', BaseCard)
app.component('base-button', BaseButton)
app.component('base-dialog', BaseDialog)


app.component('downloadCsv', JsonCSV)

app.mount('#app')
