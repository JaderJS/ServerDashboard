const router = require('express').Router()
const Group = require('../models/Group')

router.get('/', async (req, res) => {
    try {
        const groups = await Group.find()
        res.status(200).json(groups)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.post('/', async (req, res) => {
    const { name, user, type, id, tone, date, key } = req.body

    if (!id) {
        res.status(422).json({ error: 'Campo de id vazio' })
    }

    const consult = await Group.findOne({ id: id, key: key })

    if (!consult) {
        const group = {
            name, user, type, id, tone, date: new Date(), key
        }
        try {
            await Group.create(group)
            res.status(201).json({ msg: 'Grupo cadastrado com sucesso!' })
        } catch (error) {
            res.status(500).json({ error: error })
        }
    } else {
        res.status(406).json({ msg: 'Grupo já cadastrado' })
    }
})

//Update 
router.patch('/:id', async (req, res) => {

    const _id = req.params.id
    const { name, user, type, id, tone, date, key } = req.body

    const group = {
        name, user, type, id, tone, date: new Date(), key
    }

    try {
        const updateGroup = await Group.updateOne({ _id: _id }, group)
        if (updateGroup.matchedCount === 0) {
            res.status(422).json({ msg: 'Grupo não foi cadastrado' })
            return
        }
        res.status(200).json(group)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//Delete
router.delete('/:id', async (req, res) => {
    const _id = req.params.id
    const group = await Group.findOne({ _id: _id })
    console.log(group)
    if (!group) {
        res.status(422).json({ msg: 'Grupo não foi encontrado' })
        return
    }
    try {
        await Group.deleteOne({ _id: _id })
        res.status(200).json({ msg: 'Grupo removido com sucesso' })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

module.exports = router