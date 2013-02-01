Web Morpher
=
**version: 0.0.0.pre-alpha**

-

#Запуск

**Параметры запуска**

    --path:<путь к корню сайта>
    --port:<номер порта, по умолчанию `3000`>

**Параметры файла настроек**

    node_modules:<массив путей для поиска подключаемых модулей>
    port:<номер порта>

**Наследование параметров**

Параметры из файла в корне модуля (глобальные) заменяются или дополняются параметрами из файла в корне сайта (локальные).
Параметры, отсутствующие в корне сайта берутся из корня модуля.

    port - глобальные заменяются локальными
    node_modules - глобальные расширяются локальными

Параметры по убыванию приоритета:

    Из скрипта запуска `restart.bat`
    Из файла `app.js`
    Из конфига сайта `demo/web-morpher/config.json`
    Из глобального конфига `web-morpher/config.json`
    По умолчанию из `web-morpher/index.js`

параметры с более низким уровнем применяются, если они не заданы в вышестоящих уровнях

**Примеры**

    node app
    node app --port:9000
    node app --path:/docs/ --port:9000
    node app --path:docs --port:9000

**Windows**

    restart.bat

#Зависимости

  - `docs/ext/jquery.js` >= 1.8.3 ([jquery.com](http://jquery.com/))

-

Copyright 2012 Dr@KoN
