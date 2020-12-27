const connection = require('../dbConfig');

exports.getHomePage = function(req, res) {
    res.render('home', {
        title: "Home"
    });
};

exports.query = function(req, res) {
    const query = req.body.query;

    connection.query(query, (err, results, fields) => {
        if (err) throw err;

        const names = fields.map(fieldPacket => {
            return fieldPacket.name;
        });

        res.status(200).send({ results, names });
    });
};