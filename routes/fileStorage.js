const router = require('express').Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = `./uploads/${req.params.id}`
        fs.exists(dir, exist => {
            if (!exist) {
                return fs.mkdir(dir, error => cb(error, dir))
            }
            return cb(null, dir)
        })
    },
    filename: function (req, file, cb) {

        //const novoNomeArquivo = require('crypto').randomBytes(8).toString('hex')
        let novoNomeArquivo = file.originalname.replace(/ /g, '_')
        //novoNomeArquivo = novoNomeArquivo.toLowerCase()
        cb(null, `${novoNomeArquivo}`)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        fs.exists(`./uploads/${req.params.id}/${file.originalname}`, (exist) => {
            if (exist) {
                return cb('Arquivo já existe')
            }
            cb(null, true)
        })
    }
})

const uploadArrayFile = upload.array('file')

router.post('/:id', async (req, res) => {

    uploadArrayFile(req, res, (error) => {
        if (error) {
            console.log(error)
            return res.status(400).json({ error })
        }
        res.status(200).json({ files: req.files, msg: 'Arquivo armazenado com sucesso' })
    })
})

router.get('/:id', (req, res) => {

    fs.readdir(`uploads/${req.params.id}`, (error, files) => {
        if (error) {
            return res.status(400).json({ error })
        }
        res.status(200).json({ files })
    })
})

router.get('/:id/:archive', (req, res) => {
    const id = req.params.id
    const archive = req.params.archive
    const dir = path.join(process.cwd(), `/uploads/${id}/${archive}`)
    console.log(dir)/*
    fs.exists(dir, (exist) => {
        if (!exist) {
            return res.status(400).json()
        }
    })*/
    res.status(200).download(dir, '/' + archive)
})

router.get('/', (req, res) => {
    const id = '633c8d5a49af6cbdf5a9ffbd'
    const archive = 'file.txt'
    const dir = path.join(process.cwd(), `/uploads/${id}/${archive}`)
    console.log(typeof dir)

    res.status(200).download(dir, archive)

})

router.post('/', (req, res) => {
    const id = '633c8d5a49af6cbdf5a9ffbd'
    const archive = 'file.txt'
    const dir = path.join(process.cwd(), `/uploads/${id}/${archive}`)
    console.log(typeof dir)

    res.status(200).download(dir, archive)

})


router.delete('/:id&:file', (req, res) => {
    const dir = `./uploads/${req.params.id}/${req.params.file}`
    fs.exists(dir, (exist) => {
        if (!exist) {
            return res.status(400)
        }
    })
    fs.unlinkSync(dir)
    res.status(200).json({ msg: 'Arquivo deletado' })
})

//router.use('/uploads', router.static('uploads'))

module.exports = router