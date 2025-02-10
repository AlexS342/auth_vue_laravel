<script setup>
import axios from "axios";

import { RouterLink, useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

import { useUserStore } from '@/stores/user.js'
const userStore = useUserStore()

import {useAlertStore} from "@/stores/alert.js"
const alertStore = useAlertStore()

function pressLogin(){
	router.push('/login')
}

async function sendLogout(){
    try{
        const response = await axios({
            method: 'post',
            url: '/web/logout',
        })
        userStore.isAuth = false
        localStorage.setItem('isAuth', 'false')
        alertStore.recordResponseInArray(response, 'Вы успешно вышли из Аккаунта и завершили сессию.')
        await router.push('/')
    } catch (error) {
        userStore.isAuth = false
        localStorage.setItem('isAuth', 'false')

        alertStore.recordMessageInArray(
            'Logout',
            error.message + error.status,
            'Скорее всего сессия завершилась автоматически из-за отсутствия активности.',
            3
        )
    }
}


import {onMounted} from "vue";
onMounted(() => {
    if(route.query.verified !== undefined){
        if(route.query.verified === '1'){
            alertStore.recordMessageInArray(
                'Подтверждение email:',
                'Вы успешно подтвердили свой email',
                '',
            )
        }else {
            alertStore.recordMessageInArray(
                'Подтверждение email:',
                'У вас не получилось подтвердить свой email',
                'Возможный причины: 1. На момент перехода по ссылки вы авторизированны в приложении. ' +
                '2. Ссылка открывается не в том браузере, через который вы вошли в приложении. ' +
                'Совет: Снова войдите в приложение, скопируйте ссылку из email и откройте ее в том браузере, ' +
                'через который вошли в приложение.',
                3
            )
        }
    }
})
</script>

<template>
	<header>
		<div class="logo">
			LOGO
		</div>
		<nav>
			<RouterLink to="/">Home</RouterLink>
			<RouterLink to="/user">User</RouterLink>
			<RouterLink to="/about">About</RouterLink>
		</nav>
		<div>
			<button class="buttonLink" @click="sendLogout" v-if="userStore.isAuth">Выйти</button>
			<button class="buttonLink" @click="pressLogin" v-else>Войти</button>
		</div>
	</header>
	<main>
    	HOME
	</main>
</template>

<style scoped>
.logo {
	font-size: 1.5em;
}
</style>
