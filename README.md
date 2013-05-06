Web Morpher
=
**version: 0.0.0.pre-alpha**

-

#Запуск

**Параметры запуска**

    node_modules:<массив путей для поиска подключаемых модулей>
    path:<путь к корню сайта>
    port:<номер порта, по умолчанию `3000`>

**Задание параметров**

    Файла `app.js` поддерживает: wmConstructor({path:'<путь>', port:'<номер порта>'})
    Конфиг сайта поддерживает: {"node_modules":<пути>,"port":<номер порта>}
    Глобальный конфиг поддерживает: {"node_modules":<пути>}

**Наследование параметров**

Параметры с меньшим приоритетом заменяются или дополняются параметрами с большим.

    path - заменяется
    port - заменяется
    node_modules - расширяется

Параметры по убыванию приоритета:

    Из файла `app.js`
    Из конфига сайта `demo/web-morpher/config.json`
    Из глобального конфига `web-morpher/config.json`
    По умолчанию из `web-morpher/index.js`

**Примеры**

    node app

Windows

    restart.bat

#Зависимости

  - `demo/ext/jquery.js` >= 1.8.3 ([jquery.com](http://jquery.com/))
  - `docs/ext/jquery.js` >= 1.8.3 ([jquery.com](http://jquery.com/))
  - `docs/ext/bootstrap/` >= 2.2.2 ([twitter bootstrap](http://twitter.github.com/bootstrap/))

-

Copyright 2013 Dr@KoN
