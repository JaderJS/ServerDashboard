const users = []

setInterval(() => { console.table(users) }, 5000)

const RefreshUsers = () => {
}

const addUser = ({ id, name, room }) => {

    if (name === '' || room === '') {
        return { error: 'Verifique o nome e sala' }
    }

    name = name.trim().toLowerCase()
    room = room.trim().toLowerCase()

    const existingUser = users.find((user) => {
        user.room === room && user.name === name
    })

    if (existingUser) {
        return { error: "Usuário já existe!" }
    }
    const user = { id, name, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        user.id == id
        console.log(user.id + ' ' + id)
    })

    if (index !== -1) {
        console.log(`[SERVER]: Usuário ${id} removido`)
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    const search = users.find((user) => user.id === id)
    console.log(`[SERVER]: Usuário encontrado ${search.name}`)
    return search
}

const getUsers = () => {
    return users
}

const getUsersInRoom = (room) => users
    .filter((user) => user.room === room)

module.exports = { addUser, removeUser, getUser, getUsersInRoom, getUsers }