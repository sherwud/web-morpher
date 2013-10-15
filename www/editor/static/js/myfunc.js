$(document).ready(function(){
   //при загрузке строим дерево из корня проекта
   $.ajax({
      type: 'POST',
      url: '/call/read/nodelist',
      data: 'type=List&path=./',
      cache: false,
      success: function(list){
         list = JSON.parse(list);
         //добавляем к html список при первой загрузке страницы
         $('#projectList').append('<ul>');
         $('#projectList ul').attr('class', "nav nav-list");
         for (var key in list){
            if(list[key]["folder"]) { var icon = 'icon-folder-close' }
            else { icon = 'icon-file' }
            $('#projectList ul').append('<li>');
            $('#projectList ul li').last().html('<i class='+icon+'></i> '+list[key]['name']);
            $('#projectList ul li').last().attr('name', list[key]["name"]);
            $('#projectList ul li').last().attr('folder', list[key]["folder"]);
            $('#projectList ul li').last().attr('node', list[key]["node"]);
            $('#projectList ul li').last().attr('id', list[key]["path"].substr(1).replace(/\//g, "-")); //к сожалению по другому про ид не обратиться
         }                                                                                              //ид делаем подмененным путем к элементу, т.к. на нужна уникальность
         $('#projectList ul li').bind('click', function(){
            listBuilder(this);                                     //на все построенные элементы так же навесим обработчики
         });
         var editor = ace.edit("editor");                          //подключаем редактор Ace
         editor.setTheme("ace/theme/monokai");                     //устанавливаем оформление
         editor.getSession().setMode("ace/mode/javascript");
      }
   });
   //событие по клику на кнопку Save
   $('#saveButton').click(function(){
      var editor = ace.edit("editor");
      var content = editor.getValue();
      var path = '.' + $('#editor').attr('name').replace(/-/g, '/');       //из атрибута name берем путь редактируемого файла
      $.ajax({
         type: 'POST',
         url: '/call/read/SaveFile',
         data: 'type=SaveFile&path='+path+'&content='+content,
         success: function(message){
            console.log(message);
         }
      });
   });
});


function listBuilder(self){
   //если элемент - папка
   if($(self).attr('folder')==='true'){
      if($(self).children().attr('class') === 'icon-folder-close') {  //меняем иконку при клике
         $(self).children().attr('class', 'icon-folder-open');
         $(self).append('<ul class="nav nav-list">');                 //сразу достраиваем, в цикле лишние получим
         var path = '.' + $(self).attr('id').replace(/-/g, '/');      //вот так вот сурово работаем с ид элемента
         $.ajax({
            type: 'POST',
            url: '/call/read/nodelist',
            data: 'type=List&path='+path,
            cashe: false,
            success: function(list){
               list = JSON.parse(list);
               for (var key in list){
                  if(list[key]["folder"]) { var icon = 'icon-folder-close' }
                  else { icon = 'icon-file' }
                  var node = list[key]['node'].substr(1).replace(/\//g, "-");
                  $('#'+node).children().last().append('<li>');
                  $('#'+node).children().last().children().last().html('<i class='+icon+'></i> '+list[key]['name']);
                  $('#'+node).children().last().children().last().attr('name', list[key]["name"]);
                  $('#'+node).children().last().children().last().attr('folder', list[key]["folder"]);
                  $('#'+node).children().last().children().last().attr('id', list[key]["path"].substr(1).replace(/\//g, "-"));
               }
               $('#'+node+' ul').children().bind('click', function(event){
                  listBuilder(this);                                        //вешаем обработчики рекурсивно
                  event.stopPropagation();                                  //чтоб событие при всплытии не выполнялось на родителе
               });
            }
         });
      }
      //если кликнули по развернутой папке - поменяем ей стиль и грохним все дочерние элементы списка
      else if($(self).children().attr('class') === 'icon-folder-open') {
         $(self).children().attr('class', 'icon-folder-close');
         $(self).children().last().remove();
      }
   }
   //если элемент - файл
   else {
      $('#editor').attr('name', $(self).attr('id'));                   //атрибуту name ставим путь редактируемого файла
      var path = '.' + $(self).attr('id').replace(/-/g, '/');          //а то гдеж его потом искать
      $.ajax({
         type: 'POST',
         url: '/call/read/nodelist',
         data: 'type=List&path='+path,
         cashe: false,
         success: function(fileContent){
            if(fileContent){
               fileContent = JSON.parse(fileContent);
               var editor = ace.edit("editor");
               editor.setValue(fileContent["content"]);
               editor.gotoLine(0); // переходим на линию #lineNumber (нумерация с нуля)
            }
           else {
               var editor = ace.edit("editor");
               editor.setValue('File can not be open');
               editor.gotoLine(0); // переходим на линию #lineNumber (нумерация с нуля)
           }
         }
      });
   }
}

