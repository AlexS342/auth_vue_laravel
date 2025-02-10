<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

# AuthLaravel

Реализует основной функционал аутентификации и регистрации для SPA frontend. Во фреймворк Laravel 11 добавлены библиотеки "Laravel Fortify" и "Laravel Sanctum" и ни чего больше. 
При использовании этого шаблона вы получаете следующие возможности: "Вход в приложение по email", "Регистрация в приложении", "Подтверждение email" и "Изменение пароля".
Настройка отправки почты для подтверждения email и восстановления пароля не производилась, письма, которые должны приходить на email, сохраняются в логах (/AuthLaravel/storage/logs/laravel.log)
Авторизация реализована на сессиях, токены не выдаются.
Модель user стандартная, контроллеры и провайдеры не изменялись. 
Нет привязки к конкретной базе данных, но если вы будете использовать PostgreSQL и у вас установлен Docker, то можете воспользоваться файлом docker-compose.yml, который автоматически создаст базу данных PostgreSQL

## Требования и состав
На моем ПК установленны:
* Ubuntu 24.04
* PHP 8.4
* Composer 2.8.3
* Docker 27.3.1 (не обязательно, нужен, если планируете запускать БД в docker)

Приложение использует:
* Laravel 11
* fortify
* sanctum

С основными зависимостями можно ознакомится в файле [AuthLaravel/composer.json](./composer.json)

## Запуск проекта на локальном сервере

После успешного копирования всего проекта (Auth Vue-Laravel) к себе на компьютер
1. `cd AuthLaravel` - перейти в папку подпроекта
2. `composer install` - установить зависимости
3. `cp .env.example .env` - создать файл `.env`
4. `php artisan key:generate` - сгенерировать ключ
5. Настроить подключение к базе данных
   * Если у вас установлен docker:
      - `cp docker-compose.yml.example docker-compose.yml` - создать файл `docker-compose.yml`
      - в файле `docker-compose.yml` указать параметры для `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
      - В файле `.env` исправить параметры `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`. Они должны соответствовать параметрам из файла `docker-compose.yml`
      - `sudo docker compose up -d` - запустить базу данных
   * Если БД локально:
      - Возможно потребуется указать другой драйвер подключения к базе данных
      - Нужно самостоятельно создать базу данных и в файле `.env` исправить параметры `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
6. `php artisan migrate:fresh` - Запустить миграции
7. `php artisan db:seed` - Наполнить базу данных тестовыми данными
8. `php artisan serve` - Запустить приложение на локальном сервере

###### Все необходимые действия выполнены, можно переходить к запуску подпроекта [AuthVue](../AuthVue/README.md)  

**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~**  

## Личные заметки в ходе разработки
Постарался записать все важные моменты для упрощения повторной самостоятельно реализации авторизации на других проектах

### Используемые в терминале команды

1. `composer install` - установить зависимости
2. `cp .env.example .env` - создать файл `.env`
3. `php artisan key:generate` - сгенерировать ключ
4. `sudo docker compose up -d` - запустить контейнеры в докере (см. файл `docker-compose.yml`)
5. `sudo docker compose down` - остановить контейнеры в докере (см. файл `docker-compose.yml`)
6. `php artisan migrate:fresh` - Запустить миграции
7. `php artisan db:seed` - Наполнить базу данных тестовыми данными
8. `composer run dev` - запуск локального сервера Laravel
9. `php artisan serve` - Запустить приложение на локальном сервере

### Действия
Сделал некоторые заметки по реализации, на всякий случай.

#### Первый запуск
1. Создал новый проект Laravel 11.x
2. Скопировал файл `docker-compose.yml` из другого проекта и исправил данные
3. Запустил базу данных командой `sudo docker compose up -d`
4. Настроил подключение к БД в phpStorm
5. Запустил миграции `php artisan migrate:fresh` и сидеры `php artisan db:seed`
6. Запустил локальный сервер командой `php artisan serve` и перешёл по ссылке на [Локальный сервер](http://127.0.0.1:8000)
   * В laravel 11.x обязательно запустить первоначальные миграции и сидеры, иначе вылетает ошибка SQL запроса

### Авторизация

1. `composer require laravel/fortify` - установил пакет fortify
2. `php artisan fortify:install` - опубликовал ресурсы Fortify
3. `php artisan migrate:fresh` - полностью обновил миграции, хотя достаточно добавить новые таблицы командой `php artisan migrate`
4. `php artisan db:seed` - заново заполнил базу данных тестовыми данными
5. В файле конфигурации `config/fortify.php` отключил ненужные маршруты и оставить только "регистрация", "сброс пароля", и "верификация email"
   * `'features' => [Features::registration(), Features::resetPasswords(), Features::emailVerification(),`
6. Отключил маршруты представлений в файле `config/fortify.php` => `'views' => false`, позже восстановил значение `true`
   * Если потребуется реализовать сброс и восстановление пароля, то потребуется `'views' => true`
7. Попытка запроса методом POST на 127.0.0.1:8000/login через postman вернула ответ 419, 
    * Если я правильно понял, то теперь нужно устанавливать Sanctum
8. `php artisan install:api` - установил пакет Sanctum и обновил миграции в диалоге
    * !!! В запросах должны быть заголовки Accept: application/json и один из заголовков Referer или Origin (axios все сделал сам)
9. В файле конфигурации `config/sanctum.php` нужно указать доменное имя, с которого будут приходить запросы
   1. В файле `config/sanctum.php` в переменной `stateful` для значения value прописал `'localhost,127.0.0.1,localhost:5173,localhost:8000,127.0.0.1:5173,127.0.0.1:8000,::1'`
   2. В файле `.env` создал переменную `SANCTUM_STATEFUL_DOMAINS` и присвоил ей значение `'localhost,127.0.0.1,localhost:5173,localhost:8000,127.0.0.1:5173,127.0.0.1:8000,::1'`
         + !!! Достаточно использовать `1.` или `2.` способ.
         + !!! Все перечисленные домены не нужны, важно, чтобы был указан домен из заголовка `Referer` или `Origin`
         + !!! Если авторизация и регистрация возвращают `status 200`, а запросы на защищенные маршруты возвращают `status 401`, то рекомендую в первую очередь проверь настройки из пункта `№9`
10. В файле `bootstrap/app.php` добавил в withMiddleware метод `statefulApi()`
11. В файле конфигурации `config/cors.php` в параметре `supports_credentials` установил значение `true` (нужно при восстановлении пароля)
12. В axios нужно будет добавить `axios.defaults.withCredentials = true;` и `axios.defaults.withXSRFToken = true;`
* ###### После настройки proxy в файле vite.config.js (frontend) авторизация и регистрация, а так же запросы на защищенные маршруты заработали.

### Регистрация
 После корректной настройки авторизации, при реализации регистрации не встретил ни каких подводных камней и все заработало с первого раза

### Сброс пароля
1. В файле конфигурации `config/fortify.php` отключил ненужные маршруты и оставить только "регистрация", "сброс пароля", и "верификация email" `'features' => [Features::registration(), Features::resetPasswords(), Features::emailVerification(),`

2. Подготовил во Vue JS форму, которая отправляет `post` запрос на rout `/forgot-password` с полем `email`. 
   * Если все успешно, то придет `status 200` и на почту будет отправлена ссылка, в противном случае ответ будет `status 422`
3. При локальной разработке письмо со ссылкой приходит в `storage/log/laravel.log`. 
   * Пример ссылки: `127.0.0.1:5173/reset-password/ab07564fbe978677bc2ac8c0726256f729a23610fe55f88fc463ddd0a4a2c3c0?email=test%40example.com`
   * Ссылка содержит токен и email для которого осуществляется замена пароля
   * Если в файле `config/cors.php` в параметре `supports_credentials` не установить значение `true`, то сервер будет возвращать `Error 500`
4. Во Vue подготовил роут `/reset-password/:token` и компонент с формой для ввода пароля. При переходе по ссылке из email открывается этот компонент, получает из неё токен и email подставляет их в форму для отправки с новым паролем
5. Из формы п.3 отправляю post запрос с вложенными email, token, пароль и подтверждающим паролем на rout `/reset-password`. В ответ ожидаем `status 200` или в случае неудачи `status 422`
   * Внимание!!! И во Vue JS и в Laravel одинаковые роуты, proxy не отработает!!! (ниже описываю решение проблемы)
6. После получения `status 200` во Vue JS перенаправляю на страницу входа
   * !!! ВАЖНО !!!
   * ROUT `reset-password` ПРИХОДИТСЯ СОЗДАТЬ И НА FRONTEND И НА BACKEND. ЧТОБЫ ВСЕ РАБОТАЛО КОРЕКТНО, ПРИШЛОТЬ В ЗАПРОСАХ К BACKEND ДОБАВЛЯТЬ ПЕРЕД ССЫЛКОЙ `/web` И В PROXY НАСТРАИВА ТАК, ЧТОБЫ ПРИСТАВКА `/web` УБИРАЛАСЬ В МОМЕНТ ЗАПРОСА.
   * Route Vue JS `{ path: '/reset-password/:token', name: 'reset-password/:token', component: ResetPasswordView, },` по ссылке из письма (`http://127.0.0.1:5173/reset-password/...`) открывает компонент для ввода нового пароля
   * Route Laravel `/reset-password/` принимает post запросы с адреса `http://127.0.0.1:8000/reset-password`
   * В компоненте Vue axios записан адрес `url: '/web/reset-password',` (должно получится `http://127.0.0.1:8000/web/reset-password`), но за счет настроек proxy (`'/web': { target: 'http://127.0.0.1:8000', rewrite: (path) => path.replace(/^\/web/, ''), },`) реальный запрос идет `http://127.0.0.1:8000/reset-password`

### Подтверждение email
1. В файле `config/fortify.php` в массиве `features` раскомментировать строчку `Features::emailVerification()` (выполнил ранее)
2. В модели `app/Models/User.php` добавить `use Illuminate\Contracts\Auth\MustVerifyEmail;` и к классу дописать `implements MustVerifyEmail` (должно получится `class User extends Authenticatable implements MustVerifyEmail`)
   * После этого каждый новый пользователь автоматически будет получать email со ссылкой для подтверждения своего email
   * Ссылка переадресовывает на frontend, приписывая к локальному адресу путь из переменной `home` в файле `config/fortify.php`
   * Если в `config/fortify.php` переменная `home' => '/home',` переадресация произойдет на адрес http://127.0.0.1:5173/home
   * Я исправил `home' => '/home',` на `home' => '/',` и получаю ссылку на главную страницу
   * Так же при переадресации в ссылке содержится параметр `verified`, если `verified` = 1, значит email подтвержден
   * Пример полной ссылки переадресации: http://127.0.0.1:5173/?verified=1

