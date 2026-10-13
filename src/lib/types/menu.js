"use strict";
exports.__esModule = true;
exports.collectionsMenu = exports.getIcon = exports.getTitle = exports.COLLECTIONS = void 0;
exports.COLLECTIONS = ['artefacts', 'art', 'photo', 'quotations', 'funny', 'maps', 'cognitive', 'drafts'];
var getTitle = function (coll) {
    switch (coll) {
        case 'artefacts':
            return 'Артефакты';
        case 'art':
            return 'Живопись';
        case 'photo':
            return 'Фото';
        case 'quotations':
            return 'Цитаты';
        case 'funny':
            return 'Забавные';
        case 'maps':
            return 'Карты и схемы';
        case 'cognitive':
            return 'Познавательное';
        default:
            return 'Черновики';
    }
};
exports.getTitle = getTitle;
var getIcon = function (coll) {
    switch (coll) {
        case 'artefacts':
            return 'award';
        case 'art':
            return 'postage-heart';
        case 'photo':
            return 'camera';
        case 'quotations':
            return 'chat-quote';
        case 'funny':
            return 'emoji-smile';
        case 'maps':
            return 'compass';
        case 'cognitive':
            return 'search';
        default:
            return 'pencil';
    }
};
exports.getIcon = getIcon;
exports.collectionsMenu = exports.COLLECTIONS.map(function (el) {
    var icon = (0, exports.getIcon)(el);
    var title = (0, exports.getTitle)(el);
    var href = "/collection/".concat(el);
    return { icon: icon, title: title, href: href };
});
