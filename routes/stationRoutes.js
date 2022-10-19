const router = require('express').Router()
const Station = require('../models/Station')

//create
router.post('/', async (req, res) => {
    console.log(req)
    const { property, manager, frequencyRx, frequencyTx, type, latitude, longitude, description } = req.body

    if (!property) {
        res.status(422).json({ msg: 'Campo de nome vazio' })
    }
    if (!frequencyRx) {
        res.status(422).json({ msg: 'Campo de frequência RX vazio' })
    }
    if (!frequencyTx) {
        res.status(422).json({ msg: 'Campo de frequência TX vazio' })
    }
    if (!type) {
        res.status(422).json({ msg: 'Campo de modo vazio' })
    }

    const station = {
        property, manager, type, frequencyRx, frequencyTx, latitude, longitude, description, dataCreted: new Date()
    }
    try {
        await Station.create(station)
        res.status(201).json({ msg: 'Estação cadastrada com sucesso!' })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//Read
router.get('/', async (req, res) => {
    try {
        const stations = await Station.find()
        res.status(200).json(stations)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//Read only one
router.get('/:id', async (req, res) => {

    const id = req.params.id

    try {
        const station = await Station.findOne({ _id: id })
        if (!station) {
            res.status(422).json({ msg: 'Usuário não encontrado' })
            return
        }
        res.status(200).json(station)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//Update - (PUT, PATCH)
router.patch('/:id', async (req, res) => {

    const id = req.params.id
    const { property, manager, frequencyRx, frequencyTx, type, latitude, longitude, description } = req.body

    const station = {
        property, manager, type, frequencyRx, frequencyTx, latitude, longitude, description, dataCreted: new Date()
    }

    try {
        const updateStation = await Station.updateOne({ _id: id }, station)
        if (updateStation.matchedCount === 0) {
            res.status(422).json({ msg: 'Usuário não foi cadastrado' })
            return
        }
        res.status(200).json(station)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//Delete
router.delete('/:id', async (req, res) => {
    const id = req.params.id

    const station = await Station.findOne({ _id: id })
    if (!station) {
        res.status(422).json({ msg: 'Usuário não foi encontrado' })
        return
    }
    try {
        await Station.deleteOne({ _id: id })
        res.status(200).json({ msg: 'Usuário removido com sucesso' })
    } catch (error) {
        res.status(500).json({ msg: 'Usuário não encontrado' })
    }
})

module.exports = router