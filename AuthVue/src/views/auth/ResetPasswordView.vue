<script setup>
import axios from 'axios';

import { RouterLink, useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

import {useAlertStore} from "@/stores/alert.js"
const alertStore = useAlertStore()

if(route.query.email !== localStorage.getItem('enterEmail')){
    alertStore.recordMessageInArray('Сообщение о безопасности', 'Email из запроса ссылки на изменение ' +
        'пароля не совпал с Email из ссылки на восстановление пароля', 'Это не штатная ситуация и изменение ' +
        'пароля прекращено!', 4)
    router.push('/')
}


import {ref, watch} from "vue";
let passwordForm = ref('')
let passwordConfirmationForm = ref('')
let invalidPassword = false
let invalidPasswordConfirmation = false
let regexpPassword = /^[a-zа-я0-9]{8,20}$/i
let isDisabledButton = true

watch(
    [passwordForm, passwordConfirmationForm],
    ([n1, n2], [o1, o2])=>{
        if(n1 !== o1){
            invalidPassword = !regexpPassword.test(passwordForm.value)
        }
        if(n2 !== o2){
            passwordForm.value === passwordConfirmationForm.value ?
                invalidPasswordConfirmation = false: invalidPasswordConfirmation = true
        }

        passwordForm.value.length === 0 || passwordConfirmationForm.value.length === 0 || invalidPassword ||
        invalidPasswordConfirmation ? isDisabledButton = true : isDisabledButton = false
    })

async function sendResetData(){
    try{
        const response = await axios({
            method: 'post',
            url: '/web/reset-password',
            data: {
                'email': route.query.email,
                'password': passwordForm.value,
                'password_confirmation': passwordConfirmationForm.value,
                'token': route.params.token,
            }
        })
        alertStore.recordResponseInArray(response, 'Вы успешно изменили пароль от своего аккаунта, теперь ' +
            'нужно авторизоваться с новым паролем')
        await router.push('/login')
    } catch (error) {
        alertStore.recordErrorInArray(error)
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
            <h3 class="authForm__title">Новый пароль</h3>
            <p class="authForm__text">
                Вы пытаетесь изменить пароль для аккаунта с email {{route.query.email}}
            </p>
            <p class="authForm__text">
                Придумайте новый пароль и заполните соответствующие поля.
                Нажмите кнопку "Изменить пароль" чтобы сохранить его.
            </p>

            <label class="authForm__label" for="password">Пароль:</label>
            <input class="authForm__field" :class="{invalidInput: invalidPassword}" name="password" id="password"
                   type="password" v-model="passwordForm" placeholder="password" autocomplete="off">
            <p class="invalidMessage" v-if="invalidPassword">
                Проверьте корректность введённого пароля. (от 8 до 20 символов, допускается использовать буквы
                алинского, русского алфавит и/или цифры)
            </p>
            <div class="h-40 w-100p" v-else></div>

            <label class="authForm__label" for="password_confirmation">Повторите пароль:</label>
            <input class="authForm__field" :class="{invalidInput: invalidPasswordConfirmation}"
                   name="password_confirmation" id="password_confirmation" type="password"
                   v-model="passwordConfirmationForm" placeholder="password" autocomplete="off">
            <p class="invalidMessage" v-if="invalidPasswordConfirmation">
                Повторно введенный пароль не совпадает с паролем в поле "Пароль"
            </p>
            <div class="h-40 w-100p" v-else></div>

            <button class="buttonDrBl mr-20t" :class="{styleDisabledButton: isDisabledButton}" type="button"
                    @click="sendResetData" :disabled="isDisabledButton">
                Изменить пароль
            </button>
        </div>
    </div>
</template>
