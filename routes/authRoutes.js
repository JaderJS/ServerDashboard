const router = require('express').Router()
const Auth = require('../models/User')
const User = require('../models/User')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//#################### /auth/login ####################
//login usuário

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório' })
    }
    if (!password) {
        return res.status(422).json({ msg: 'O password é obrigatório' })
    }

    const user = await User.findOne({ email: email })
    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado' })
    }

    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
        return res.status(422).json({ msg: 'Senha inválida' })
    }

    try {
        const secret = process.env.secret

        const token = jwt.sign(
            {
                id: user._id,
            },
            secret,
        )
        res.status(200).json({ msg: 'Autenticação realizada com sucesso', token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente mais tarde' })
    }
})

//#################### /auth/register ####################
//Registro usuário

router.post('/register', async (req, res) => {
    const { name, email, password, confirmpassword } = req.body

    if (!name) {
        return res.status(422).json({ msg: 'O nome é obrigatório' })
    }
    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório' })
    }
    if (!password) {
        return res.status(422).json({ msg: 'O password é obrigatório' })
    }
    if (password !== confirmpassword) {
        return res.status(422).json({ msg: 'Senhas diferentes' })
    }

    const userExists = await User.findOne({ email: email })
    if (userExists) {
        return res.status(422).json({ msg: 'Utilize outro e-mail' })
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
        name,
        email,
        password: passwordHash,
    })
    try {
        await user.save()
        res.status(201).json({ msg: 'Usuário cadastrado com sucesso!' })
    } catch (error) {
        res.status(500).json({ msg: "Aconteceu um erro no servidor , tente novamente mais tarde" })
    }
})

module.exports = router