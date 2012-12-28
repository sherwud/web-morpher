Web Morpher
=
version: 0.0.0.pre-alpha

-

#Запуск

Параметры запуска

    --port:<номер порта, по умолчанию 3000>
    --config:<имя файла, по умолчанию config.json>

Параметры файла настроек

    paths:<массив путей для поиска подключаемых модулей>
    port:<номер порта>

Примеры

    node app
    node app --port:9000
    node app --config:newconfig.json
    node app --port:9000 --config:newconfig.json

Windows

    restart.bat

#Зависимости

  - `docs/ext/jquery.js` >= 1.8.3 ([jquery.com](http://jquery.com/))

-

Copyright 2012 Dr@KoN
