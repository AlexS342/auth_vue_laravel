<script setup>
import TheAlert from "@/components/alerts/TheAlert.vue";

import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

import { RouterView} from 'vue-router'

import { useUserStore } from '@/stores/user.js'
const userStore = useUserStore()

import { useAlertStore } from '@/stores/alert.js'
const alertStore = useAlertStore()


JSON.parse(localStorage.getItem('isAuth')) ? userStore.isAuth = true : userStore.isAuth = false;

getCSRF()

/**
 * Функция запрашивает CSRF-TOKEN
 */
async function getCSRF(){
    try{
        await axios({
            method: 'get',
            url: '/web/sanctum/csrf-cookie',
        })
    } catch (error) {
        alertStore.recordErrorInArray(error,
            'Попробуйте очистить КЭШ или перезагрузить компьютер, если это не помогло, ' +
            'то вероятней всего возникли проблемы на сервере, это затруднило обеспечение безопасности ' +
            'и сделало невозможным работу в приложении.'
        )
    }
}

</script>

<template>
    <div class="blockAlerts" v-if="alertStore.showAlerts">
        <div class="alertWRP" v-for="alert in alertStore.alerts">
            <TheAlert :id="alert.id" />
        </div>
    </div>
  	<RouterView />
</template>

<style scoped>
.blockAlerts{
    position: fixed;
    top:0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    z-index: 5000;
    background-color: rgba(0, 0, 0, 0.15);
    box-sizing: border-box;
    padding: 3px;
}
.alertWRP{
    width: 100%;
    display: flex;
    justify-content: center;
}
@media(max-width: 599px){
    .blockAlerts{
        padding: 0;
    }
}
</style>