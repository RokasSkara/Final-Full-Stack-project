import 'dotenv/config'

import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import CredentialValidation from '../../controllers/validation.js'
import fetch from 'node-fetch'

const router = express.Router();

router.post('/', async (req, res) => {
    const {email, password} = req.body
    try {
        CredentialValidation(req.body)
    } catch (err) {
        return res.status(400).send({ err: 'Incorrect email or password' })
    }
    try {
        let UserExists = false;
        let passCompare = ''
        let userId = ''
        await fetch('http://localhost:8080/users')
        .then(res => res.json())
        .then(users => {
            UserExists = users.some(user => user.email === email)
            users.filter(user => user.email === email ? passCompare = user.password: '')
           users.filter(user => user.email === email? userId = user.id: '')
        })
        if(UserExists){
            const Auth = await bcrypt.compare(password, passCompare)
            if(Auth){
                const privateKey = process.env.SECRET
                const token = jwt.sign({
                    username: email
                }, privateKey, {
                    expiresIn: '120m'
                })
                return res.cookie("token", `${token}+${email}+${userId}`, {
                    httpOnly: true,
                    SameSite: 'None'
                })
                    .status(200)
                    .send({msg: 'Success'})
            } else {
                console.log('failed')
                return res.status(400).send({
                    err: "Incorrect email or password",
                })
            }
        } else {
            return res.status(400).send({
                err: "Incorrect email or password",
            })
        }
        
    } catch (err) {
        return res.status(400).send({ err: err })
    }
})

export default router;