Web Morpher
=
**version: 0.0.0.pre-alpha**

-

#Запуск

**Параметры запуска**

    node_modules:<массив путей для поиска подключаемых модулей>
    path:<путь к корню сайта>
    port:<номер порта, по умолчанию `3000`>
    typeSite:<тип сайта. Смотри "Типы сайтов">

**Задание параметров**

    Скрипт запуска поддерживает: node app --path:<путь> --port:<номер порта>
    Файла `app.js` поддерживает: wmConstructor({path:'<путь>', port:'<номер порта>'})
    Конфиг сайта поддерживает: {"node_modules":<пути>,"port":<номер порта>,"typeSite":<тип сайта>}
    Глобальный конфиг поддерживает: {"node_modules":<пути>}

**Наследование параметров**

Параметры с меньшим приоритетом заменяются или дополняются параметрами с большим.

    path - заменяется
    port - заменяется
    node_modules - расширяется

Параметры по убыванию приоритета:

    Из скрипта запуска `restart.bat`
    Из файла `app.js`
    Из конфига сайта `demo/web-morpher/config.json`
    Из глобального конфига `web-morpher/config.json`
    По умолчанию из `web-morpher/index.js`

Задание параметров из скрипта запуска используется если в js файле запуска `app.js` указан 1 сайт,
т. е. необходимо запускать один сайт с разными параметрами.
Задание параметров в `app.js` применяется, если необходимо запускать несколько сайтов в одном процессе.

**Примеры**

    node app
    node app --port:9000
    node app --path:/docs/ --port:9000
    node app --path:docs --port:9000

**Windows**

    restart.bat

#Зависимости

  - `demo/ext/jquery.js` >= 1.8.3 ([jquery.com](http://jquery.com/))
  - `docs/ext/jquery.js` >= 1.8.3 ([jquery.com](http://jquery.com/))
  - `docs/ext/bootstrap/` >= 2.2.2 ([twitter bootstrap](http://twitter.github.com/bootstrap/))

-

Copyright 2012 Dr@KoN
