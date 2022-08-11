import { createRouter, createWebHashHistory } from 'vue-router'
import MainPage from "@/pages/MainPage";
// import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import VocabularyList from "@/pages/VocabularyList";
const routes = [
    {
        path: '/',
        component: MainPage,
        // children: [
        //     { path: '', component: MainPage },
        //     { path: 'login', component: LoginPage}
        // ],
    },
    // {path: '/register',  component: RegisterPage},
    {path: '/login',  component: LoginPage},
    {path: '/register', component: RegisterPage},
    {path: '/vocabulary-list', component: VocabularyList}
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})
