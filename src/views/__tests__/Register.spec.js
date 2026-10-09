import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import Swal from 'sweetalert2';
import Register from '../Register.vue';
import { useAuthStore } from '../../stores/auth';

// mock de vue router para controlar la navegacion
const mockPush = vi.fn();
vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: mockPush
    })
}));

// mock de sweetalert2 para que no abra modales reales durante los tests
vi.mock('sweetalert2', () => ({
    default: {
        fire: vi.fn(() => Promise.resolve({ isConfirmed: true }))
    }
}));

describe('Pruebas unitarias completas de Register.vue', () => {

    let wrapper;
    let authStore;

    // montar el componente antes de cada prueba
    beforeEach(() => {
        vi.clearAllMocks(); // limpiar historial de llamados de los mocks

        wrapper = mount(Register, {
            global: {
                plugins: [
                    createTestingPinia({ createSpy: vi.fn })
                ]
            }
        });

        authStore = useAuthStore(); // obtener instancia del store para espiar sus metodos
    });

    // 1. Renderizado basico
    it('debe mostrar el titulo de registro y los campos', () => {
        expect(wrapper.text()).toContain('Registro temporal');

        const inputEmail = wrapper.find('#email');
        const inputPassword = wrapper.find('#password');

        expect(inputEmail.exists()).toBe(true);
        expect(inputPassword.exists()).toBe(true);
    });

    // 2. Estado inicial
    it('debe iniciar con los inputs vacios', () => {
        const inputEmail = wrapper.find('#email');
        const inputPassword = wrapper.find('#password');

        expect(inputEmail.element.value).toBe('');
        expect(inputPassword.element.value).toBe('');
    });

    // 3. Reactividad al escribir
    it('debe actualizar los datos cuando el usuario escribe', async () => {
        const inputEmail = wrapper.find('#email');
        const inputPassword = wrapper.find('#password');

        await inputEmail.setValue('test@correo.com');
        await inputPassword.setValue('123456');

        expect(inputEmail.element.value).toBe('test@correo.com');
        expect(inputPassword.element.value).toBe('123456');
    });

    // 4. Existencia del boton
    it('debe renderizar el boton de registrar', () => {
        const button = wrapper.find('button');
        expect(button.exists()).toBe(true);
        expect(button.text()).toContain('Registrar');
    });

    // 5. Validacion de campos vacios
    it('debe mostrar alerta de error si intenta registrar con campos vacios', async () => {
        const button = wrapper.find('button');
        await button.trigger('click');

        // verificar que Swal muestre mensaje de error
        expect(Swal.fire).toHaveBeenCalledWith('Error', 'Completa los campos', 'error');
        // verificar que NO llame a la funcion de registro
        expect(authStore.register).not.toHaveBeenCalled();
    });

    // 6. Flujo completo de registro exitoso y redireccion
    it('debe llamar a auth.register y redirigir al home al completar el formulario', async () => {
        const inputEmail = wrapper.find('#email');
        const inputPassword = wrapper.find('#password');
        const button = wrapper.find('button');

        // simular que el usuario llena el formulario
        await inputEmail.setValue('usuario@correo.com');
        await inputPassword.setValue('clave123');

        // simular clic en registrar
        await button.trigger('click');

        // 1. verificar que llama a la accion de Pinia con los datos ingresados
        expect(authStore.register).toHaveBeenCalledWith({
            email: 'usuario@correo.com',
            password: 'clave123'
        });

        // 2. verificar que dispara la alerta de exito
        expect(Swal.fire).toHaveBeenCalledWith('OK', 'Usuario temporal creado', 'success');

        // 3. verificar que redirige a la ruta principal '/'
        expect(mockPush).toHaveBeenCalledWith('/');
    });

});