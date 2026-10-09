import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import Register from '../Register.vue'
import Swal from 'sweetalert2'

// Interceptamos SweetAlert2 para evitar que lance ventanas emergentes reales en el DOM
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn().mockImplementation(() => Promise.resolve({ isConfirmed: true }))
  }
}))

// Mock del cliente de rutas de Vue Router
const pushMock = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock
  })
}))

describe('Register.vue Component Tests', () => {
  let globalOptions;

  // Limpieza e inicialización previa a cada prueba
  beforeEach(() => {
    vi.clearAllMocks() // Limpia el historial de ejecuciones de Swal y Router
    localStorage.clear() // Vacía la memoria de almacenamiento local

    globalOptions = {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })]
      }
    }
  })

  // 1. Verificación de estructura básica del DOM
  it('debe renderizar correctamente los elementos del formulario en la interfaz', () => {
    const wrapper = mount(Register, globalOptions)

    // Comprobamos que el título y las etiquetas existen
    expect(wrapper.find('h2').text()).toBe('Registro temporal')
    expect(wrapper.find('label[for="email"]').text()).toBe('Email')
    expect(wrapper.find('label[for="password"]').text()).toBe('Contraseña')

    // Comprobamos la existencia de los inputs y el botón
    expect(wrapper.find('input#email').exists()).toBe(true)
    expect(wrapper.find('input#password').exists()).toBe(true)
    expect(wrapper.find('button').text()).toContain('Registrar')
  })

  // 2. Validación cuando ambos campos están vacíos
  it('debe mostrar una alerta de error y detener el proceso si ambos campos están vacíos', async () => {
    const wrapper = mount(Register, globalOptions)

    // Hacemos clic en el botón de registrar sin haber ingresado valores
    await wrapper.find('button').trigger('click')

    // Debe activar la alerta de error de SweetAlert2
    expect(Swal.fire).toHaveBeenCalledWith('Error', 'Completa los campos', 'error')

    // NO debe escribir nada en el localStorage
    expect(localStorage.getItem('tempUser')).toBeNull()

    // NO debe redirigir al usuario
    expect(pushMock).not.toHaveBeenCalled()
  })

  // 3. Validación cuando solo falta la contraseña
  it('debe mostrar una alerta de error si falta la contraseña', async () => {
    const wrapper = mount(Register, globalOptions)

    // Llenamos únicamente el correo electrónico pero dejamos la contraseña vacía
    await wrapper.find('input#email').setValue('usuario@ejemplo.com')
    await wrapper.find('button').trigger('click')

    // Verificamos que se bloquee el registro
    expect(Swal.fire).toHaveBeenCalledWith('Error', 'Completa los campos', 'error')
    expect(localStorage.getItem('tempUser')).toBeNull()
    expect(pushMock).not.toHaveBeenCalled()
  })

  // 4. Validación cuando solo falta el correo
  it('debe mostrar una alerta de error si falta el correo', async () => {
    const wrapper = mount(Register, globalOptions)

    // Llenamos únicamente la contraseña
    await wrapper.find('input#password').setValue('123456')
    await wrapper.find('button').trigger('click')

    // Verificamos que se bloquee el registro
    expect(Swal.fire).toHaveBeenCalledWith('Error', 'Completa los campos', 'error')
    expect(localStorage.getItem('tempUser')).toBeNull()
    expect(pushMock).not.toHaveBeenCalled()
  })

  // 5. Validación con espacios en blanco
  it('debe mostrar error si se ingresan solo espacios en blanco', async () => {
    const wrapper = mount(Register, globalOptions)

    await wrapper.find('input#email').setValue('   ')
    await wrapper.find('input#password').setValue('   ')
    await wrapper.find('button').trigger('click')

    expect(Swal.fire).toHaveBeenCalledWith('Error', 'Completa los campos', 'error')
    expect(localStorage.getItem('tempUser')).toBeNull()
    expect(pushMock).not.toHaveBeenCalled()
  })

  // 6. Prueba con caracteres especiales
  it('debe aceptar caracteres especiales y eñes en el correo y contraseña', async () => {
    const wrapper = mount(Register, globalOptions)

    const emailEspecial = 'niño_123.test+qa@dominio.org'
    const passEspecial = 'Clave!@#$%^&*'

    await wrapper.find('input#email').setValue(emailEspecial)
    await wrapper.find('input#password').setValue(passEspecial)

    expect(wrapper.find('input#email').element.value).toBe(emailEspecial)
    expect(wrapper.find('input#password').element.value).toBe(passEspecial)
  })

  // 7. Flujo de registro
  it('debe enviar datos al hacer clic con campos completos', async () => {
    const wrapper = mount(Register, globalOptions)

    await wrapper.find('input#email').setValue('marlon@mail.com')
    await wrapper.find('input#password').setValue('12345')

    await wrapper.find('button').trigger('click')

    expect(Swal.fire).toHaveBeenCalledWith('OK', 'Usuario temporal creado', 'success')
  })
})