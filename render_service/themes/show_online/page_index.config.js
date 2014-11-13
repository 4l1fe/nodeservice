var img_url = "img/";
var poster_url = img_url + "posters/";
var persons_img_url = img_url + "persons/";

(function (){
    var prepare = function ($) {
        $.params("films", [
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
        $.params("news_list", [
            { cast_name: "Человек года", date: "2014-06-07T20:00:00.000Z", title: 'У Саши и Элины есть договоренность на счет приза в конкурсе "Человек года"', img_url: (img_url + "news-poster_error.jpg"), text: 'До финала "Человека года" осталось совсем немного времени и с каждым днем напряжение среди ребят чувствуется все больше и больше. Особенно нервничает Саша Задойнов...' },
            { cast_name: "Дом 2", date: "2014-08-07T20:00:00.000Z", title: "Фанаты проекта «Дом-2» поняли, зачем на шоу находился Сергей Сичкарь", img_url: null },
            { cast_name: "Дом 2", date: "2014-08-07T20:00:00.000Z", title: "Фанаты проекта «Дом-2» поняли, зачем на шоу находился Сергей Сичкарь", img_url: null },
            { cast_name: "Дом 2", date: "2014-06-31T20:00:00.000Z", title: "Фанаты проекта «Дом-2» поняли, зачем на шоу находился Сергей Сичкарь", img_url: (poster_url + 'news_img_1.jpg') },
            { cast_name: "Физрук", date: "2014-06-31T20:00:00.000Z", title: "Физрук женится на Тане: как может закончится 2 сезон", img_url: null },
            { cast_name: "Физрук", date: "2014-08-07T20:00:00.000Z", title: "Физрук женится на Тане: как может закончится 2 сезон", img_url: (poster_url + 'news_img_1.jpg') },
            { cast_name: "Дом 2", date: "2014-08-07T20:00:00.000Z", title: "Саша Мамаева похудела или нет во втором сезоне?", img_url: null },
            { cast_name: "Дом 2", date: "2014-08-07T20:00:00.000Z", title: "Саша Мамаева похудела или нет во втором сезоне?", img_url: null },
            { cast_name: "Дом 2", date: "2014-08-07T20:00:00.000Z", title: "Саша Мамаева похудела или нет во втором сезоне?", img_url: null },
            { cast_name: "Физрук", date: "2014-08-07T20:00:00.000Z", title: "Ольга Бузова пригласила крестную Тани Людмилу Милевскую на проект", img_url: null },
            { cast_name: "Физрук", date: "2014-08-07T20:00:00.000Z", title: "Ольга Бузова пригласила крестную Тани Людмилу Милевскую на проект", img_url: null }]);
        $.params("chat_items", [
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
        ]);
        $.params("chat_users", [
            { id: 1, name: "Мария Авдевина", online: false },
            { id: 2, name: "Андрей Федорцов", online: false },
            { id: 3, name: "Стас Старовойтов", online: false },
            { id: 4, name: "Андрей Базайкин", online: true },
            { id: 1, name: "Мария Авдевина", online: true },
            { id: 2, name: "Андрей Федорцов", online: true },
            { id: 3, name: "Стас Старовойтов", online: false },
            { id: 4, name: "Андрей Базайкин", online: false },
            { id: 1, name: "Мария Авдевина", online: false },
            { id: 2, name: "Андрей Федорцов", online: false },
            { id: 3, name: "Стас Старовойтов", online: true },
            { id: 4, name: "Андрей Базайкин", online: true }]);
        $.params("top_stars", [
            { id: 1, name: "Андрей Крыжный", rating: 119.5, cast_name: "Физрук", role: "Банан", img_url: persons_img_url + "top_star_1.jpg" },
            { id: 2, name: "Сильвестр Сталлоне", rating: 119.2, img_url: persons_img_url + "top_star_2.jpg" },
            { id: 3, name: "Джейсон Стэйтем", rating: 119.1, img_url: persons_img_url + "top_star_3.jpg" },
            { id: 4, name: "Дольф Лундгрен", rating: 119.0, img_url: persons_img_url + "top_star_4.jpg" },
            { id: 5, name: "Жан-Клод Ван Дамм", rating: 118.8, img_url: persons_img_url + "top_star_5.jpg" },
            { id: 6, name: "Терри Крюс", rating: 117.2, img_url: persons_img_url + "top_star_6.jpg" }]);
        $.params("top_users", [
            { id: 1, name: "Крис Прэтт", rating: 119.5, img_url: persons_img_url + "top_user_1.jpg" },
            { id: 2, name: "Зои Салдана", rating: 119.2, img_url: persons_img_url + "top_user_2.jpg" },
            { id: 3, name: "Дэйв Батиста", rating: 119.1, img_url: persons_img_url + "top_user_3.jpg" },
            { id: 4, name: "Брэдли Купер", rating: 119.0, img_url: persons_img_url + "top_user_4.jpg" },
            { id: 5, name: "Вин Дизель", rating: 118.8, img_url: persons_img_url + "top_user_5.jpg" },
            { id: 6, name: "Ли Пейс", rating: 117.2, img_url: persons_img_url + "top_user_6.jpg" }]);
        $.params("stat", {'views_count': 780000, 'episodes_count': 350, 'users_count': 25000, 'comments_count': 7000});
    };

    module.exports = prepare;

}).call(this);