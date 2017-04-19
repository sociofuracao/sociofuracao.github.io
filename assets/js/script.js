if (location.protocol != 'https:' && window.location.href.indexOf('localhost') == -1) {
    location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}

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
    $('html, body').animate({scrollTop:$("#tvCap").offset().top}, 'slow');
}


$(document).ready(function(){
    var url = location.href;
    var id = url.substring(url.indexOf('#'));
    console.log(id);
    if(id == '#registro' || id == '#cadastro'){
        if(id == '#registro'){
            var id = '#login';
        }

        var alturaTela = $(document).height();
        var larguraTela = $(window).width();

        //colocando o fundo preto
        $('#mascara').css({'width':larguraTela,'height':alturaTela});
        $('#mascara').fadeIn(1000);
        $('#mascara').fadeTo("slow",0.8);

        var left = ($(window).width() /2) - ( $(id).width() / 2 );
        var top = ($(window).height() / 2) - ( $(id).height() / 2 );

        $(id).css({'top':top,'left':left});
        $(id).show();
    };

    $("#mascara").click( function(){
        $(this).hide();
        $(".window").hide();
    });

    $('.fechar').click(function(ev){
        ev.preventDefault();
        $("#mascara").hide();
        $(".window").hide();
    });
    /**** Funcção para acessar o sócio rei ****/
    $('#signupForm').submit(function(event) {
        event.preventDefault();

        var login    = $('#input-login');
        var password = $('#input-password');

        if(login.val() == ''){
            alert('Favor preenhcer o campo Login');
            login.focus();
            return false;
        }

        if(password.val() == ''){
            alert('Favor preenhcer o campo Senha');
            password.focus();
            return false;
        }

        $.ajax({
            url: 'https://publicador.everstreamplay.com/ws/user/get/',
            data: {email: login.val(), password: password.val(), callback: 'loga'},
            async: false,
            jsonpCallback: 'loga',
            dataType: 'jsonp',
        });
    });
});


function loga(data){
    if(data.error) {
        alert(data.error)
    }else if(parseInt(data.user.email.length) > 0 && parseInt(data.user.id.length) > 0){
        window.sessionStorage.setItem('user', JSON.stringify(data));
        window.location.href = "socio.html";
    }else{
        alert('Ocorreu um erro ao tentar recuperar seu acesso!')
    }
}