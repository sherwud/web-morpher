/**
 * Здесь буду собирать функции для работы с самим редактором
 * Created by sherwud on 27.10.13.
 */
//----------------------------------------------------------------------------------------------------------------------
function setEditorMode(name, editor) {
   var filetype = name.split('.')[1];
   if (filetype === 'js') editor.getSession().setMode("ace/mode/javascript");
   else if (filetype === 'html') editor.getSession().setMode("ace/mode/html");
   else if (filetype === 'json') editor.getSession().setMode("ace/mode/json");
   else if (filetype === 'css') editor.getSession().setMode("ace/mode/css");
   else if (filetype === 'php') editor.getSession().setMode("ace/mode/php");
   else if (filetype === 'py') editor.getSession().setMode("ace/mode/python");
   else editor.getSession().setMode("ace/mode/text");
}
//----------------------------------------------------------------------------------------------------------------------