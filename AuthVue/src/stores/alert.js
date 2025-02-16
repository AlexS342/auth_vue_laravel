import { defineStore } from 'pinia'

export const useAlertStore = defineStore('alert', {
    state: () => ({
        'showAlerts': false,
        'style' : ['alert-grey', 'alert-green', 'alert-blue', 'alert-orange', 'alert-red'],
        'icons' : {
            'alert-grey' : 'notification',
            'alert-green': 'success',
            'alert-blue': 'information',
            'alert-orange': 'warning',
            'alert-red': 'danger'
        },
        'alerts' : {}
    }),
    getters: {
        // doubleCount: (state) => state.count * 2,
    },
    actions: {
        /**
         * Метод сохраняет в Store данные для вывода уведомления красного цвета и оно сразу отображается пользователю
         * @param {Object} response - обычно объект полученный из блока catch
         * @param {String} hint - дополнительное сообщение текстом маленького размера и курсивом
         */
        recordResponseInArray(response, hint=""){
            let alert = {}
            alert.id = 'res-' + (Math.floor(Math.random() * 100)) + '-' + (Math.floor(Math.random() * 100)) +
                '/' + (Math.floor(Math.random() * 100))
            alert.status = response.status
            alert.code = ""
            alert.message = response.statusText
            alert.hint = hint
            if(response.status < 300){
                alert.style = this.style[1]
            }else{
                alert.style = this.style[3]
            }
            alert.icon = this.icons[alert.style]

            this.alerts[alert.id] = alert
            this.showAlerts = true
        },
        /**
         * Метод сохраняет в Store данные для вывода уведомления красного цвета и оно сразу отображается пользователю
         * @param {Object} error - обычно объект полученный из блока catch
         * @param {String} hint - дополнительное сообщение текстом маленького размера и курсивом
         */
        recordErrorInArray(error, hint=''){
            let alert = {}
            alert.id = 'err-' + (Math.floor(Math.random() * 100)) + '-' + (Math.floor(Math.random() * 100)) +
                '/' + (Math.floor(Math.random() * 100))
            alert.status = error.status
            alert.code = error.code
            alert.message = error.message

            const message = error?.response?.data?.message
            if (message) {
                alert.message = alert.message + ' => ' + message
            }

            hint !== '' ? alert.hint = hint : alert.hint = null
            alert.style = this.style[4]
            alert.icon = this.icons[alert.style]

            this.alerts[alert.id] = alert
            this.showAlerts = true
        },
        /**
         * Метод сохраняет уведомление для пользователя в Store и оно сразу отображается пользователю
         * @param {String} title - Заголовок для уведомления
         * @param {String} message - сообщение текстом нормального размера и стиля
         * @param {String} hint - сообщение текстом маленького размера и курсивом
         * @param {number} style - номер цветовой темы (0 - серый, 1 - зеленый, 2 - синий, 3 - оранжевый, 4 - красный)
         */
        recordMessageInArray(title ="", message="", hint="", style=2){
            let alert = {}
            alert.id = 'mes-' + (Math.floor(Math.random() * 100)) + '-' + (Math.floor(Math.random() * 100)) +
                '/' + (Math.floor(Math.random() * 100))
            alert.status = ""
            alert.code = title
            alert.message = message
            alert.hint = hint
            alert.style = this.style[style]
            alert.icon = this.icons[alert.style]

            this.alerts[alert.id] = alert
            this.showAlerts = true
        },
    },
})