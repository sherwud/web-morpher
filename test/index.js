$(window).bind('load', function(){
   $wm.escapeHTML = function(str){
      if (typeof str !== 'string') return str;
      return str
         .replace(/\</g,'&lt;')
         .replace(/\>/g,'&gt;')
         .replace(/''/g,'&prime;&prime;');
   };
   $wm.cntrlEscapeHTML = function(cnt){
      cnt = $(cnt);
      cnt.val($wm.escapeHTML(cnt.val()));
   };
   $wm.loadmenu = function(){
      function itemclick(){
         var self = this;
         var rowid = self.getAttribute('rowid');
         var submenu = $('div[rowid="'+rowid+'"]');
         $('#menucontainer>div').addClass('hide');
         submenu.removeClass('hide');
         var i = submenu.parent();
         while (i && i.get(0).id !== 'menucontainer') {
           i.removeClass('hide');
           i = i.parent();
         }
         $wm.loading.show();
         $('.menuitem').removeClass('active');
         $('.menuitem').removeAttr('contextmenu');
         $(self).addClass('active');
         $(self).attr('contextmenu','contextmenu');
         $.ajax({
            type: 'POST', url: '/wm', contentType:'application/json; charset=utf-8',
            data: JSON.stringify({
               call:"info.menu",
               data:{parent:rowid,level:submenu.attr('level')}
            }),
            success: function(data){
               submenu.html(data);
               var items = $('.menuitem.dbitem');
               items.unbind('click',itemclick);
               items.click(itemclick);
            },
            error: function(e){;
               alert(e.responseText);
               $wm.loading.hide();
            }
         });
         $.ajax({
            type: 'POST', url: '/wm', contentType:'application/json; charset=utf-8',
            data: JSON.stringify({
               call:"info.getPage",
               data:{_id:rowid}
            }),
            success: function(data){
               $('.menubutton.editPage.hide').removeClass('hide');
               $('#wm-content').html(data);
               $('#wm-content-editing').html(data);
               $wm.syntaxHighlight($('#wm-content'));
               $wm.loading.hide();
            },
            error: function(e){;
               alert(e.responseText);
               $wm.loading.hide();
            }
         });
      };
      $.ajax({
         type: 'POST', url: '/wm', contentType:'application/json; charset=utf-8',
         data: JSON.stringify({call:"info.menu"}),
         success: function(data){
            $('#menucontainer').html(data);
            $('.menuitem.dbitem').click(itemclick);
            $('.menuitem.home').click(function(){
               $wm.loading.show();
               $('#menucontainer>div').addClass('hide');
               $('.menuitem').removeClass('active');
               $(this).addClass('active');
            });
            $('.menuitem.search').click(function(){
               function search(){
                  var search = $('#searchform .search').val();
                  var sr = $('#searchresult');
                  if (search && search.length > 3) {
                     var data = {
                        search:search,
                        menu:!!$('#searchform .checkbox .menu').attr('checked'),
                        tags:!!$('#searchform .checkbox .tags').attr('checked'),
                        text:!!$('#searchform .checkbox .text').attr('checked'),
                        and:!!$('#searchform .radio .o-and').attr('checked'),
                        or:!!$('#searchform .radio .o-or').attr('checked')
                     };
                     $wm.loading.show();
                     $.ajax({
                        type: 'POST', url: '/wm', contentType:'application/json; charset=utf-8',
                        data: JSON.stringify({
                           call:"info.search",
                           data:data
                        }),
                        success: function(data){
                           sr.html(data);
                           $wm.syntaxHighlight(sr);
                           $wm.loading.hide();
                        },
                        error: function(e){;
                           alert(e.responseText);
                           $wm.loading.hide();
                        }
                     });
                  } else {
                     sr.html('Введите более 3х символов');
                  }
               }
               $wm.loading.show();
               $('#menucontainer>div').addClass('hide');
               $('.menuitem').removeClass('active');
               $(this).addClass('active');
               $.ajax({
                  type: 'POST', url: '/wm', contentType:'application/json; charset=utf-8',
                  data: JSON.stringify({
                     call:"info.getSearch"
                  }),
                  success: function(data){
                     $('.menubutton.editPage').addClass('hide');
                     $('#wm-content').html(data);
                     $('#wm-content-editing').html('');
                     $wm.loading.hide();
                     $('#searchform .radio input').click(function(){
                        $('#searchform .radio input').attr('checked',false);
                        $(this).attr('checked',true);
                        $('#searchform .search').focus();
                     });
                     $('#searchform .checkbox input').click(function(){
                        if ($(this).attr('checked'))
                           $(this).attr('checked','checked'); 
                        else
                           $(this).removeAttr('checked');
                        var nochecked = true;
                        $('#searchform .checkbox input').each(function(){
                           if ($(this).attr('checked') === 'checked')
                              nochecked = false;
                        });
                        if (nochecked)
                           $('#searchform .checkbox input.text')
                              .attr('checked',true);
                        $('#searchform .search').focus();
                     });
                     $('#searchform .searchbutton').click(search);
                     $('#searchform .search').focus();
                     $('#searchform .search').keypress(function(e){
                        if(e.keyCode === 13) search();
                     });
                  },
                  error: function(e){;
                     alert(e.responseText);
                     $wm.loading.hide();
                  }
               });
            });
            $wm.loading.hide();
         }
      });
   };
   $wm.loadmenu();
   $('.menubutton.add').click(function(){
      $wm.addmenuitem.clear();
      $wm.addmenuitem.show();
   });
   $wm.loading = new function(){
      var elm = $('.wm-loading');
      var elmt = $('.wm-loading>div');
      function load(){
         elmt.text(elmt.text()+'.');
         if (elmt.text().length > 11)
            elmt.text('Загрузка');
      }
      var id = setInterval(load,500);
      this.show = function(){
         id = setInterval(load,500);
         elm.removeClass('hide');
      };
      this.hide = function(){
         clearInterval(id);
         elm.addClass('hide');
      };
   };
   $wm.editing = new function(){
      var elm = $('.wm-editing');
      this.show = function(){
         elm.removeClass('hide');
      };
      this.hide = function(){
         elm.addClass('hide');
      };
   };
   $wm.addmenuitem = new function(){
      var form = {
         name:$('.wm-additemform input.name'),
         sort:$('.wm-additemform input.sort'),
         parent:$('.wm-additemform select.parent'),
         tags:$('.wm-additemform input.tags'),
         html:$('.wm-additemform textarea.html')
      };
      var elm = $('.wm-additemform');
      $('.wm-close',elm).click(function(){
         $wm.addmenuitem.hide();
      });
      $('.wm-add',elm).click(function(){
         $wm.addmenuitem.add();
      });
      this.eathmenuitems = function(){
         $('option',form.parent).remove();
         form.parent.append('<option value="null">Главное меню</option>');
         $('.menuitem.dbitem').each(function(){
            var level = this.parentElement.getAttribute('level');
            if (level < 4)
               form.parent.append('<option value="'
                  +this.getAttribute('rowid')+'">'
                  +this.text
                  +'</option>'
               );
         });
      };
      this.show = function(){
         $wm.addmenuitem.eathmenuitems();
         $wm.editing.show();
         elm.removeClass('hide');
      };
      this.hide = function(){
         $wm.editing.hide();
         elm.addClass('hide');
      };
      this.add = function(data){
         if (form.name.val() && form.html.val()) {
            $wm.addmenuitem.hide();
            $wm.loading.show();
            $.ajax({
               type: 'POST', url: '/wm', contentType:'application/json; charset=utf-8',
               data: JSON.stringify({
                  call:"info.addmenu",
                  data:{
                     name:form.name.val(),
                     sort:form.sort.val(),
                     parent:form.parent.val(),
                     tags:form.tags.val(),
                     html:form.html.val()
                  }
               }),
               success: function(data){
                  location.reload();
               },
               error: function(e){
                  $wm.addmenuitem.show();
                  $wm.loading.hide();
                  alert(e.responseText);
               }
            });
         }
      };
      this.clear = function(){
         form.name.val('');
         form.sort.val('');
         form.parent.val('null');
         form.tags.val('');
         form.html.val('');
      };
   };
   $('.menubutton.editPage').click(function(){
      $wm.edititemform.set();
      $wm.edititemform.show();
   });
   $wm.edititemform = new function(){
      var form = {
         name:$('.wm-edititemform input.name'),
         sort:$('.wm-edititemform input.sort'),
         parent:$('.wm-edititemform select.parent'),
         tags:$('.wm-edititemform input.tags'),
         html:$('.wm-edititemform textarea.html')
      };
      var elm = $('.wm-edititemform');
      $('.wm-close',elm).click(function(){
         $wm.edititemform.hide();
      });
      $('.wm-save',elm).click(function(){
         $wm.edititemform.save();
      });
      $('.wm-del',elm).click(function(){
         $wm.edititemform.del();
      });
      this.eathmenuitems = function(){
         $('option',form.parent).remove();
         form.parent.append('<option value="null">Главное меню</option>');
         $('.menuitem.dbitem').each(function(){
            var level = this.parentElement.getAttribute('level');
            if (level < 4)
               form.parent.append('<option value="'
                  +this.getAttribute('rowid')+'">'
                  +this.text
                  +'</option>'
               );
         });
      };
      this.show = function(){
         $wm.edititemform.eathmenuitems();
         $wm.editing.show();
         elm.removeClass('hide');
      };
      this.hide = function(){
         $wm.editing.hide();
         elm.addClass('hide');
      };
      this.save = function(data){
         if (form.name.val() && form.html.val()) {
            $wm.edititemform.hide();
            $wm.loading.show();
            $.ajax({
               type: 'POST', url: '/wm', contentType:'application/json; charset=utf-8',
               data: JSON.stringify({
                  call:"info.savemenu",
                  data:{
                     _id:$('.menuitem.dbitem.active').attr('rowid'),
                     name:form.name.val(),
                     sort:form.sort.val(),
                     parent:form.parent.val(),
                     tags:form.tags.val(),
                     html:form.html.val()
                  }
               }),
               success: function(data){
                  location.reload();
               },
               error: function(e){
                  $wm.edititemform.show();
                  $wm.loading.hide();
                  alert(e.responseText);
               }
            });
         }
      };
      this.del = function(data){;
         $wm.edititemform.hide();
         $wm.loading.show();
         $.ajax({
            type: 'POST', url: '/wm', contentType:'application/json; charset=utf-8',
            data: JSON.stringify({
               call:"info.delmenu",
               data:{_id:$('.menuitem.dbitem.active').attr('rowid')}
            }),
            success: function(data){
               location.reload();
            },
            error: function(e){
               $wm.edititemform.show();
               $wm.loading.hide();
               alert(e.responseText);
            }
         });
      };
      this.set = function(){
         form.name.val($('.menuitem.dbitem.active').text());
         form.sort.val($('.menuitem.dbitem.active').attr('sort'));
         form.parent.val($('.menuitem.dbitem.active').attr('parent'));
         form.tags.val($('.menuitem.dbitem.active').attr('tags'));
         form.html.val($('#wm-content-editing').html());
      };
   };
   $wm.syntaxHighlight($('#wm-content'));
});