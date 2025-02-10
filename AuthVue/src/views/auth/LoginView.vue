<script setup>
import axios from 'axios';

import { RouterLink, useRouter } from 'vue-router'
const router = useRouter()

import { useUserStore } from '@/stores/user.js'
const userStore = useUserStore()

import {useAlertStore} from "@/stores/alert.js"
const alertStore = useAlertStore()

import {ref, watch} from "vue";
// TODO при дальнейшей разработке для переменных emailForm и passwordForm присвоить пустую строку (например let emailForm = ref(''))
let emailForm = ref('test@example.com')
let passwordForm = ref('password')
let rememberForm = false
let invalidEmail = false
let invalidPassword = false
let regexEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
let regexpPassword = /^[a-zа-я0-9]{8,20}$/i
let isDisabledButton = true

emailForm.value.length === 0 || passwordForm.value.length === 0 ||
invalidEmail || invalidPassword ?
    isDisabledButton = true :
    isDisabledButton = false

if(localStorage.getItem('enterEmail') !== undefined  && regexEmail.test(localStorage.getItem('enterEmail'))){
    emailForm.value = localStorage.getItem('enterEmail')
    isDisabledButton = false
}

watch(
    [emailForm, passwordForm],
    ([n1, n2], [o1, o2])=>{
        if(n1 !== o1){
            invalidEmail = !regexEmail.test(emailForm.value)
        }
        if(n2 !== o2){
            invalidPassword = !regexpPassword.test(passwordForm.value)
        }
        emailForm.value.length === 0 || passwordForm.value.length === 0 ||
        invalidEmail || invalidPassword ?
            isDisabledButton = true :
            isDisabledButton = false
    }
)
async function sendLoginData(){
    try{
        const response = await axios({
            method: 'post',
            url: '/web/login',
            data: {
                email: emailForm.value,
                password: passwordForm.value,
                remember: rememberForm,
            }
        })
        userStore.isAuth = true
        localStorage.setItem('isAuth', 'true')
        localStorage.removeItem('enterEmail')
        alertStore.recordResponseInArray(response, 'Вы успешно вошли в свой аккаунт!')
        await router.push('/')
    } catch (error) {
        alertStore.recordErrorInArray(error, 'Вам не удалось войти в свой аккаунт. ' +
            'Проверьте правильно ли вы вводите email и пароль')
    }
}

function sendForgotPassword(){
    if(regexEmail.test(emailForm.value)){
        localStorage.setItem('enterEmail', emailForm.value)
    }
    router.push('/forgot_password')
}

</script>

<template>
    <div class="authPage">
        <div class="authForm__links">
            <RouterLink to="/">Отмена</RouterLink>
            <RouterLink to="/registr">Регистрация</RouterLink>
        </div>
        <div class="authForm">
            <h3 class="authForm__title">Авторизация</h3>

            <label class="authForm__label" for="email">Email:</label>
            <input class="authForm__field" :class="{invalidInput: invalidEmail}" name="email" id="email" type="email"
                   v-model="emailForm" placeholder="example@example.com" autocomplete="off">
            <p class="invalidMessage" v-if="invalidEmail">
                Проверьте корректность введённого электронного адреса. Например: example@example.com
            </p>
            <div class="h-40 w-100p" v-else></div>

            <label class="authForm__label" for="password">Пароль:</label>
            <input class="authForm__field" :class="{invalidInput: invalidPassword}" name="password" id="password"
                   type="password" v-model="passwordForm" placeholder="password" autocomplete="off">
            <p class="invalidMessage" v-if="invalidPassword">
                Проверьте корректность введённого пароля. (от 8 до 20 символов, допускается использовать буквы
                алинского, русского алфавит и/или цифры)
            </p>
            <div class="h-40 w-100p" v-else></div>

            <label class="authForm__label" for="remember">Запомнить меня
                <input class="authForm__checkbox" name="remember" id="remember" type="checkbox"
                       v-model="rememberForm" placeholder="password" autocomplete="off">
            </label>
            <div class="h-40 w-100p"></div>

            <button class="buttonDrBl mr-20t" :class="{styleDisabledButton: isDisabledButton}" type="button"
                    @click="sendLoginData" :disabled='isDisabledButton'>Войти</button>
            
            <div class="authForm__action">
                <button class="buttonLink" type="button" @click="sendForgotPassword">Забыли пароль</button>
            </div>
        </div>
    </div>
</template>