<script setup>
import axios from "axios";

import { RouterLink, useRouter } from 'vue-router'
const router = useRouter()

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
    	ABOUT
	</main>
</template>

<style scoped>
.logo {
	font-size: 1.5em;
}
</style>