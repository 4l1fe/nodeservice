var img_url = "img/page_news/";
var poster_url = img_url;
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
        $.params("discussed_news", [
            { cast_name: "Дом 2", date: "2014-10-07T20:00:00.000Z", title: 'Инесса Шевчук строит с Катасоновым фиктивные отношения?', img_url: img_url + 'news-poster.jpg', text: 'С каждым днем, поведение Инессы Шевчук становится все загадочнее и загадочнее. Девушка и раньше вела себя довольно непредсказуемо, а теперь и подвано. Испытывая нескрываемую симпатию к Илье Григоренко, она заселилась в VIP-дом с Сергеем Катасоновым, но при этом отказывалась жить с ним полноценной "волшебной" жизнью, прикрываясь тем, что родители будут ругаться.' },
            { cast_name: "Склифософский", date: "2014-10-07T20:00:00.000Z", title: "Возвращение в мстители: Доминик Купер вновь сыграет Говарда Старка", comments_count: 62 },
            { cast_name: "Склифософский", date: "2014-10-07T20:00:00.000Z", title: "Возвращение в мстители: Доминик Купер вновь сыграет Говарда Старка", comments_count: 62 },
            { cast_name: "Манекенщица", date: "2014-10-07T20:00:00.000Z", title: 'У второй части "Добро пожаловать в Zомбилэнд" появился сценарист', comments_count: 62 },
            { cast_name: "Манекенщица", date: "2014-10-07T20:00:00.000Z", title: 'У второй части "Добро пожаловать в Zомбилэнд" появился сценарист', comments_count: 62 },
            { cast_name: "Готэм", date: "2014-10-07T20:00:00.000Z", title: 'Связь поколений: в Калуге пройдет международный фестиваль исторического и современного кино', comments_count: 80 },
            { cast_name: "Готэм", date: "2014-10-07T20:00:00.000Z", title: 'Связь поколений: в Калуге пройдет международный фестиваль исторического и современного кино', comments_count: 80 },
            { cast_name: "Склифософский", date: "2014-10-07T20:00:00.000Z", title: 'Преждевременное старение Тома Хэнкса: фильм "Большой" выйдет в формате сериала', comments_count: 80 },
            { cast_name: "Склифософский", date: "2014-10-07T20:00:00.000Z", title: 'Преждевременное старение Тома Хэнкса: фильм "Большой" выйдет в формате сериала', comments_count: 80 }]);
        $.params("other_news", [
            { cast_name: "Дом 2", date: "2014-10-07T20:00:00.000Z", title: 'Финчер погрузится в утопию', comments_count: 62 , poster: poster_url + 'poster1.jpg', text: 'Ленту по мотивам известнейшей игры выпустит студия Threshold Entertainment в сотрудничестве с Tetris Company.' },
            { cast_name: "Склифософский", date: "2014-10-07T20:00:00.000Z", title: '"Тетрис" станет фильмом', comments_count: 62, poster: poster_url + 'poster2.jpg', text: 'Знаменитую игру "Тетрис" собираются экранизировать, передает The Wall Street Journal. Ленту по мотивам игры, ставшей известной еще с восьмидесятых годов, выпустит студия Threshold Entertainment в сотрудничестве с Tetris Company'  },
            { cast_name: "Манекенщица", date: "2014-10-07T20:00:00.000Z", title: "Военная драма", comments_count: 62, poster: poster_url + 'poster3.jpg', text: 'Ленту по мотивам известнейшей игры выпустит студия Threshold Entertainment в сотрудничестве с Tetris Company.' },
            { cast_name: "Манекенщица", date: "2014-10-07T20:00:00.000Z", title: 'Саша Мамаева похудела', comments_count: 62, poster: poster_url + 'poster4.jpg', text: 'Знаменитую игру "Тетрис" собираются экранизировать, передает The Wall Street Journal. Ленту по мотивам игры, ставшей известной еще с восьмидесятых годов, выпустит студия Threshold Entertainment в сотрудничестве с Tetris Company' },
            { cast_name: "Манекенщица", date: "2014-10-07T20:00:00.000Z", title: '"Крадущемуся тигру" объявили бойкот', comments_count: 62, poster: poster_url + 'poster5.jpg', text: 'Боевик "Крадущийся тигр, затаившийся дракон 2" не покажут зрителям минимум в 115-ти залах кинотеатров IMAX.'  },
            { cast_name: "Готэм", date: "2014-10-07T20:00:00.000Z", title: 'Связь поколений: в Калуге пройдет международный фестиваль исторического и современного кино', comments_count: 80, poster: poster_url + 'poster6.jpg', text: 'Ленту по мотивам известнейшей игры выпустит студия Threshold Entertainment в сотрудничестве с Tetris Company.' },
            { cast_name: "Готэм", date: "2014-10-07T20:00:00.000Z", title: 'Связь поколений: в Калуге пройдет международный фестиваль исторического и современного кино', comments_count: 80, poster: poster_url + 'poster7.jpg', text: 'Анимационная голливудская студия DreamWOrks Animation уже долгое время ищет покупателя - как пишет издание Wall Street Journal, им может стать крупнейшая в Японии телекоммуникационная компания SoftBank Corporation.' },
            { cast_name: "Склифософский", date: "2014-10-07T20:00:00.000Z", title: 'Преждевременное старение Тома Хэнкса: фильм "Большой" выйдет в формате сериала', comments_count: 80, poster: poster_url + 'poster8.jpg', text: 'Ленту по мотивам известнейшей игры выпустит студия Threshold Entertainment в сотрудничестве с Tetris Company.' }]);
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