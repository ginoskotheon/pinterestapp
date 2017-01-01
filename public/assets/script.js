

  // $("#sub").on('click', function(){
  //   var src = $('#new').val();
  //   console.log(src);
  //   $.ajax({
  //     type: 'POST',
  //     url: '/',
  //     data: src,
  //     success: function(data) {
  //       console.log('done!');
  //     }
  //   });
  //
  //   $('.mygrid').append('<div class="grid-item"><img src="'+src+'" /></div>');
  // });

$(document).ready(function(){

  $('#addpic').on('click', function(){

    $('.myModal').show();
  });

  $('.close').on('click', function(){
    $('.myModal').hide();
  });



  $('#src').change(function(){
    var picsrc = $(this).val();
    $('#blah').attr('src', picsrc).width(400);
  });



  $('.delete').on('click', function(){
    // console.log($(this).text());
    var src = $(this).siblings('#thetitle').text();
    console.log(src);



    var csrftoken = $('#token').val()
    $("body").bind("ajaxSend", function(elm, xhr, s){
     if (s.type == "DELETE") {
        xhr.setRequestHeader('X-CSRF-Token', csrftoken);
     }
  });

    var item = {
      url: src,
      _csrf: csrftoken
    }
    console.log(item);
    $.ajax({
      type: 'DELETE',
      url: '/mymacs/' + src,
      data: item,
      success: function(data){
        location.reload();
      }
    });
  });





});




// init Masonry
var $grid = $('.grid').imagesLoaded(function() {
  $grid.masonry({
    itemSelector: '.grid-item',
    percentPosition: true,
    columnWidth: '.grid-sizer'
  });
});
// var $grid = $('.grid').masonry({
//   percentPosition: true,
//   itemSelector: '.grid-item',
//   columnWidth: '.grid-sizer',
//
//
// });


// layout Isotope after each image loads
// $grid.imagesLoaded().progress( function() {
//   $grid.masonry();
// });
