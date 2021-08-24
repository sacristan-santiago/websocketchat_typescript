"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomUser = exports.userLeave = exports.getCurrentUser = exports.userJoin = void 0;
const users = [];
//Join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
}
exports.userJoin = userJoin;
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}
exports.getCurrentUser = getCurrentUser;
//user leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}
exports.userLeave = userLeave;
//get room users
function getRoomUser(room) {
    return users.filter(user => user.room === room);
}
exports.getRoomUser = getRoomUser;
