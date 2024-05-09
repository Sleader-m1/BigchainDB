
# Инструкция по установке
## 1. Установка BigchainDB
Для развертывания распределённой базы данных BigchainDB необходимо склонировать официальный репозиторий
```
git clone https://github.com/bigchaindb/bigchaindb
```
И запустить его через Docker Compose
```
cd bigchaindb
docker compose up -d
```

## 2. Подготовка MySQL 
Для развертывания распределённой базы данных BigchainDB необходимо склонировать официальный репозиторий

Устанавливаем MySQL из официального репозитория
```
sudo apt install mysql-server
```
Дополнительные параметры установки описаны в [статье](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-20-04-ru)

Далее необходимо:
- войти в терминал MySQL
    ```
    mysql -u root -p
    ```
- создать базу данных 
    ```
    CREATE DATABASE название_базы_данных;
    ```
- создать пользователя для базы данных 
    ```
    CREATE USER 'имя_пользователя'@'localhost' IDENTIFIED BY 'пароль';
    ```
- предоставить права на использование, созданной базы данных 
    ```
    GRANT ALL PRIVILEGES ON название_базы_данных.* TO 'имя_пользователя'@'localhost';
    ```

## 3. Установка проекта 
Склонируем наш репозиторий
```
git clone https://github.com/Sleader-m1/BigchainDB
cd BigchainDB
```
- ### 3.1 Настройка бэкенда 
    Необходимо задать переменные среды в соответствии с примером [env.example](https://github.com/Sleader-m1/BigchainDB/blob/dev/backend/env.example)
    ```
    cd backend
    nano .env 
    ```
    Установить библиотеки
    ```
    npm i
    ```
    Запустить тестовый сервер
    ```
    npm start
    ```

- ### 3.2 Настройка фронтенда
    Анологично пункту 3.1 нужно установить библиотеки и запустить сервер
    ```
    cd frontend 
    npm i
    ```
    Запустить тестовый сервер
    ```
    npm start
    ```
