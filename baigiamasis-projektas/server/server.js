import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

//user management helper
import userVerify from './routes/userManagement/userVerify.js'

//pages
import registration from './routes/userManagement/register.js'
import login from './routes/userManagement/login.js'
import logout from './routes/userManagement/logout.js'

import user from './routes/api/user.js'
import Votes from './routes/api/Votes.js'
import Question from './routes/api/Question.js'
import Answers from './routes/api/Answers.js'

const PORT = 5000;
const app = express();

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}))
app.use(cookieParser(), express.json(), express.urlencoded({extended: false}));

app.use('/register', registration);
app.use('/login', login);
app.use('/userVerify', userVerify)
app.use('/user', user)
app.use('/logout', logout)
app.use('/question', Question)
app.use('/answers', Answers)
//app.use('/votes', Votes) --disabled in early access

app.all('*', (req,res) => {
    res.status(404).send({error: 'Page not found'})
});

app.listen(PORT, () => console.log(`Server live on port ${PORT}`));