#!/usr/bin/env node

var jade = require("jade");
var fs = require("fs");

var tplFileName = 'page_index.jade';

var poster_url = "img/posters/";

var films = [
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
    { id: 1, title: "Дом 2", season: 0, episode: 648, poster: poster_url + 'pict_3.jpg', duration: 2932, start: "2014-08-11T20:00:00.000Z", url: "#" }
];


var news_list = [
    { cast_name: "Дом 2", date: "", title: "Фанаты проекта «Дом-2» поняли, зачем на шоу находился Сергей Сичкарь", img_url: null },
    { cast_name: "Дом 2", date: "", title: "Фанаты проекта «Дом-2» поняли, зачем на шоу находился Сергей Сичкарь", img_url: (poster_url + 'news_img_1.jpg') },
    { cast_name: "Физрук", date: "", title: "Физрук женится на Тане: как может закончится 2 сезон", img_url: null },
    { cast_name: "Физрук", date: "", title: "Физрук женится на Тане: как может закончится 2 сезон", img_url: (poster_url + 'news_img_1.jpg') },
    { cast_name: "Дом 2", date: "", title: "Саша Мамаева похудела или нет во втором сезоне?", img_url: null },
    { cast_name: "Дом 2", date: "", title: "Саша Мамаева похудела или нет во втором сезоне?", img_url: null },
    { cast_name: "Дом 2", date: "", title: "Саша Мамаева похудела или нет во втором сезоне?", img_url: null },
    { cast_name: "Физрук", date: "", title: "Ольга Бузова пригласила крестную Тани Людмилу Милевскую на проект", img_url: null },
    { cast_name: "Физрук", date: "", title: "Ольга Бузова пригласила крестную Тани Людмилу Милевскую на проект", img_url: null },
    { cast_name: "Дом 2", date: "", title: "Фанаты проекта «Дом-2» поняли, зачем на шоу находился Сергей Сичкарь", img_url: null }
];

var chat_items = [
    { user: { id: 1, name: "Мария Авдевина"}, text: 'Если ты счастлив и осознаешь это, выругайся.' },
    { user: { id: 2, name: "Андрей Федорцов"}, text: 'Сынок, ты говоришь «жополиз» так, как будто это что-то плохое.' },
    { user: { id: 3, name: "Стас Старовойтов"}, text: 'Радиация убивает только тех, кто ее боится.' },
    { user: { id: 4, name: "Андрей Базайкин"}, text: 'Убить босса?! Поднимется ли у меня рука исполнить американскую мечту?' },
    { user: { id: 1, name: "Мария Авдевина"}, text: 'Если ты счастлив и осознаешь это, выругайся.' },
    { user: { id: 2, name: "Андрей Федорцов"}, text: 'Сынок, ты говоришь «жополиз» так, как будто это что-то плохое.' },
    { user: { id: 3, name: "Стас Старовойтов"}, text: 'Радиация убивает только тех, кто ее боится.' },
    { user: { id: 4, name: "Андрей Базайкин"}, text: 'Убить босса?! Поднимется ли у меня рука исполнить американскую мечту?' },
    { user: { id: 1, name: "Мария Авдевина"}, text: 'Если ты счастлив и осознаешь это, выругайся.' },
    { user: { id: 2, name: "Андрей Федорцов"}, text: 'Сынок, ты говоришь «жополиз» так, как будто это что-то плохое.' },
    { user: { id: 3, name: "Стас Старовойтов"}, text: 'Радиация убивает только тех, кто ее боится.' },
    { user: { id: 4, name: "Андрей Базайкин"}, text: 'Убить босса?! Поднимется ли у меня рука исполнить американскую мечту?' },
    { user: { id: 1, name: "Мария Авдевина"}, text: 'Если ты счастлив и осознаешь это, выругайся.' },
    { user: { id: 2, name: "Андрей Федорцов"}, text: 'Сынок, ты говоришь «жополиз» так, как будто это что-то плохое.' },
    { user: { id: 3, name: "Стас Старовойтов"}, text: 'Радиация убивает только тех, кто ее боится.' },
    { user: { id: 4, name: "Андрей Базайкин"}, text: 'Убить босса?! Поднимется ли у меня рука исполнить американскую мечту?' }

];

var chat_users = [
    { id: 1, name: "Мария Авдевина", is_away: false },
    { id: 2, name: "Андрей Федорцов", is_away: false },
    { id: 3, name: "Стас Старовойтов", is_away: false },
    { id: 4, name: "Андрей Базайкин", is_away: true },
    { id: 1, name: "Мария Авдевина", is_away: true },
    { id: 2, name: "Андрей Федорцов", is_away: true },
    { id: 3, name: "Стас Старовойтов", is_away: false },
    { id: 4, name: "Андрей Базайкин", is_away: false },
    { id: 1, name: "Мария Авдевина", is_away: false },
    { id: 2, name: "Андрей Федорцов", is_away: false },
    { id: 3, name: "Стас Старовойтов", is_away: true },
    { id: 4, name: "Андрей Базайкин", is_away: true }

];

var top_stars = [
    {}
];

var top_users = [

];

var locals = { 'films': films, 'news_list': news_list, 'chat_items': chat_items, 'chat_users': chat_users };

var html = jade.renderFile(tplFileName, locals);

var outputFileName = "page_index.html";

fs.writeFile(outputFileName, html, function(err) {
    if( err )
        throw err;
    console.log('Template rendered in file "' + outputFileName + '"!');
});