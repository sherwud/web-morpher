Web Morpher
=
version: 0.0.0.pre-alpha

-

#Запуск

**Параметры запуска**

    --path:<путь к корню сайта, по умолчанию `../demo/`>
    --config:<имя файла, по умолчанию `config.json`>
    --port:<номер порта, по умолчанию `3000`>

**Параметры файла настроек**

    node_modules:<массив путей для поиска подключаемых модулей>
    port:<номер порта>

**Наследование параметров**

Параметры из файла в корне модуля заменяются параметрами из файла в корне сайта. Параметры отсутствующие в корне сайта берутся из корня модуля.

Параметры по убыванию приоритета:

    Из скрипта запуска `restart.bat`
    Из файла `app.js`
    Из конфига сайта `../demo/web-morpher/config.json`
    Из глобального конфига `./config.json`
    По умолчанию из `./index.js`

параметры с более низким уровнем применяются если они не заданны в вышестоящих уровнях

**Примеры**

    node app
    node app --port:9000
    node app --config:newconfig.json
    node app --config:newconfig.json --port:9000
    node app --path:../docs/ --config:newconfig.json --port:9000

Windows

    restart.bat

#Зависимости

  - `docs/ext/jquery.js` >= 1.8.3 ([jquery.com](http://jquery.com/))

-

Copyright 2012 Dr@KoN
