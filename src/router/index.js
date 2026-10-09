import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Userslist from '../views/users/ListUsers.vue';
import UserEdit from "../views/users/EditUser.vue";
import UserCreate from "../views/users/CreateUser.vue";
import { useAuthStore } from "../stores/auth";
const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
    },
    {
        path: '/usuarios',
        name: 'usuarios',
        component: Userslist,
    },
    {
        path:'/usuarios/:id/editar',
        name: 'userEdit',
        component: UserEdit,
        meta: { requieresAuth: true}
    },
    {
        path:'/usuarios/crear',
        name:'crear',
        component: UserCreate,
        meta: { requieresAuth: true}
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to) =>{
    const auth = useAuthStore()
    if(to.meta.requieresAuth && !auth.isLogged) return '/';
})

export default router;