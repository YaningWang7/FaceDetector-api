const handleRegister = (db, bcrypt) => (req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
        return res.status(400).json("incorrect form submission");
    }
    const hash = bcrypt.hashSync(password, 8);
    db.transaction(trx => {
        db('login')
        .transacting(trx)
        .returning('email')
        .insert({
            hash: hash,
            email: email
        })
        .then(loginEmail => {
            return db('users')
            .transacting(trx)
            .returning('*')
            .insert({
                name: name,
                email: loginEmail[0].email,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
            });
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'));
}

export default handleRegister;