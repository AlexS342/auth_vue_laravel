<script setup>
import axios from 'axios';

import { RouterLink, useRouter } from 'vue-router'
const router = useRouter()

import { useUserStore } from '@/stores/user.js'
const userStore = useUserStore()

import {useAlertStore} from "@/stores/alert.js"
const alertStore = useAlertStore()

import {ref, watch} from "vue";
let nameForm = ref('')
let emailForm = ref('')
let passwordForm = ref('')
let passwordConfirmationForm = ref('')
let invalidName = false
let invalidEmail = false
let invalidPassword = false
let invalidPasswordConfirmation = false
let regexpName1 = /^[a-zа-я0-9-\s]{3,30}$/i
let regexpName2 = /\s{2,}/
let regexEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
let regexpPassword = /^[a-zа-я0-9]{8,20}$/i
let isDisabledButton = true

watch(
    [nameForm, emailForm, passwordForm, passwordConfirmationForm],
    ([n1, n2, n3, n4], [o1, o2, o3, o4])=>{
        if(n1 !== o1){
            !regexpName1.test(nameForm.value) || regexpName2.test(nameForm.value)
                ? invalidName = true : invalidName = false
        }
        if(n2 !== o2){
            invalidEmail = !regexEmail.test(emailForm.value)
        }
        if(n3 !== o3){
            invalidPassword = !regexpPassword.test(passwordForm.value)
        }
        if(n4 !== o4){
            passwordForm.value === passwordConfirmationForm.value ?
                invalidPasswordConfirmation = false: invalidPasswordConfirmation = true
        }

        nameForm.value.length === 0 || emailForm.value.length === 0 ||
        passwordForm.value.length === 0 || passwordConfirmationForm.value.length === 0 ||
        invalidName || invalidEmail || invalidPassword || invalidPasswordConfirmation ?
            isDisabledButton = true : isDisabledButton = false
    })
async function sendRegistrData(){
    try{
        const response = await axios({
            method: 'post',
            url: '/web/register',
            data: {
                'name': nameForm.value,
                'email': emailForm.value,
                'password': passwordForm.value,
                'password_confirmation': passwordConfirmationForm.value,
            }
        })
        let message = ''
        if(response.status >= 200 && response.status <= 205){
            message = 'Вы успешно зарегистрировались и вошли в свой аккаунт!'
        }else{
            message = 'Что то пошло не так! Проверьте, удалось ли вам зарегистрироваться!'
        }
        localStorage.setItem('isAuth', 'true');
        userStore.isAuth = true
        alertStore.recordResponseInArray(response, message)
        alertStore.recordMessageInArray(
            'Уведомление',
            'На указанную вами почту, выслана ссылка для подтверждения. Пожалуйста перейдите по ссылке, что ' +
            'бы мы были уверены, что вы указали свою почту.',
            'В момент перехода по ссылке вы должны быть авторизированны в приложении, пожалуйста не выходите ' +
            'из аккаунта и не закрывайте браузер',
            2
        )
        await router.push({path: '/'})
    } catch (error) {
        alertStore.recordErrorInArray(
            error,
            'Вам не удалось зарегистрироваться. Возможно некорректный email или пароль.'
        )
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
            <h3 class="authForm__title">Регистрация</h3>

            <label class="authForm__label" for="name">Имя:</label>
            <input class="authForm__field" :class="{invalidInput: invalidName}" name="name" id="name" type="text"
                   v-model.trim="nameForm" placeholder="Jon Kennedy" autocomplete="off">
            <p class="invalidMessage" v-if="invalidName">
                Проверьте корректность введённого Имени. (от 3 до 30 символов, допускается использовать английские,
                русские буквы, цифры, пробелы и тире)
            </p>
            <div class="h-40 w-100p" v-else></div>

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

            <label class="authForm__label" for="password_confirmation">Повторите пароль:</label>
            <input class="authForm__field" :class="{invalidInput: invalidPasswordConfirmation}"
                   name="password_confirmation" id="password_confirmation" type="password"
                   v-model="passwordConfirmationForm" placeholder="password" autocomplete="off">
            <p class="invalidMessage" v-if="invalidPasswordConfirmation">
                Повторно введенный пароль не совпадает с паролем в поле "Пароль"
            </p>
            <div class="h-40 w-100p" v-else></div>

            <button class="buttonDrBl mr-20t" :class="{styleDisabledButton:isDisabledButton}" type="button"
                    @click="sendRegistrData" :datafld="isDisabledButton">
                Регистрация
            </button>
        </div>
    </div>
</template>
