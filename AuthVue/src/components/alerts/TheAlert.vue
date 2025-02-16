<script setup>
import IconNotificationForAlerts from "@/components/alerts/IconNotificationForAlerts.vue"
import IconInformationForAlerts from "@/components/alerts/IconInformationForAlerts.vue"
import IconSuccessFroAlerts from "@/components/alerts/IconSuccessFroAlerts.vue"
import IconWarningForAlerts from "@/components/alerts/IconWarningForAlerts.vue"
import IconDangerForAlerts from "@/components/alerts/IconDangerForAlerts.vue"

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
})

import { useAlertStore } from '@/stores/alert.js'
const alertStore = useAlertStore()

function hideAlert(){
    delete alertStore.alerts[props.id]
    if(Object.keys(alertStore.alerts).length === 0){
        alertStore.showAlerts = false
    }
}

function checkAvailability(param){
    return alertStore.alerts[props.id][param] !== undefined
        && alertStore.alerts[props.id][param] !== null
        && alertStore.alerts[props.id][param].length >= 1

}

</script>

<template :key="props.id">
    <transition name="alert">
        <div class="alert" :class="{[alertStore.alerts[props.id].style]:true}">
            <div class="iconWRP">
                <!-- Обычное сообщение (Notification) -->
                <IconNotificationForAlerts v-if="alertStore.alerts[props.id].icon === 'notification'"/>
                <IconInformationForAlerts v-else-if="alertStore.alerts[props.id].icon === 'information'"/>
                <IconSuccessFroAlerts v-else-if="alertStore.alerts[props.id].icon === 'success'"/>
                <IconWarningForAlerts v-else-if="alertStore.alerts[props.id].icon === 'warning'"/>
                <IconDangerForAlerts v-else-if="alertStore.alerts[props.id].icon === 'danger'"/>
<!--                <svg v-if="alertStore.alerts[props.id].icon === 'notification'"-->
<!--                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"-->
<!--                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">-->
<!--                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"></path>-->
<!--                    <path d="M18.364 16.364a9 9 0 1 0-12.728 0"></path>-->
<!--                </svg>-->
                <!-- Информация (Information) -->
<!--                <svg v-else-if="alertStore.alerts[props.id].icon === 'information'"-->
<!--                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"-->
<!--                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">-->
<!--                    <circle cx="12" cy="12" r="10" />-->
<!--                    <line x1="12" y1="16" x2="12" y2="12" />-->
<!--                    <line x1="12" y1="8" x2="12" y2="8" />-->
<!--                </svg>-->
                <!-- Успех (Success) -->
<!--                <svg v-else-if="alertStore.alerts[props.id].icon === 'success'"-->
<!--                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"-->
<!--                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">-->
<!--                    <path d="M2 11.382l6.618 6.618 14-14"/>-->
<!--                    <circle cx="12" cy="12" r="10"/>-->
<!--                </svg>-->
                <!-- Предупреждение (Warning) -->
<!--                <svg v-else-if="alertStore.alerts[props.id].icon === 'warning'"-->
<!--                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"-->
<!--                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">-->
<!--                    <path d="M12 5.999l9.194 14.435A2 2 0 0 1 19.194 22H4.806a2 2 0 0 1-1.194-1.565L12 5.999z" />-->
<!--                    <line x1="12" y1="10" x2="12" y2="16" />-->
<!--                    <line x1="12" y1="19" x2="12" y2="19" />-->
<!--                </svg>-->
                <!-- Опасность (Danger) -->
<!--                <svg v-else-if="alertStore.alerts[props.id].icon === 'danger'"-->
<!--                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"-->
<!--                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">-->
<!--                    <line x1="18" y1="6" x2="6" y2="18" />-->
<!--                    <line x1="6" y1="6" x2="18" y2="18" />-->
<!--                    <circle cx="12" cy="12" r="10" />-->
<!--                </svg>-->
            </div>

            <div class="message">
                <p class="message__title" v-if="checkAvailability('status')">
                    Status: {{ alertStore.alerts[props.id].status }}
                </p>
                <p class="message__title" v-if="checkAvailability('code')">
                    {{ alertStore.alerts[props.id].code }}
                </p>
                <p class="message__text" v-if="checkAvailability('message')">
                    {{ alertStore.alerts[props.id].message }}
                </p>
                <p class="message__hint" v-if="checkAvailability('hint')">
                    {{ alertStore.alerts[props.id].hint }}
                </p>
            </div>
            <div class="action">
                <button type="button" class="close" @click="hideAlert">{{'\u2716'}}</button>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.alert-enter-active,
.alert-leave-active {
    transition: opacity 0.5s ease;
}

.alert-enter-from,
.alert-leave-to {
    opacity: 0;
}

.alert {
    width: 80%;
    max-width: 500px;
    min-height: 50px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
}
.alert-grey {
    background: rgb(255, 255, 255);
    background: linear-gradient(0deg, rgb(221, 221, 221) 0%, rgb(255, 255, 255) 50%, rgb(221, 221, 221) 100%);
    border: 1px solid #dbdbdb;
    color: rgb(95, 95, 95);
    box-shadow: 0 0 15px -5px #777777;
}
.alert-green {
    background: rgb(217,255,190,1);
    background: linear-gradient(0deg, rgb(204 255 145) 0%, rgba(217,255,190,1) 50%, rgb(204 255 145) 100%);
    border: 1px solid #c4eda5;
    color: rgb(55 119 9);
    box-shadow: 0 0 15px -5px #06a900;
}
.alert-blue {
    background: rgb(152,206,255);
    background: linear-gradient(0deg, rgba(170, 214, 255,1) 0%, rgba(190,236,255,1) 50%, rgba(170, 214, 255,1) 100%);
    border: 1px solid #a5e4ed;
    color: rgb(9 52 119);
    box-shadow: 0 0 15px -5px #002da9;
}
.alert-orange {
    background: rgb(255,221,138);
    background: linear-gradient(0deg, rgba(255,221,138,1) 0%, rgba(255,236,190,1) 50%, rgba(255,221,138,1) 100%);
    border: 1px solid #eddda5;
    color: rgb(119 91 9);
    box-shadow: 0 0 15px -5px #a96500;
}
.alert-red {
    background: rgb(255,153,153);
    background: linear-gradient(0deg, rgba(255,153,153,1) 0%, rgba(255,190,190,1) 50%, rgba(255,153,153,1) 100%);
    border: 1px solid #eda5a5;
    color: rgb(119 9 9);
    box-shadow: 0 0 15px -5px #a90000;
}
.iconWRP {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(103 103 103 / 31%);
    padding: 6px;
}
.message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    box-sizing: border-box;
    padding: 4px;
}
.message__title {
    text-align: center;
    word-break: break-all;
    font-size: 16px;
}
.message__text {
    text-align: center;
    font-size: 14px;
    margin-top: 4px;
}
.message__hint {
    text-align: center;
    font-style: italic;
    font-size: 12px;
}
.action {
    padding: 4px;
    box-sizing: border-box;
}
.close {
    border: 1px solid #d7d7d7;
    background: #e9e9e9;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 2px 2px 1px 1px;
}
.close:hover {
    width: 22px;
    height: 22px;
    font-size: 16px;
    background: #e3e1e1;
    margin: 1px 1px 0 0;
}
.close:active {
    border: 2px solid #c9c9c9;
    background: #d7d7d7;
    color: #6d6d6d;
}

@media(max-width: 599px){
    .alert {
        width: 100%;
        min-height: 30px;
        position: relative;
    }
    .message {
        padding: 4px;
    }
    .message__text {
        margin-top: 4px;
    }
    .message__hint {
        text-align: center;
        margin-top: 4px;
    }
    .action {
        padding: 3px;
    }
}
</style>