$(function(){

    $(document).on('click', '#admire', function(e){
        e.preventDefault();

        var user_id = $('#user_id').val();
        $.ajax({
            type: 'POST',
            url: "/admire/" + user_id,
            success: function(data) {
                $('#admire').removeClass('btn-default').addClass('btn-primary')
                    .html('Admiring').attr('id', 'unadmire')
            },
            error: function(data){
                console.log(data);
            }
        })
    })


    $(document).on('click', '#unadmire', function(e){
        e.preventDefault();

        var user_id = $('#user_id').val();
        $.ajax({
            type: 'POST',
            url: "/unadmire/" + user_id,
            success: function(data) {
                $('#unadmire').removeClass('btn-primary btn-danger').addClass('btn-default')
                    .html('Admire').attr('id', 'admire')
            },
            error: function(data){
                console.log(data);
            }
        })
    });

    $(document).on('mouseenter', '#unadmire', function(e){
        $(this).removeClass('btn-primary').addClass('btn-danger').html('Unadmire');
    });

    $(document).on('mouseleave', '#unadmire', function(e){
        $(this).removeClass('btn-danger').addClass('btn-primary').html('Admiring');
    });





})