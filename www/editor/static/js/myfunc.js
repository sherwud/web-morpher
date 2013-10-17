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
            //$('#projectList ul li').last().attr('name', list[key]["name"]);
            $('#projectList ul li').last().attr('folder', list[key]["folder"]);
            $('#projectList ul li').last().attr('node', list[key]["node"]);
            $('#projectList ul li').last().attr('path', list[key]["path"]);
         }
         $('#projectList ul li').bind('click', function(event){
            listBuilder(event);                                    //на все построенные элементы так же навесим обработчики
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
});


function listBuilder(event){
   var el = $(event.delegateTarget);
   //если элемент - папка
   if(el.attr('folder')==='true'){
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
                  //var node = list[key]['node'].substr(1).replace(/\//g, "-");
                  el.children().last().append('<li>');
                  el.children().last().children().last().html('<i class='+icon+'></i> '+list[key]['name']);
                  //el.children().last().children().last().attr('name', list[key]["name"]);
                  el.children().last().children().last().attr('folder', list[key]["folder"]);
                  el.children().last().children().last().attr('path', list[key]["path"]);
               }
               el.contents('ul').children().bind('click', function(event){
                  listBuilder(event);                                        //вешаем обработчики рекурсивно
                  event.stopPropagation();                                  //чтоб событие при всплытии не выполнялось на родителе
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
   //если элемент - файл
   else {
      var path = el.attr('path');                                   //а то гдеж его потом искать
      $('#editor').attr('path', path);                              //атрибуту path ставим путь редактируемого файла
      $.ajax({
         type: 'POST',
         url: '/call/read/nodelist',
         data: 'type=List&path='+path,
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

