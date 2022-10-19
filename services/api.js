const api = (users) => {
    require('dotenv').config()
    const express = require('express')
    const mongoose = require('mongoose')
    const cors = require('cors')
    const jwt = require('jsonwebtoken')
    const path = require('path')

    const PORT = process.env.PORT || 3000

    const app = express()

    app.use(cors())

    //Config JSON response
    app.use(express.json())

    //Models
    const User = require('../models/User')


    //Public route
    app.get('/', (req, res) => {
        res.status(200).json({ msg: "run API!" })
    })

    app.use(express.static(path.join(__dirname, 'build')))
    app.use(express.static('./public'))

    app.get('/roip', function (req, res) {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });

    const authRoutes = require('../routes/authRoutes')
    app.use('/auth', authRoutes)

    //Private route
    app.get('/user/:id', checkToken, async (req, res) => {
        const id = req.params.id
        const user = await User.findById(id, '-password')
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' })
        }
        res.status(200).json({ msg: user })

    })

    function checkToken(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(" ")[1]
        if (!token) {
            return res.status(401).json({ msg: 'Acesso negado' })
        }
        try {
            const secret = process.env.secret
            jwt.verify(token, secret)
            next()
        } catch (error) {
            res.status(400).json({ msg: 'Token inválido' })
        }
    }

    const stationRoutes = require('../routes/stationRoutes')
    app.use('/api/station', stationRoutes)

    const radioRoutes = require('../routes/radioRoutes')
    app.use('/api/radio', radioRoutes)

    const groupRoutes = require('../routes/groupRoutes')
    app.use('/api/group', groupRoutes)

    const fileStorage = require('../routes/fileStorage')
    app.use('/file', fileStorage)


    const dbUser = process.env.DB_USER
    const dbPassword = process.env.DB_PASSWORD

    mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.gferh9e.mongodb.net/?retryWrites=true&w=majority`).then(() => {
        console.log('Conexão com banco de dados Atlas bem sucedida!')
        app.listen(PORT, () => {
            console.log(`[API]: Runinng in ${PORT}`)
        })
    }).catch((err) => console.log(err))


}

module.exports = { api }


