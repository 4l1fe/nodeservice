var img_url = "img/page_show1/";
var poster_url = img_url;
var persons_img_url = img_url + "persons/";

(function (){
    var prepare = function ($) {
        $.params("casts", [
            { id: 1, season: 2, episode: 7, poster: poster_url + 'cast_img1.jpg', duration: 2932, url: "#" },
            { id: 1, season: 1, episode: 16, poster: poster_url + 'cast_img2.jpg', duration: 3107, url: "#" },
            { id: 1, season: null, episode: 648, poster: poster_url + 'cast_img3.jpg', duration: 2932, url: "#" },
            { id: 1, season: 1, episode: 17, poster: poster_url + 'cast_img4.jpg', duration: 2932, url: "#" },
            { id: 1, season: 1, episode: 16, poster: poster_url + 'cast_img5.jpg', duration: 3107, url: "#" },
            { id: 1, season: null, episode: 648, poster: poster_url + 'cast_img6.jpg', duration: 2932, url: "#" },
            { id: 1, season: 2, episode: 7, poster: poster_url + 'cast_img1.jpg', duration: 2932, url: "#" },
            { id: 1, season: 1, episode: 16, poster: poster_url + 'cast_img2.jpg', duration: 3107, url: "#" },
            { id: 1, season: null, episode: 648, poster: poster_url + 'cast_img3.jpg', duration: 2932, url: "#" },
            { id: 1, season: 1, episode: 17, poster: poster_url + 'cast_img4.jpg', duration: 2932, url: "#" },
            { id: 1, season: 1, episode: 16, poster: poster_url + 'cast_img5.jpg', duration: 3107, url: "#" },
            { id: 1, season: null, episode: 648, poster: poster_url + 'cast_img6.jpg', duration: 2932, url: "#" },
            { id: 1, season: 2, episode: 7, poster: poster_url + 'cast_img1.jpg', duration: 2932, url: "#" },
            { id: 1, season: 1, episode: 16, poster: poster_url + 'cast_img2.jpg', duration: 3107, url: "#" },
            { id: 1, season: null, episode: 648, poster: poster_url + 'cast_img3.jpg', duration: 2932, url: "#" },
            { id: 1, season: 1, episode: 17, poster: poster_url + 'cast_img4.jpg', duration: 2932, url: "#" },
            { id: 1, season: 1, episode: 16, poster: poster_url + 'cast_img5.jpg', duration: 3107, url: "#" },
            { id: 1, season: null, episode: 648, poster: poster_url + 'cast_img6.jpg', duration: 2932, url: "#" }]);
        $.params("news_list", [
            { cast_name: "Человек года", date: "2014-06-07T20:00:00.000Z", title: 'У Саши и Элины есть договоренность на счет приза в конкурсе "Человек года"', img_url: (img_url + "news_big_poster.jpg"), text: 'До финала "Человека года" осталось совсем немного времени и с каждым днем напряжение среди ребят чувствуется все больше и больше. Особенно нервничает Саша Задойнов...' },
            { cast_name: "Дом 2", date: "2014-08-07T20:00:00.000Z", title: "Фанаты проекта «Дом-2» поняли, зачем на шоу находился Сергей Сичкарь", img_url: null },
            { cast_name: "Дом 2", date: "2014-08-07T20:00:00.000Z", title: "Фанаты проекта «Дом-2» поняли, зачем на шоу находился Сергей Сичкарь", img_url: null },
            { cast_name: "Дом 2", date: "2014-06-31T20:00:00.000Z", title: "Фанаты проекта «Дом-2» поняли, зачем на шоу находился Сергей Сичкарь", img_url: (poster_url + 'cast_news_img1.jpg') },
            { cast_name: "Физрук", date: "2014-06-31T20:00:00.000Z", title: "Физрук женится на Тане: как может закончится 2 сезон", img_url: null },
            { cast_name: "Физрук", date: "2014-08-07T20:00:00.000Z", title: "Физрук женится на Тане: как может закончится 2 сезон", img_url: (poster_url + 'cast_news_img1.jpg') },
            { cast_name: "Дом 2", date: "2014-08-07T20:00:00.000Z", title: "Саша Мамаева похудела или нет во втором сезоне?", img_url: null },
            { cast_name: "Дом 2", date: "2014-08-07T20:00:00.000Z", title: "Саша Мамаева похудела или нет во втором сезоне?", img_url: null },
            { cast_name: "Дом 2", date: "2014-08-07T20:00:00.000Z", title: "Саша Мамаева похудела или нет во втором сезоне?", img_url: null },
            { cast_name: "Физрук", date: "2014-08-07T20:00:00.000Z", title: "Ольга Бузова пригласила крестную Тани Людмилу Милевскую на проект", img_url: null },
            { cast_name: "Физрук", date: "2014-08-07T20:00:00.000Z", title: "Ольга Бузова пригласила крестную Тани Людмилу Милевскую на проект", img_url: null }]);
        $.params("cast_def", {title: 'Физрук', rating: 6.68, votes_count: 1313, release_date: "2013-08-07T20:00:00.000Z", country: 'Россия', genre: 'Комедия', pg_rating: '16+',
            description: 'Это история о столкновении двух времен: «лихих» 90-х и «стабильных» десятых. Главный герой ' +
                'Фома всю жизнь был «правой рукой» влиятельного человека с полукриминальным прошлым. Когда «хозяин» выгнал его на пенсию, ' +
                'Фома решил любым способом вернуться обратно. Сначала казалось, что все будет просто: подобраться к сыну бывшего босса, прогнуться, ' +
                'напомнить о себе и вернуться в дело. Но план Фомы рушится в первый же день. В школе ему приходится задержаться надолго. Попав в абсолютно ' +
                'незнакомый мир детей и учителей, который кардинально отличается от привычного ему круга, Фома не только меняет свою жизнь, но и меняется сам.',
            poster: poster_url + 'cast_poster.jpg'

        });
        $.params("page_conf", {top_splash_img: img_url+'top_title_bg.png', left_splash_img: img_url + 'left_title_bg.jpg', right_splash_img: img_url+'right_title_bg.jpg'});
    };

    module.exports = prepare;

}).call(this);