import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem("sessionUser")) || null,
        isLogged: JSON.parse(localStorage.getItem("sessionUser")) ? true : false

    }),
    actions: {

        // -------------------------------------------------------------
    // REGISTRO Y SESIÓN AUTOMÁTICA
    // Guarda los datos del registro en 'temUser' e inicia la sesión
    // de inmediato guardando 'sessionUser' y activando isLogged = true.
    
        register(userData) {
            localStorage.setItem('temUser', JSON.stringify(userData));
            localStorage.setItem('sessionUser', JSON.stringify(userData));
            this.user = userData;
            this.isLogged = true;
        },

        login(email, password){
            const tmp = JSON.parse(localStorage.getItem('temUser'))
            if(tmp && tmp.email === email && tmp.password === password){
                this.user = tmp;
                this.isLogged = true;
                localStorage.setItem("sessionUser", JSON.stringify(tmp))
                return true;
            }
            return false;
                
        },

        logout() {
            this.user = null;
            this.isLogged = false;
            localStorage.removeItem('sessionUser');
        }
    }

});
