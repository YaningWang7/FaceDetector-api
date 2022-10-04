const handleImage = (db) => (req, res) => {
    const {id} = req.body;
    if(!id) {
        return res.status(400).json("incorrect form submission");
    }
    db('users').select('entries').where({id}).then(entries => {
        if(entries.length) {
            db('users')
            .where({id})
            .increment('entries', 1)
            .returning('entries')
            .then(entries => res.json(entries[0].entries))
            .catch(err => res.status(400).json('unable to get entries'));
        } else {
            res.status(400).json('user not found');
        } 
    });
}

export default handleImage;