$(function(){
    $.ajax({
        type: 'GET',
        url: 'https://publicador.everstreamplay.com/ws/playlist/get_content',
        data: {id: 27, callback: 'getData'},
        async: false,
        jsonpCallback: 'getData',
        dataType: 'jsonp',
        success: function(data){
        },
        error: function(e){
            console.log(e)
        }
    });

});

function getData(data){
    var result = data.playlistresult
    if(data.error){
        alert(data.error);
    }else{
        var html = '',
            playlist_title = '',
            content_title = '',
            content_description = '',
            first_file = '',
            first_cover = '';

        for(i in result){
            var content = result[i].content;
            console.log(content)
            for(j in content){
                if(j == 0){
                    html += '<li class="content active" id="content-'+j+'">'
                    html += '   <a href=javascript:loadVideo("'+content[j].video_src+'","'+ content[j].content_cover+'","content-'+j+'")>';
                    html += '       <p class="data seta-direita">'+content[j].content_date+'</p>'
                    html += '       <p class="resumo">'+content[j].content_title+'</p>'
                    html += '       <p class="hide-description hide">'+content[j].content_description+'</p>';
                    html += '   </a>';
                    html += '</li>';
                    playlist_title  = content[0].playlist_title;
                    content_title   = content[0].content_title;
                    content_description = content[0].content_resume;
                    first_file = content[0].video_src;
                    first_cover = content[0].content_cover;
                }else{
                    html += '<li class="content" id="content-'+j+'">'
                    html += '   <a href=javascript:loadVideo("'+content[j].video_src+'","'+ content[j].content_cover+'","content-'+j+'")>';
                    html += '       <p class="data seta-direita">'+content[j].content_date+'</p>'
                    html += '       <p class="resumo">'+content[j].content_title+'</p>'
                    html += '       <p class="hide-description hide">'+content[j].content_description+'</p>';
                    html += '   </a>';
                    html += '</li>';
                }
            }
        }
        $('.programacao ul').html(html);

        $('#playlist_title').html(playlist_title);
        $('#content_title').html(content_title);
        $('#content_description').html(content_description);

        jwplayer('myVideo').setup({
            "key":"3q3t8iIybSxKCGGz24tDJPg0q1eMN2UwljLScelSCPY=",
            "abouttext":"produzido por everstream.com.br",
            "aboutlink":"http:\/\/www.everstream.com.br",
            "flashplayer":"\/\/ssl.p.jwpcdn.com\/player\/v\/7.6.1\/jwplayer.flash.swf",
            "androidhls":true,
            "hlshtml":false,
            "sources":{"file": first_file},
            "image":first_cover,
            "sharing":{
                "code":"%3Ciframe%20src%3D%22http%3A\/\/content.jwplatform.com\/players\/MEDIAID-ROkXCTWe.html%22%20width%3D%22480%22%20height%3D%22270%22%20frameborder%3D%220%22%20scrolling%3D%22auto%22%3E%3C\/iframe%3E",
                "heading":"Compartilhar",
                "link":null,
                "sites":["facebook","twitter","googleplus"]
            },
            "width":"100%",
            "aspectratio":"16:9",
            "autostart":"false"
        });
    }

}


function loadVideo(file, image, id_active) {
    var playerInstance = jwplayer("myVideo");
    playerInstance.load([{
        file: file,
        image: image
    }]);

    $('.programacao ul li').each(function(){
        el = $(this);
        if(el.attr('id') == id_active && !el.hasClass('active')){
            el.addClass('active')
        }else if(el.attr('id') != id_active){
            el.removeClass('active')
        }
        $('#content_title').html($('#'+id_active+' .resumo').text());
        $('#content_description').html($('#'+id_active+' p.hide-description').text());
    })

    playerInstance.play();
    $('html, body').animate({scrollTop:$("#myVideo").offset().top}, 'slow');
}
