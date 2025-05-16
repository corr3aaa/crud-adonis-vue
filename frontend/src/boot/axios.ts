import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3333' // URL do backend AdonisJS
})

export default boot(({ app }) => {
    app.config.globalProperties.$axios = axios
    app.config.globalProperties.$api = api
})

export { axios, api }
