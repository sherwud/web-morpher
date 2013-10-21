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
            $('#projectSelect').append('<option id='+key.toUpperCase()+' path='+res[key]+'>'+key+'</option>');
         }
         //вешаем обработчики на выбор каждого из оптионов
         $('#projectSelect').children().bind('click', function(event) {
            var el = $(event.delegateTarget);
            var path = el.attr('path');
            OpenProject(path);
         });
         //проверим нет ли чего в куках
         var userdata = getCookie();
         //userdata = false;
         if(userdata) {
            userdata = userdata.split('&');
            OpenProject(userdata[0]);
            $('#'+userdata[1].toUpperCase()).attr('selected', 'true');
         }
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
//----------------------------------------------------------------------------------------------------------------------
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
   //если элемент - файл
   else {
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
      var path = el.attr('path');
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
               editor.gotoLine(0); // переходим на линию #lineNumber (нумерация с нуля)
               //настроим режим подсветки синтаксиса в зависимости от типа открываемого файла
               var filetype = el.text().split('.')[1];
               if (filetype === 'js') editor.getSession().setMode("ace/mode/javascript");
               else if (filetype === 'html') editor.getSession().setMode("ace/mode/html");
               else if (filetype === 'json') editor.getSession().setMode("ace/mode/json");
               else if (filetype === 'css') editor.getSession().setMode("ace/mode/css");
               else if (filetype === 'php') editor.getSession().setMode("ace/mode/php");
               else if (filetype === 'py') editor.getSession().setMode("ace/mode/python");
               else editor.getSession().setMode("ace/mode/text");
            }
           else {
               var editor = ace.edit("tabid");
               editor.setValue('File can not be open');
               editor.gotoLine(0);
           }
           $('#controlPanel ul').append('<li class="active"><a data-toggle="tab" href="#'+tabid+'">'+el.text().slice(1)+' <i class="icon-remove-sign closetab" linkedFile='+tabid+'></i></a></li>');
           $('#'+tabid).toggleClass('active');
           $('.closetab').bind('click', function() {
              //удалим вкладку и связанный див с эдитором
               var linkedFile  = $(this).attr('linkedFile');
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
}
//----------------------------------------------------------------------------------------------------------------------
function OpenProject(path) {
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
                  listBuilder(event);                                    //на все построенные элементы так же навесим обработчики
               });
            } else {
               $('#projectList ul li').last().bind('dblclick', function(event){
                  listBuilder(event);                                    //на все построенные элементы так же навесим обработчики
               });
            }
         }
         //обновим куку при открытии нового проекта
         var session = 'editorLastOpenProgect';
         if($('#projectSelect').val() !== 'Выберите проект') {
            var data = path + '&' + $('#projectSelect').val();
            setCookie(session, data);
         }
      }
   });
}
//----------------------------------------------------------------------------------------------------------------------
