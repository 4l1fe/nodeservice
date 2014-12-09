(function () {
    var conf = {}

    conf.static = 'http://cdn.serialov.tv/s/themes/show_online_full/'
    conf.api_url = '/api/'

    conf.js = conf.static + "js/"
    conf.img = conf.static + "img/"
    conf.css = conf.static + "css/"
    conf.tpl_url = "/tpl/"

    conf.content_url = "/content/"
    conf.content_media = conf.content_url + "media/"
    conf.content_users = conf.content_url + "users/"
    conf.content_persons = conf.content_url + "persons/"

    conf.vast = {
        'rolls': {
            'pre': "http://ads.adfox.ru/175105/getCode?p1=brkzd&p2=emxn&pfc=a&pfb=a&plp=a&pli=a&pop=a&puid1=&puid2=&puid3=&puid22=&puid25=&puid27=&puid51=&puid52=",
            'pause': "http://ads.adfox.ru/175105/getCode?p1=brkzf&p2=emxq&pfc=a&pfb=a&plp=a&pli=a&pop=a&puid1=&puid2=&puid3=&puid22=&puid25=&puid27=&puid51=&puid52=",
            'post': 'http://ads.adfox.ru/175105/getCode?p1=brkze&p2=emxo&pfc=a&pfb=a&plp=a&pli=a&pop=a&puid1=&puid2=&puid3=&puid22=&puid25=&puid27=&puid51=&puid52='
        },
        skip: 5
    }


    window.mi_conf = conf;
}).call(this)
