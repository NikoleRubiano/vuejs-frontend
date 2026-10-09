import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import Swal from 'sweetalert2';
import Register from '../Register.vue';
import { useAuthStore } from '../../stores/auth';

// Mock de Vue Router
const mockPush = vi.fn();
vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: mockPush
    })
}));

// Mock de SweetAlert2
vi.mock('sweetalert2', () => ({
    default: {
        fire: vi.fn(() => Promise.resolve({ isConfirmed: true }))
    }
}));

describe('Pruebas unitarias completas de Register.vue', () => {

    let wrapper;
    let authStore;

    beforeEach(() => {
        vi.clearAllMocks();

        wrapper = mount(Register, {
            global: {
                plugins: [
                    createTestingPinia({ createSpy: vi.fn })
                ]
            }
        });

        authStore = useAuthStore();
    });

    // --- GRUPO 1: RENDERIZADO Y ESTRUCTURA DE LA INTERFAZ ---
    describe('Renderizado e Interfaz de Usuario', () => {
        it('debe mostrar el título principal y los campos necesarios', () => {
            expect(wrapper.text()).toContain('Registro temporal');
            expect(wrapper.find('#email').exists()).toBe(true);
            expect(wrapper.find('#password').exists()).toBe(true);
            expect(wrapper.find('button').exists()).toBe(true);
        });

        it('debe iniciar con los campos de entrada completamente vacíos', () => {
            const inputEmail = wrapper.find('#email');
            const inputPassword = wrapper.find('#password');

            expect(inputEmail.element.value).toBe('');
            expect(inputPassword.element.value).toBe('');
        });

        it('debe configurar los tipos de atributo email y password correctamente', () => {
            const inputEmail = wrapper.find('#email');
            const inputPassword = wrapper.find('#password');

            expect(inputEmail.attributes('type')).toBe('email');
            expect(inputPassword.attributes('type')).toBe('password');
        });
    });

    // --- GRUPO 2: ENTRADA DE DATOS Y CARACTERES ESPECIALES ---
    describe('Reactividad y Captura de Caracteres', () => {
        it('debe actualizar los valores v-model cuando el usuario escribe correo y clave', async () => {
            const inputEmail = wrapper.find('#email');
            const inputPassword = wrapper.find('#password');

            await inputEmail.setValue('test@correo.com');
            await inputPassword.setValue('123456');

            expect(inputEmail.element.value).toBe('test@correo.com');
            expect(inputPassword.element.value).toBe('123456');
        });

        it('debe aceptar caracteres especiales, números y símbolos en las entradas', async () => {
            const inputEmail = wrapper.find('#email');
            const inputPassword = wrapper.find('#password');

            const correoEspecial = 'usuario_test+123@sub.dominio.org';
            const claveEspecial = 'Pass#2026!@$';

            await inputEmail.setValue(correoEspecial);
            await inputPassword.setValue(claveEspecial);

            expect(inputEmail.element.value).toBe(correoEspecial);
            expect(inputPassword.element.value).toBe(claveEspecial);
        });
    });

    // --- GRUPO 3: VALIDACIONES DE CLIENTE Y CAMPOS VACÍOS ---
    describe('Validaciones de Formulario', () => {
        it('debe bloquear el envio y mostrar error en Swal al hacer clic con campos vacios', async () => {
            const button = wrapper.find('button');
            await button.trigger('click');

            expect(Swal.fire).toHaveBeenCalledWith('Error', 'Completa los campos', 'error');
            expect(authStore.register).not.toHaveBeenCalled();
        });

        it('debe mostrar error de validacion si solo el email esta presente', async () => {
            const inputEmail = wrapper.find('#email');
            const button = wrapper.find('button');

            await inputEmail.setValue('solo.email@correo.com');
            await button.trigger('click');

            expect(Swal.fire).toHaveBeenCalledWith('Error', 'Completa los campos', 'error');
            expect(authStore.register).not.toHaveBeenCalled();
        });
    });

    // --- GRUPO 4: FLUJO DE REGISTRO EXITOSO ---
    describe('Integracion con Pinia Store y Navegacion', () => {
        it('debe ejecutar auth.register, mostrar Swal de éxito y redirigir al inicio', async () => {
            const inputEmail = wrapper.find('#email');
            const inputPassword = wrapper.find('#password');
            const button = wrapper.find('button');

            await inputEmail.setValue('ejemplo@correo.com');
            await inputPassword.setValue('123456');

            await button.trigger('click');

            // 1. Invoca el método en Pinia con las credenciales ingresadas
            expect(authStore.register).toHaveBeenCalledWith({
                email: 'ejemplo@correo.com',
                password: '123456'
            });

            // 2. Muestra notificación SweetAlert2 de éxito
            expect(Swal.fire).toHaveBeenCalledWith('OK', 'Usuario temporal creado', 'success');

            // 3. Ejecuta la redirección mediante Vue Router
            expect(mockPush).toHaveBeenCalledWith('/');
        });
    });

});