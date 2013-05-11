$(window).bind('load', function(){
   $wm.loadmenu = function(){
      $.ajax({
         type: 'POST', url: '/wm', contentType:'application/json; charset=utf-8',
         data: JSON.stringify({call:"info.menu"}),
         success: function(data){
            $('.wm-mainmenu>.menucontainer').html(data);
            $('.menuitem.dbitem').click(function(){
               var self = this;
               $wm.loading.show();
               $('.menuitem').removeClass('active');
               $('.menuitem').removeAttr('contextmenu');
               $(self).addClass('active');
               $(self).attr('contextmenu','contextmenu');
               $.ajax({
                  type: 'POST', url: '/wm', contentType:'application/json; charset=utf-8',
                  data: JSON.stringify({
                     call:"info.getPage",
                     data:{_id:self.getAttribute('rowid')}
                  }),
                  success: function(data){
                     $('.menubutton.editPage.hide').removeClass('hide');
                     $('#wm-content').html(data);
                     $wm.syntaxHighlight();
                     $wm.loading.hide();
                  },
                  error: function(e){;
                     alert(e.responseText);
                     $wm.loading.hide();
                  }
               });
            });
            $('.menuitem.home').click(function(){
               $wm.loading.show();
               $('.menuitem').removeClass('active');
               $(self).addClass('active');
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
      var elm = $('.wm-additemform');
      $('.wm-close',elm).click(function(){
         $wm.addmenuitem.hide();
      });
      $('.wm-add',elm).click(function(){
         $wm.addmenuitem.add();
      });
      this.show = function(){
         $wm.editing.show();
         elm.removeClass('hide');
      };
      this.hide = function(){
         $wm.editing.hide();
         elm.addClass('hide');
      };
      this.add = function(data){
         var name=$('.wm-additemform input[name="name"]').val();
         var sort=$('.wm-additemform input[name="sort"]').val();
         var html=$('.wm-additemform textarea[name="html"]').val();
         if (name && html) {
            $wm.addmenuitem.hide();
            $wm.loading.show();
            $.ajax({
               type: 'POST', url: '/wm', contentType:'application/json; charset=utf-8',
               data: JSON.stringify({
                  call:"info.addmenu",
                  data:{name:name,sort:sort,html:html}
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
         $('.wm-additemform input[name="name"]').val('');
         $('.wm-additemform input[name="sort"]').val('');
         $('.wm-additemform textarea[name="html"]').val('');
      };
   };
   $('.menubutton.editPage').click(function(){
      $wm.edititemform.set();
      $wm.edititemform.show();
   });
   $wm.edititemform = new function(){
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
      this.show = function(){
         $wm.editing.show();
         elm.removeClass('hide');
      };
      this.hide = function(){
         $wm.editing.hide();
         elm.addClass('hide');
      };
      this.save = function(data){
         var name=$('.wm-edititemform input[name="name"]').val();
         var sort=$('.wm-edititemform input[name="sort"]').val();
         var html=$('.wm-edititemform textarea[name="html"]').val();
         if (name && html) {
            $wm.edititemform.hide();
            $wm.loading.show();
            $.ajax({
               type: 'POST', url: '/wm', contentType:'application/json; charset=utf-8',
               data: JSON.stringify({
                  call:"info.savemenu",
                  data:{
                     _id:$('.menuitem.dbitem.active').attr('rowid'),
                     name:name,sort:sort,html:html
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
         $('.wm-edititemform input[name="name"]')
            .val($('.menuitem.dbitem.active').text());
         $('.wm-edititemform input[name="sort"]')
            .val($('.menuitem.dbitem.active').attr('sort'));
         $('.wm-edititemform textarea[name="html"]')
            .val($('#wm-content').html());
      };
   };
   $wm.syntaxHighlight();
});