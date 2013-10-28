$(document).ready(function(){
   //нужен счетчик вкладок мне в окне, поэтному ввожу глобальный идентификатор
   document.tabcount = 0;
   //при загрузке строим дерево из корня проекта
   $.ajax({
      type: 'POST',
      url: '/call/read/selectProject',
      data: 'type=startList',
      success: function(res) {
         res = JSON.parse(res);
         //строим оптионы с именами проектов
         for (var key in res) {
            $('#projectSelect').append('<option id='+key+' path='+res[key]+'>'+key+'</option>');
         }
         //вешаем обработчики на выбор каждого из оптионов
         $('#projectSelect').children().bind('click', function(event) {
            var el = $(event.delegateTarget);
            var path = el.attr('path');
            setCookie(path, OpenProject(path));
         });
         //проверим нет ли чего в куках, если есть поставим в зависимости от содержимого проект
         getCookie('project', function(res){
            if(res !== 'default'){
               res = JSON.parse(res);
               OpenProject(res['path'], res['name']);
            }
            getCookie('tabs', function(result){
               if(res !== 'default'){
                  result = JSON.parse(result);
                  for (var key in result) {
                     OpenFile(result[key], key);
                  }
               }
            });
         });
      }
   });
   //вешаем обработчики для конфига эдитора
   $('#lang li').bind('click', function(){
      if($('#controlPanel ul li.active').attr('class')) {
         var syntax = $(this).text().toLowerCase();
         var el =  $('#controlPanel ul li.active a i').attr('linkedFile');
         var editor = ace.edit(el);
         editor.getSession().setMode("ace/mode/"+syntax);
      }
   })
   //событие по клику на кнопку Save
   $('#saveButton').click(function(){
      var editor = ace.edit("editor");
      var content = editor.getValue();
      var path = $('#editor').attr('path');                        //из атрибута path берем путь редактируемого файла
      $.ajax({
         type: 'POST',
         url: '/call/read/SaveFile',
         data: 'type=SaveFile&path='+path+'&content='+content,
         success: function(message){
            console.log(message);
         }
      });
   });
   //событие по клику на пункты подменю, раздела File
   $('#file ul li').bind('click', function(){
      var linkedfile = $('#controlPanel ul li.active a i').attr('linkedfile');
      var method = $(this).text();
      var name = $('#controlPanel ul li.active').text();
      var node = $('#'+linkedfile).attr('path');
      deleteDirectory('test', './projects/editor', function(res){
         console.log(res);
      })
   });
});
//----------------------------------------------------------------------------------------------------------------------
/**
 * Функция достраивает список фалов-дирректорий в области дерева проекта
 * при воздействии на элемент списка
 * @param event {object}
 */
function listBuilder(event){
   var el = $(event.delegateTarget);
   var path = el.attr('path');
   var name = el.text().slice(1);
   //если элемент - папка
   if(el.attr('folder')==='true'){
      OpenDirectory(el);
   }
   //если элемент - файл
   else {
      setActiveOpenedFile(el);
      OpenFile(path, name);
   }
}
//----------------------------------------------------------------------------------------------------------------------
/**
 * Функция строит дефолтный список файлов-дирректорий в области дерева проекта,
 * назначает обработчики
 * @param path {string} - путь к проекту, который необходимо открыть
 * @param name {string} - имя выбранного проекта
 * @constructor
 */
function OpenProject(path, name) {
   $('#'+name).attr('selected', 'true');
   if($('#projectSelect').val() !== 'Выберите проект') {
      $.ajax({
         type: 'POST',
         url: '/call/read/nodelist',
         data: 'type=List&path='+path,
         success: function(list){
            list = JSON.parse(list);
            $('#projectList').children().remove();
            //добавляем к html список при первой загрузке страницы
            $('#projectList').append('<ul>');
            $('#projectList ul').attr('class', "nav nav-list");
            for (var key in list){
               if(list[key]["folder"]) { var icon = 'icon-folder-close' }
               else { icon = 'icon-file' }
               $('#projectList ul').append('<li>');
               $('#projectList ul li').last().html('<i class='+icon+'></i> '+list[key]['name']);
               $('#projectList ul li').last().attr('folder', list[key]["folder"]);
               $('#projectList ul li').last().attr('node', list[key]["node"]);
               $('#projectList ul li').last().attr('path', list[key]["path"]);
               //на все построенные элементы так же навесим обработчики, папка - на клик, файл - даблклик
               if(list[key]["folder"]) {
                  $('#projectList ul li').last().bind('click', function(event){
                     listBuilder(event);                       //на все построенные элементы так же навесим обработчики
                  });
               } else {
                  $('#projectList ul li').last().bind('dblclick', function(event){
                     listBuilder(event);
                  });
               }
            }
            //закроем все вкладки
            $('#controlPanel ul').children().remove();
            $('#editFiles').children().remove();
         }
      });
   }
}
//----------------------------------------------------------------------------------------------------------------------
/**
 * Функция открывает запрошенный файл
 * добавляет соответствующие элементы панели навигации, области редактирования,
 * устанавливает режим подсветки синтаксиса и начальные настройки редактора
 * @param path {string} - путь к файлу, который хотим открыть
 * @param name {string} - имя файла, который хотим открыть
 * @constructor
 */
function OpenFile(path, name) {
   $.ajax({
      type: 'POST',
      url: '/call/read/nodelist',
      data: 'type=List&path='+path,
      success: function(fileContent){
         if(fileContent){
            fileContent = JSON.parse(fileContent);
            document.tabcount++;
            var tabid = 'efile'+document.tabcount;
            $('#editFiles').append('<div class="editor tab-pane " id='+tabid+' path='+path+'></div>');
            $('.active').toggleClass('active');
            var editor = ace.edit(tabid);
            editor.setValue(fileContent["content"]);
            editor.gotoLine(2); // переходим на линию #lineNumber (нумерация с нуля)
            //настроим режим подсветки синтаксиса в зависимости от типа открываемого файла
            setEditorMode(name, editor);
         }
         else {
            var editor = ace.edit("tabid");
            editor.setValue('File can not be open');
            editor.gotoLine(2);
         }
         var remtab = {"path":path, "name":name}
         setCookie(remtab);
         $('#controlPanel ul').append('<li class="active"><a data-toggle="tab" href="#'+tabid+'">'+name+'<i class="icon-remove-sign closetab" linkedFile='+tabid+'></i></a></li>');
         $('#'+tabid).toggleClass('active');
         $('#controlPanel ul li.active i').bind('click', function() {
            var linkedFile  = $(this).attr('linkedFile');
            //удалим информацию о вкладке из куков
            delCookie({'path':$('#'+linkedFile).attr('path'), 'name':$(this).parent().text()});
            //удалим вкладку и связанный див с эдитором
            $(this).parent().parent().remove();
            $('#'+linkedFile).remove();
            //проверим, если был закрыт не активный таб, то продолжаем работать, в противном случае активным сделаем последний
            if(!$('#controlPanel ul li.active').attr('class')) {
               $('#controlPanel ul li').last().toggleClass('active');
               $('#editFiles').children().last().toggleClass('active');
            }
         });
      }
   });
}
//----------------------------------------------------------------------------------------------------------------------
/**
 * Функция открывает запращиваемую дирректорию
 * достраивает необходимые элементы списка ообласти дерева проекта
 * @param el {object} - элемент по которому кликнули
 * @constructor
 */
function OpenDirectory(el) {
   if(el.children().attr('class') === 'icon-folder-close') {  //меняем иконку при клике
      el.children().attr('class', 'icon-folder-open');
      el.append('<ul class="nav nav-list">');                 //сразу достраиваем
      var path = el.attr('path');
      $.ajax({
         type: 'POST',
         url: '/call/read/nodelist',
         data: 'type=List&path='+path,
         success: function(list){
            list = JSON.parse(list);
            for (var key in list){
               if(list[key]["folder"]) { var icon = 'icon-folder-close' }
               else { icon = 'icon-file' }
               el.children().last().append('<li>');
               el.children().last().children().last().html('<i class='+icon+'></i> '+list[key]['name']);
               el.children().last().children().last().attr('folder', list[key]["folder"]);
               el.children().last().children().last().attr('path', list[key]["path"]);
               //на все построенные элементы так же навесим обработчики, папка - на клик, файл - даблклик
               if(list[key]["folder"]) {
                  el.children().last().children().last().bind('click', function(event){
                     listBuilder(event);
                  });
               } else {
                  el.children().last().children().last().bind('dblclick', function(event){
                     listBuilder(event);
                  });
               }
            }
            //чтоб событие при всплытии не выполнялось на родителе
            el.contents('ul').children().bind('click', function(event){
               event.stopPropagation();
            });
         }
      });
   }
   //если кликнули по развернутой папке - поменяем ей стиль и грохним все дочерние элементы списка
   else if(el.children().attr('class') === 'icon-folder-open') {
      el.children().attr('class', 'icon-folder-close');
      el.children().last().remove();
   }
}
//----------------------------------------------------------------------------------------------------------------------
/**
 * Функция разбирается не открыт ли уже запрашиваемый файл
 * и если он открыт, то не передает управление в функции достраивающие новую область редактирования,
 * а делает активной вкладку уже открытого файла
 * @param el - элемент по которому кликнули
 */
function setActiveOpenedFile(el) {
   //проверим,если такой файл уже открыт, то откроем нужную вкладку и не будем слать запрос
   if ($('#controlPanel ul li').attr('class') || $('#controlPanel ul li').attr('class')=='') {
      //имя файла который пытаемся открыть
      var name = el.text().split(' ')[1];
      //циклом пробегаемся по всем табам, проверяем открыт ли такой файл
      for (var i=0; i < $('#controlPanel ul li').length; i++){
         //имя таба который проверяем на текущей итерации
         var curtabname = $($('#controlPanel ul li')[i]).text().split(' ')[0];
         if (name == curtabname) {
            //проверяем не этот ли таб с файлом сичас активен и если нет перейдем на него
            if ($($('#controlPanel ul li')[i]).attr('class') != 'active') {
               //если есть активный таб, то снимем с него эти привелегии
               if ($('#controlPanel ul li.active').attr('class')) {
                  $('#'+$('#controlPanel ul li.active i').attr('linkedFile')).toggleClass('active');
                  $('#controlPanel ul li.active').toggleClass('active');
               }
               //переходим к уже открытому файлу
               $($('#controlPanel ul li')[i]).toggleClass('active');
               $('#'+$($('#controlPanel ul li')[i]).children().children().attr('linkedFile')).toggleClass('active');
            }
            return;
         }
      }
   }
}
//----------------------------------------------------------------------------------------------------------------------