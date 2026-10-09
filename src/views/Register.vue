<script setup>
import { ref } from 'vue';
import { useRouter} from 'vue-router';
import Swal from 'sweetalert2';

// Importación del store de autenticación de Pinia
import { useAuthStore } from '../stores/auth';
// Instancia del store para acceder a sus acciones
const auth = useAuthStore();

const email = ref('');
const password = ref('');
const router = useRouter();
const submit = () => {
    if(!email.value || !password.value)
        return Swal.fire('Error', 'Completa los campos', 'error');

// Llama a la acción de Pinia para guardar el usuario y crear la sesión
    auth.register({
        email: email.value,
        password: password.value
    });

    Swal.fire('OK', 'Usuario temporal creado', 'success').then(() => {
        router.push('/');  // Redirige al usuario tras el registro exitoso
    });
};

</script>

<template>
   <div class="max-w-xl mx-auto mt-12 px-4">
    <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-2xl font-semibold text-gray-800">Registro temporal</h2>

        <div class="mb-4">
            <label
                for="email"
                class="mb-2 block text-sm font-medium text-gray-700">Email</label>
                <input id="email"
                  v-model="email" type="email"
                  placeholder="email@example.com" class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-200"/>
        </div>
        <div class="mb-5">
            <label
                for="password"
                class="mb-2 block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                    id="password"
                    v-model="password"
                    type="password"
                    class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2
                    text-gray-900 shadow-sm outline-none transition focus:border-green-500
                    focus:ring-2 focus:ring-green-200"
                />
                
        </div>

        <button
            type="button"
            class="inline-flex items-center rounded-md bg-green-600 px-4py-2 font-medium
            text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2"
            @click="submit">
            <i class="fa fa-check mr-2"></i>
            Registrar
        </button>
    </div>
   </div>

</template>

<style scoped>

</style>