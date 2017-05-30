$(document).ready(function($) {
    $(function() {
        $('#fileupload').fileupload({
            dataType: 'json',
            add: function(e, data) {
                data.formData = data.files[0];
                // console.log(data);
                data.submit();
            },
            progressall: function(e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#uploadbar').css('width', progress + '%');
            },
            done: function(e, data) {
                console.dir(data);
                // $.each(data.result.files, function(index, file) {
                //     $('<p/>').text(file.name).appendTo(document.body);
                //     $('<img/>').attr('src', file.mediumUrl).appendTo(document.body);
                // });
                location.reload();
            }
        });
    });
    $('#button-upload').click(function(event) {
        // console.log(1);
        $('#fileupload').click();
    });
    $('.button-close').click(function(event) {
        $('#model-close').modal();
        $('#model-close').modal('show');
        $('.button-delete-yes')[0].dataset.url = this.dataset.url;
    })
    $('.button-delete-yes').click(function(event) {
        /* Act on the event */
        $('#model-close').modal('hide');
        $.ajax({
                url: this.dataset.url,
                type: 'DELETE'
            })
            .done(function() {
                console.log("success");
                location.reload();
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });
    });
});
