import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({ 
        isAuth: false,
        user: {
            id: 0,
            name: '',
            email: '',
        }
        // count: 0, 
        // name: 'Иван' 
    }),
    getters: {
        // doubleCount: (state) => state.count * 2,
    },
    actions: {
        // increment() {
        //     this.count++
        // },
    },
})