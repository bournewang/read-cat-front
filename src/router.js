import { createRouter, createWebHashHistory } from 'vue-router'
import MainPage from "@/pages/MainPage";
import NewArticle from "@/pages/NewArticle";
import LibraryPage from "@/pages/LibraryPage";
// import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import VocabularyList from "@/pages/VocabularyList";
const routes = [
    {
        path: '/review', component: MainPage,
        // children: [
        //     { path: '', component: MainPage },
        //     { path: 'login', component: LoginPage}
        // ],
    },
    {path: '/login',  component: LoginPage},
    {path: '/register', component: RegisterPage},
    {path: '/library', component: LibraryPage},
    {path: '/new-article', component: NewArticle},
    {path: '/vocabulary-list', component: VocabularyList}
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})
