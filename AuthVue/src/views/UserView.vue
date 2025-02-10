<script setup>
import axios from "axios";

import { RouterLink, useRouter } from 'vue-router'
const router = useRouter()

import { useUserStore } from '@/stores/user.js'
const userStore = useUserStore()

import {useAlertStore} from "@/stores/alert.js"
const alertStore = useAlertStore()

if(userStore.isAuth){
    getUserData()
}

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
        await router.push('/')
    }
}

async function getUserData(){
    try{
        const response = await axios({
            method: 'get',
            url: '/api/user',
        })
        userStore.user = response.data
    } catch (error) {
        alertStore.recordErrorInArray(error)
        if(error.status === 401 || error.status === 419 || error.status === 422){
            userStore.isAuth = false
            localStorage.setItem('isAuth', 'false')
            await router.push('/login')
        }
    }
}

async function emailVerified() {
    try{
        const response = await axios({
            method: 'post',
            url: '/web/email/verification-notification',
        })
        if(response.status === 202){
            alertStore.recordMessageInArray(
                'Подтверждение email:',
                'Вам отправлена ссылка для для подтверждения вашего email. Пожалуйста перейдите по ней.',
                'Не выходите из аккаунта и не закрывайте браузер, ' +
                'иначе у вас не получится подтвердить свой аккаунт',
                2
            )
        }else{
            alertStore.recordMessageInArray(
                'Подтверждение email',
                response.statusText + response.status,
                'Проверьте, пришла ли вам ссылка для подтверждения email, если да, то перейдите по ней. ' +
                'Если вы не получили ссылку, по попробуйте очистить КЭШ и еще раз запросите ссылку для подтверждения.',
                3
            )
        }
    } catch (error) {
        alertStore.recordErrorInArray(error)

        if(error.status === 401 || error.status === 419 || error.status === 422){
            userStore.isAuth = false
            localStorage.setItem('isAuth', 'false')
            await router.push('/login')
        }

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
        <div v-if="userStore.isAuth">
            <p>id: {{userStore.user.id}}</p>
            <p>name: {{userStore.user.name}}</p>
            <p>email: {{userStore.user.email}}</p>
            <p v-if="userStore.user['email_verified_at'] !== null">
                email_verified_at: {{ userStore.user['email_verified_at']}}
            </p>
            <button type="button" v-if="userStore.user['email_verified_at'] === null" @click="emailVerified">
                Подтвердить email
            </button>
        </div>
        <p v-else>Guest</p>
	</main>
</template>

<style scoped>
.logo {
	font-size: 1.5em;
}
</style>