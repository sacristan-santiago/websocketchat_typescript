const users: any[] = []

//Join user to chat
export function userJoin(id: string, username: string, room: string) {
    const user = {id, username, room};

    users.push(user);

    return user;
}

export function getCurrentUser(id: any) {
    return users.find(user => user.id ===id)
}

//user leaves chat
export function userLeave(id: any) {
    const index = users.findIndex(user => user.id===id)

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//get room users
export function getRoomUser(room: any) {
    return users.filter(user => user.room === room);
}