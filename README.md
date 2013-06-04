Web Morpher
=
**version: 0.0.0.pre-alpha**

#Запуск

**Параметры запуска**

    node_modules:<массив путей для поиска подключаемых модулей>
    path:<путь к корню сайта>
    port:<номер порта, по умолчанию `3000`>

**Задание параметров**

    Файла `app.js` поддерживает: wmConstructor({path:'<путь>', port:'<номер порта>'})
    Конфиг сайта поддерживает: {"node_modules":<пути>,"port":<номер порта>}
    Глобальный конфиг поддерживает: {"node_modules":<пути>}

**Примеры**

    node app

Windows

    restart.bat

#Зависимости

  - `web-morpher/wi/ext/jquery.js` >= 1.8.3 ([jquery.com](http://jquery.com/))    
  - `web-morpher/wi/ext/bootstrap/` >= 2.2.2 ([twitter bootstrap](http://twitter.github.com/bootstrap/))

-

Copyright 2013 Dr@KoN
