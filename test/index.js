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
   $wm.loadPage = function(){
      var item = $('.menuitem.dbitem.active');
      if (item.length > 0)
         $.ajax({
            type: 'POST', url: '/wm', contentType:'application/json; charset=utf-8',
            data: JSON.stringify({
               call:"info.getPage",
               data:{_id:item.attr('_id')}
            }),
            success: function(data){
               $('.menubutton.editPage.hide').removeClass('hide');
               item.text(data['name']);
               $('#wm-content').html(data['html']);
               $('#wm-content-editing').html(data['html']);
               $wm.syntaxHighlight($('#wm-content'));
               $wm.loading.hide();
            },
            error: function(e){;
               alert(e.responseText);
               $wm.loading.hide();
            }
         });
   };
   $wm.loadmenu = function(){
      function itemclick(){
         var self = this;
         var _id = self.getAttribute('_id');
         var submenu = $('div[_id="'+_id+'"]');
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
               data:{parent:_id,level:submenu.attr('level')}
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
         $wm.loadPage();
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
                  var view = $('#viewfromsearchresult');
                  var sf = $('#searchform');
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
                           function viewart(pt){
                              $.ajax({
                                 type: 'POST', url: '/wm',
                                 contentType:'application/json; charset=utf-8',
                                 data: JSON.stringify({
                                    call:"info.getPage",
                                    data:{_id:pt.attr('_id')}
                                 }),
                                 success: function(data){
                                    $('.view',view).html(data['html']);
                                    $('.view-header',view).text(data['name']);
                                    sr.addClass('hide');
                                    sf.addClass('hide');
                                    view.removeClass('hide');
                                    $wm.syntaxHighlight(view);
                                    $wm.loading.hide();
                                 },
                                 error: function(e){;
                                    alert(e.responseText);
                                    $wm.loading.hide();
                                 }
                              });
                           };
                           $('#searchresult .readmore').click(function(){
                              $wm.loading.show();
                              var pt = $(this.parentElement.parentElement);
                              viewart(pt);
                           });
                           $('#searchresult .a-header').click(function(){
                              $wm.loading.show();
                              var pt = $(this.parentElement);
                              viewart(pt);
                           });
                           $('#viewfromsearchresult .backtosearch')
                           .click(function(){
                              $wm.loading.show();
                              view.addClass('hide');
                              sr.removeClass('hide');
                              sf.removeClass('hide');
                              $wm.loading.hide();
                           });
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
            $('.menuitem.images').click(function(){
               $wm.loading.show();
               $('#menucontainer>div').addClass('hide');
               $('.menuitem').removeClass('active');
               $(this).addClass('active');
               $.ajax({
                  type: 'POST', url: '/wm', contentType:'application/json; charset=utf-8',
                  data: JSON.stringify({
                     call:"info.getImages"
                  }),
                  success: function(data){
                     $('.menubutton.editPage').addClass('hide');
                     $('#wm-content').html(data);
                     $('#wm-content-editing').html('');
                     $wm.loading.hide();
                     $('#wm-content .info .del').click(function(){
                        $wm.loading.show();
                        var self = $(this);
                        $.ajax({
                           type: 'POST', url: '/wm', contentType:'application/json; charset=utf-8',
                           data: JSON.stringify({
                              call:"info.delImage",
                              data:{_id:self.attr('_id')}
                           }),
                           success: function(data){
                              self.parent().parent().remove();
                              $wm.loading.hide();
                           },
                           error: function(e){;
                              alert(e.responseText);
                              $wm.loading.hide();
                           }
                        });
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
   function appSelection(elm,before,after){
      var de = elm.get(0);
      var s = de.selectionStart;
      var e = de.selectionEnd;
      var c = e-s;
      if (c > 0 && c < 10000){
         var v = de.value;
         var nv = v.substr(s,c);
         if (nv[0] !== '\n') before = before+'\n';
         if (nv[nv.length-1] !== '\n') after = '\n'+after;
         if (s > 0 && v[s-1] !== '\n') before = '\n'+before;
         if (e < v.length && v[e] !== '\n') after = after+'\n';
         nv = before+$wm.escapeHTML(nv)+after;
         de.value = v.substr(0,s)+nv+v.substr(e,v.length-1);
         de.selectionStart = de.selectionEnd = s + nv.length+1;
         de.focus();
      } else {
         if (c > 10000)
            alert('Слишком большой текст для подсветки синтаксиса!');
         de.focus();
      }
   }
   /* доделать */
   function EditerSetLength(){
      $('.length',elm).html('<div></div>'+(this.value.length||''));
   }
   function EditerSetSelLength(){
      
   }
   /**/
   function appToolbarfunc(elm){
      var edt = $('.html',elm);
      $('.codejs',elm).click(function(){
         appSelection(edt,'<span class="wm-code js">','</span>');
      });
      $('.codejson',elm).click(function(){
         appSelection(edt,'<span class="wm-code json">','</span>');
      });
      $('.codehttp',elm).click(function(){
         appSelection(edt,'<span class="wm-code http">','</span>');
      });
      $('.codecmd',elm).click(function(){
         appSelection(edt,'<span class="wm-code cmd">','</span>');
      });
      edt.keyup(function(){
         $('.length',elm).html('<div></div>'+(this.value.length||''));
      });
      edt.change(function(){
         $('.length',elm).html('<div></div>'+(this.value.length||''));
      });
   }
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
      appToolbarfunc(elm);
      this.eathmenuitems = function(){
         $('option',form.parent).remove();
         form.parent.append('<option value="null">Главное меню</option>');
         $('.menuitem.dbitem').each(function(){
            var level = this.parentElement.getAttribute('level');
            if (level < 4)
               form.parent.append('<option value="'
                  +this.getAttribute('_id')+'">'
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
      appToolbarfunc(elm);
      this.eathmenuitems = function(){
         $('option',form.parent).remove();
         form.parent.append('<option value="null">Главное меню</option>');
         $('.menuitem.dbitem').each(function(){
            var level = this.parentElement.getAttribute('level');
            if (level < 4)
               form.parent.append('<option value="'
                  +this.getAttribute('_id')+'">'
                  +this.text
                  +'</option>'
               );
         });
         form.parent.val($('.menuitem.dbitem.active').attr('parent'));
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
                     _id:$('.menuitem.dbitem.active').attr('_id'),
                     name:form.name.val(),
                     sort:form.sort.val(),
                     parent:form.parent.val(),
                     tags:form.tags.val(),
                     html:form.html.val()
                  }
               }),
               success: function(data){
                  $wm.loadPage();
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
               data:{_id:$('.menuitem.dbitem.active').attr('_id')}
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
         form.tags.val($('.menuitem.dbitem.active').attr('tags'));
         form.html.val($('#wm-content-editing').html());
      };
   };
   $wm.syntaxHighlight($('#wm-content'));
});