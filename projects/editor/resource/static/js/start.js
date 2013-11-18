/**
 * Тута будем хранить базовые обработчики, как правило,
 * отработки которых ждем при первом рендере страницы
 * создал: sherwud
 */
//----------------------------------------------------------------------------------------------------------------------
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
   //вешаем обработчики для конфига эдитора (кнопонька Settings)
   $('#lang li').bind('click', function(){
      if($('#controlPanel ul li.active').attr('class')) {
         var syntax = $(this).text().toLowerCase();
         var el =  $('#controlPanel ul li.active a i').attr('linkedFile');
         var editor = ace.edit(el);
         editor.getSession().setMode("ace/mode/"+syntax);
      }
   });
   //событие по клику на пункты подменю, раздела File
   $('#file ul li').bind('click', function(){
      var method = $(this).attr('method');
      //если хотим сохранить изменения, то работаем с текущим открытым файлом
      if (method == 'editFile') {
         var linkedfile = $('#controlPanel ul li.active a i').attr('linkedfile');
         var node = $('#'+linkedfile).attr('path');
         var name = $('#controlPanel ul li.active').text();
         var editor = ace.edit(linkedfile);
         var data = editor.getValue();
         editFile(name, node, data, function(result) {
            console.log(result);
         });
      }
   });
});
//----------------------------------------------------------------------------------------------------------------------
