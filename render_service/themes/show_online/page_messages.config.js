var img_url = "img/page_messages/";
var avatars_url = img_url;
var poster_url = 'img/posters/';

(function (){
    var prepare = function ($) {
        $.params("msg_items", [
            { user: { id: 3, name: "Lady GAGA", avatar: avatars_url + 'user3.jpg' }, text: 'Nice sense of humor! but Ellen has lost it in recent years, she`s not so upbeat any more and gives that goofy empty smile every time someone makes a joke' , created: "2014-10-07T20:00:00.000Z" },
            { user: { id: 2, name: "Smart Boy", avatar: avatars_url + 'user2.jpg' }, text: 'Ellen has lost it in recent years, she`s not so upbeat any more and gives that goofy empty smile every time someone makes a joke', created: "2014-10-07T20:00:00.000Z" },
            { user: { id: 3, name: "Lady GAGA", avatar: avatars_url + 'user3.jpg' }, text: 'Nice sense of humor! but Ellen has lost it in recent years, she`s not so upbeat any more and gives that goofy empty smile every time someone makes a joke' , created: "2014-10-07T20:00:00.000Z" },
            { user: { id: 2, name: "Smart Boy", avatar: avatars_url + 'user2.jpg' }, text: 'Ellen has lost it in recent years, she`s not so upbeat any more and gives that goofy empty smile every time someone makes a joke', created: "2014-10-07T20:00:00.000Z" },
            { user: { id: 3, name: "Lady GAGA", avatar: avatars_url + 'user3.jpg' }, text: 'Nice sense of humor! but Ellen has lost it in recent years, she`s not so upbeat any more and gives that goofy empty smile every time someone makes a joke' , created: "2014-10-07T20:00:00.000Z" },
            { user: { id: 2, name: "Smart Boy", avatar: avatars_url + 'user2.jpg' }, text: 'Ellen has lost it in recent years, she`s not so upbeat any more and gives that goofy empty smile every time someone makes a joke', created: "2014-10-07T20:00:00.000Z" },
            { user: { id: 3, name: "Lady GAGA", avatar: avatars_url + 'user3.jpg' }, text: 'Nice sense of humor! but Ellen has lost it in recent years, she`s not so upbeat any more and gives that goofy empty smile every time someone makes a joke' , created: "2014-10-07T20:00:00.000Z" },
            { user: { id: 2, name: "Smart Boy", avatar: avatars_url + 'user2.jpg' }, text: 'Ellen has lost it in recent years, she`s not so upbeat any more and gives that goofy empty smile every time someone makes a joke', created: "2014-10-07T20:00:00.000Z" },
            { user: { id: 3, name: "Lady GAGA", avatar: avatars_url + 'user3.jpg' }, text: 'Nice sense of humor! but Ellen has lost it in recent years, she`s not so upbeat any more and gives that goofy empty smile every time someone makes a joke' , created: "2014-10-07T20:00:00.000Z" },
            { user: { id: 2, name: "Smart Boy", avatar: avatars_url + 'user2.jpg' }, text: 'Ellen has lost it in recent years, she`s not so upbeat any more and gives that goofy empty smile every time someone makes a joke', created: "2014-10-07T20:00:00.000Z" },
            { user: { id: 3, name: "Lady GAGA", avatar: avatars_url + 'user3.jpg' }, text: 'Nice sense of humor! but Ellen has lost it in recent years, she`s not so upbeat any more and gives that goofy empty smile every time someone makes a joke' , created: "2014-10-07T20:00:00.000Z" },
            { user: { id: 2, name: "Smart Boy", avatar: avatars_url + 'user2.jpg' }, text: 'Ellen has lost it in recent years, she`s not so upbeat any more and gives that goofy empty smile every time someone makes a joke', created: "2014-10-07T20:00:00.000Z" }]);
        $.params("users", [
            { id: 1, name: "THE thieF", avatar: avatars_url + 'user1.jpg' },
            { id: 2, name: "Smart Boy", avatar: avatars_url + 'user2.jpg' },
            { id: 3, name: "Lady GAGA", avatar: avatars_url + 'user3.jpg', is_selected: true },
            { id: 4, name: "THE thieF", avatar: avatars_url + 'user4.jpg' },
            { id: 1, name: "Евгения", avatar: null },
            { id: 2, name: "Samantha White", avatar: avatars_url + 'user5.jpg' },
            { id: 3, name: "THE thieF", avatar: avatars_url + 'user4.jpg' },
            { id: 4, name: "Евгения", avatar: null },
            { id: 1, name: "Samantha White", avatar: avatars_url + 'user5.jpg' },
            { id: 1, name: "THE thieF", avatar: avatars_url + 'user1.jpg' },
            { id: 2, name: "Smart Boy", avatar: avatars_url + 'user2.jpg' },
            { id: 3, name: "Lady GAGA", avatar: avatars_url + 'user3.jpg' },
            { id: 4, name: "THE thieF", avatar: avatars_url + 'user4.jpg' },
            { id: 1, name: "Евгения", avatar: null },
            { id: 2, name: "Samantha White", avatar: avatars_url + 'user5.jpg' },
            { id: 3, name: "THE thieF", avatar: avatars_url + 'user4.jpg' },
            { id: 4, name: "Евгения", avatar: null },
            { id: 1, name: "Samantha White", avatar: avatars_url + 'user5.jpg' }]);
        $.params("recomended_casts", [
            { id: 1, title: "Физрук", season: 1, episode: 17, poster: poster_url + 'pict_1.jpg', duration: 2932, start: "2014-08-12T20:00:00.000Z", url: "#" },
            { id: 1, title: "Физрук", season: 1, episode: 16, poster: poster_url + 'pict_2.jpg', duration: 3107, start: "2014-08-12T20:00:00.000Z", url: "#" },
            { id: 1, title: "Дом 2", season: 0, episode: 648, poster: poster_url + 'pict_3.jpg', duration: 2932, start: "2014-08-11T20:00:00.000Z", url: "#" },
            { id: 1, title: "Физрук", season: 1, episode: 17, poster: poster_url + 'pict_1.jpg', duration: 2932, start: "2014-08-12T20:00:00.000Z", url: "#" },
            { id: 1, title: "Физрук", season: 1, episode: 16, poster: poster_url + 'pict_2.jpg', duration: 3107, start: "2014-08-12T20:00:00.000Z", url: "#" },
            { id: 1, title: "Дом 2", season: 0, episode: 648, poster: poster_url + 'pict_3.jpg', duration: 2932, start: "2014-08-11T20:00:00.000Z", url: "#" },
            { id: 1, title: "Дом 2", season: 0, episode: 647, poster: poster_url + 'pict_4.jpg', duration: 3107, start: "2014-08-10T20:00:00.000Z", url: "#" },
            { id: 1, title: "Физрук", season: 1, episode: 15, poster: poster_url + 'pict_5.jpg', duration: 2932, start: "2014-08-10T20:00:00.000Z", url: "#" },
            { id: 1, title: "Физрук", season: 1, episode: 14, poster: poster_url + 'pict_6.jpg', duration: 3107, start: "2014-08-08T20:00:00.000Z", url: "#" },
            { id: 1, title: "Дом 2", season: 0, episode: 647, poster: poster_url + 'pict_4.jpg', duration: 3107, start: "2014-08-10T20:00:00.000Z", url: "#" },
            { id: 1, title: "Физрук", season: 1, episode: 15, poster: poster_url + 'pict_5.jpg', duration: 2932, start: "2014-08-10T20:00:00.000Z", url: "#" },
            { id: 1, title: "Физрук", season: 1, episode: 14, poster: poster_url + 'pict_6.jpg', duration: 3107, start: "2014-08-08T20:00:00.000Z", url: "#" },
            { id: 1, title: "Физрук", season: 1, episode: 17, poster: poster_url + 'pict_1.jpg', duration: 2932, start: "2014-08-12T20:00:00.000Z", url: "#" },
            { id: 1, title: "Физрук", season: 1, episode: 16, poster: poster_url + 'pict_2.jpg', duration: 3107, start: "2014-08-12T20:00:00.000Z", url: "#" },
            { id: 1, title: "Дом 2", season: 0, episode: 648, poster: poster_url + 'pict_3.jpg', duration: 2932, start: "2014-08-11T20:00:00.000Z", url: "#" },
            { id: 1, title: "Физрук", season: 1, episode: 17, poster: poster_url + 'pict_1.jpg', duration: 2932, start: "2014-08-12T20:00:00.000Z", url: "#" },
            { id: 1, title: "Физрук", season: 1, episode: 16, poster: poster_url + 'pict_2.jpg', duration: 3107, start: "2014-08-12T20:00:00.000Z", url: "#" },
            { id: 1, title: "Дом 2", season: 0, episode: 648, poster: poster_url + 'pict_3.jpg', duration: 2932, start: "2014-08-11T20:00:00.000Z", url: "#" }]);
        $.params("current_user", { id: 2, name: "Smart Boy", avatar: avatars_url + 'user2.jpg' });
    };

    module.exports = prepare;

}).call(this);