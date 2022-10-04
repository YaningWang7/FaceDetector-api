const handleSignin = (db, bcrypt) => (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json("incorrect form submission");
    }
    db('login')
    .select('email', 'hash')
    .where({email})
    .then(result => {
        const isValid = bcrypt.compareSync(password, result[0].hash);
        if (isValid) {
            return db('users')
            .select('*')
            .where({email})
            .then(user => res.json(user[0]))
            .catch(err => res.status(400).json('unable to get the user'))
        }else {
            res.status(400).json("fail to login");
        }
    })
    .catch(err => res.status(400).json('fail to login'))
}

export default handleSignin;