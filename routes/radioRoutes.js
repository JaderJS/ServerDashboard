const router = require('express').Router()
const Radio = require('../models/radio')

//Get
router.get('/', async (req, res) => {
    try {
        const radios = await Radio.find()
        return res.status(200).json(radios)
    } catch (error) {
        return res.status(500).json({ error: error })
    }
})


//Create 
router.post('/', async (req, res) => {
    const { model, sn, user, name, id, obs, key } = req.body

    if (!key) {
        return res.status(422).json({ error: 'Campo de key vazio' })
    }
    if (!sn) {
        return res.status(422).json({ error: 'Campo de número serial vazio' })
    }

    if (sn != 0) {
        const consult = await Radio.findOne({ sn: sn, key: key })
        //console.log(consult)
        if (!consult) {
            const radio = {
                model, sn, user, name, id, obs, key, date: new Date()
            }
            try {
                await Radio.create(radio)
                return res.status(201).json({ msg: 'Equipamento cadastrado com sucesso!' })
            } catch (error) {
                return res.status(500).json({ error: error })
            }
        } else {
            return res.status(406).json({ msg: 'Equipamento já cadastrado' })
        }
    } else {
        const radio = {
            model, sn: '', user, name, id, obs, key, date: new Date(),
        }
        try {
            await Radio.create(radio)
            return res.status(201).json({ msg: 'Equipamento cadastrado sem número de série' })
        } catch (error) {
            return res.status(500).json({ error: error })

        }
    }
    return res.status(201).json({ msg: 'Equipamento cadastrado sem número de série' })
})

router.patch('/:id', async (req, res) => {

    const _id = req.params.id
    const { model, sn, user, name, id, obs, key } = req.body

    const radio = {
        model, sn, user, name, id, obs, key, date: new Date()
    }

    try {
        const updateRadio = await Radio.updateOne({ _id: _id }, radio)
        if (updateRadio.matchedCount === 0) {
            res.status(422).json({ msg: 'Usuário não foi cadastrado' })
            return
        }
        res.status(200).json(radio)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    const radio = await Radio.findOne({ _id: id })
    console.log(radio)
    if (!radio) {
        res.status(422).json({ msg: 'Equipamento não foi encontrado' })
        return
    }
    try {
        await Radio.deleteOne({ _id: id })
        res.status(200).json({ msg: 'Equipamento removido com sucesso' })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

module.exports = router