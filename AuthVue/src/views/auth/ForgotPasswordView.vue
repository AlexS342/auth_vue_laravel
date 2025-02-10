<script setup>
import axios from 'axios';

import { RouterLink, useRouter } from 'vue-router'
const router = useRouter()

import {useAlertStore} from "@/stores/alert.js"
const alertStore = useAlertStore()

import {ref, watch} from "vue";
let emailForm = ref('')
let invalidEmail = false
let regexEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
let isDisabledButton = true

if(localStorage.getItem('enterEmail') !== undefined  && regexEmail.test(localStorage.getItem('enterEmail'))){
    emailForm.value = localStorage.getItem('enterEmail')
    isDisabledButton = false
}

watch(
    emailForm,
    (n1, o1)=>{
        invalidEmail = !regexEmail.test(emailForm.value)
        emailForm.value.length === 0 || invalidEmail  ? isDisabledButton = true : isDisabledButton = false
    }
)
async function sendForgotData(){
    try{
        const response = await axios({
            method: 'post',
            url: '/web/forgot-password',
            data: {
                'email': emailForm.value,
            }
        })
        recordEmailInLocalStorage()
        alertStore.recordMessageInArray(
            'Восстановление доступа',
            'Вы пытаетесь изменить пароль от своего аккаунта. На указанную вами почту отправлена ссылка. ' +
            'Пожалуйста перейдите по ней, чтобы изменить пароль от вашего аккаунта', '',
        )
        await router.push('/')
    } catch (error) {
        alertStore.recordErrorInArray(error, 'Проверьте, правильно ли вы указали email, ' +
            'переведите сообщение от системы (строчка выше)')
    }
}

function recordEmailInLocalStorage(){
    if(regexEmail.test(emailForm.value) && localStorage.getItem('enterEmail') !== emailForm.value){
        localStorage.setItem('enterEmail', emailForm.value)
    }
}

</script>

<template>
    <div class="authPage">
        <div class="authForm__links">
            <RouterLink to="/">Отмена</RouterLink>
            <RouterLink to="/login">Авторизация</RouterLink>
        </div>
        <div class="authForm">
            <h3 class="authForm__title">Изменить пароль</h3>
            <p class="authForm__text">
                Чтобы изменить свой пароль, вам необходимо указать email, с которым вы регистрировались в приложении.
                На него придет ссылка для изменения пароля.
            </p>

            <label class="authForm__label" for="email">Email:</label>
            <input class="authForm__field" :class="{invalidInput: invalidEmail}" name="email" id="email" type="email"
                   v-model="emailForm" placeholder="example@example.com" autocomplete="off">
            <p class="invalidMessage" v-if="invalidEmail">
                Проверьте корректность введённого электронного адреса. Например: example@example.com
            </p>
            <div class="h-40 w-100p" v-else></div>

            <button class="buttonDrBl mr-20t" :class="{styleDisabledButton: isDisabledButton}" type="button"
                    @click="sendForgotData" :disabled="isDisabledButton">
                Запросить ссылку
            </button>

        </div>
    </div>
</template>
