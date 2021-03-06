'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = {};
const PHONE_REGEX = /^(\d{3})(\d{3})(\d{2})(\d{2})$/;

function isValidArgs(phone, name) {
    return PHONE_REGEX.test(phone) && name;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (isValidArgs(phone, name) && !(phoneBook.hasOwnProperty(phone))) {
        phoneBook[phone] = { name, email };

        return true;
    }

    return false;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (isValidArgs(phone, name) && phoneBook.hasOwnProperty(phone)) {
        phoneBook[phone] = { name, email };

        return true;
    }

    return false;
}

function includesQuery(number, query) {
    return [number, phoneBook[number].email, phoneBook[number].name]
        .some(element => element && element.includes(query));
}

/**
 * @param {String} query поисковый запрос
 * @returns {Array} массив номеров, удовлетворяющих запросу
 */
function __find(query) {
    if (query === '') {
        return [];
    }
    if (query === '*') {
        return Object.keys(phoneBook);
    }

    return Object.keys(phoneBook)
        .filter(number => includesQuery(number, query));
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let phonesToDelete = __find(query);
    for (let phone of phonesToDelete) {
        delete phoneBook[phone];
    }

    return phonesToDelete.length;
}

function formatRecord(record) {
    let digits = record.number.match(PHONE_REGEX);
    let str = `${record.name}, +7 (${digits[1]}) ${digits[2]}-${digits[3]}-${digits[4]}`;

    if (!record.email) {
        record.email = '';
    } else {
        record.email = ', ' + record.email;
    }

    return str + record.email;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    return __find(query)
        .map(number => ({
            name: phoneBook[number].name,
            email: phoneBook[number].email,
            number
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(formatRecord);
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    return csv.split('\n')
        .map(line => line.split(';'))
        .reduce((count, record) => {
            const args = [record[1], record[0], record[2]];
            count += add(...args) || update(...args);

            return count;
        }, 0);
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
