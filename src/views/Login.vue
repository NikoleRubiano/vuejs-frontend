<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import swal from 'sweetalert2';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const name = ref('');
const router = useRouter();
const auth = useAuthStore();

const submit = () => {
    if (!email.value || !password.value) {
        swal.fire({
            title: 'Error',
            text: 'completa los campos',
            icon: 'warning'
        });
        return;
    }
    
    auth.register({ name: name.value, email: email.value, password: password.value });
    swal.fire({
        title: 'Éxito',
        text: 'Usuario registrado correctamente',
        icon: 'success'
    });
    router.push('/usuarios');
};
</script>

<template>
    <div class="max-w-xl mx-auto mt-12 px-4">
        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 class="mb-4 text-2xl font-semibold text-gray-800">Crear cuenta <i class="fa fa-user-plus ml-1"></i></h2>
            
            <form @submit.prevent="submit">
                <div class="mb-4">
                    <label class="mb-2 block text-sm font-medium text-gray-700" for="name">Nombre</label>
                    <input 
                        v-model="name" 
                        type="text"
                        class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                        placeholder="Tu nombre"
                    />
                </div>
                <div class="mb-4">
                    <label class="mb-2 block text-sm font-medium text-gray-700" for="email">Email</label>
                    <input 
                        v-model="email" 
                        type="email"
                        class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                        placeholder="email@example.com"
                    />
                </div>
                <div class="mb-5">
                    <label class="mb-2 block text-sm font-medium text-gray-700" for="password">Contraseña</label>
                    <input 
                        v-model="password" 
                        type="password" 
                        class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                </div>
                <div class="d-flex gap-2">
                    <button type="submit" class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer">
                        <i class="fa fa-user-check mr-2"></i>Registrar
                    </button>
                    <RouterLink to="/" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ml-3">
                        Volver al Login
                    </RouterLink>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
</style>