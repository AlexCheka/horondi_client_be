const products = require('./products');
const users = require('../data/8-users/users');
const { getObjectId, getObjectIds } = require('mongo-seeding');

const commentsOptions = [
    'Користуюсь вже місяць - чудовий виріб!',
    'У вас есть такой же, но с перламутровыми пуговицами?',
    'Want to order to Brisbane - how long will the delivery take?',
    'Все круто, якби не так багато кишеньок',
    'Купил 2 месяца назад. Очень удобно и стильно, но на углах уже начало протираться',
    'Earn $1,000 a week from home - visit http://123456789.com',
    'Карпати - чемпіон!',
    'Доставка заняла целых 10 дней! Пришлось искать мужу другой подарок :(',
    'Love the patterns! Do you have any cases for mobiles?',
    'Качественно сделано, стоит своих денег',
    'Когда в наявности будет жёлтый вариант?',
    'Вигляд при покупці - супер! Единий недолік - бруд дуже складно повністю відіпрати, заходить у шви і виріб з часом трохи втрачає вигляд',
    'Дорогувато :(',
    'Допоможіть! Дитина помалювала фламастером, нічим не можу вивести...',
    'Написав позавчора щодо великого замовлення, відповіді досі немає',
    'Забрала вчора з майстерні - всі заздрять :)',
    'Плюси: вигляд, якість пошивки, зручні кишеньки; Мінуси: поки не знайшов',
    'Менше місяця поносила - очав заїдати замочок. Завтра буду у Львові, близько 11-ї підійду в майстерню, виправте будь-ласка'
]
const commentsOptionsNumber = commentsOptions.length;
const productsNumber = products.length;
const usersNumber = users.length;
let dateOfCreation;
let commentsPerUserNumber;
let productId;

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

let comments = [];

let commentsPerProduct = [];
for (let i = 0; i < productsNumber; i++){
    commentsPerProduct[i] = new Array();
}

let votedUsers = [];
for (let i = 0; i < productsNumber; i++){
    votedUsers[i] = new Array();
}

for (let i = 0; i < usersNumber; i++){
    commentsPerUserNumber = 3;
    for (let j = 0; j < commentsPerUserNumber; j++){
        dateOfCreation = randomDate(users[i].registrationDate, new Date('June 30, 2020 23:23:59'));
        productId = ~~(Math.random() * productsNumber);
        comments.push({
            id: getObjectId('comment' + i + '_' + j),
            text: commentsOptions[~~(Math.random() * commentsOptionsNumber)],
            date: dateOfCreation,
            user: getObjectId('user' + i),
            product: getObjectId('product' + productId),
            show: true
        });
        commentsPerProduct[productId].push(
            getObjectId('comment' + i + '_' + j)
        );
        votedUsers[productId].push(
            getObjectId('user' + i)
        )
    }
};

module.exports = {
    comments,
    commentsPerProduct,
    votedUsers
};