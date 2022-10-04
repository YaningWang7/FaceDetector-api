const handleProfileGet = (db) => (req, res) => {
    const {id} = req.params;
    db('users')
    .select('*')
    .where({id})
    .then(user => {
        console.log(user);
        if(user.length) {
           res.json(user[0]); 
        } else {
            res.status(400).json('Not found')
        } 
    })
    .catch(err => res.status(400).json('unable to get the user'));
}

export default handleProfileGet;