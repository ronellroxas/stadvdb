const connection = require('../dbConfig');

exports.getHomePage = function(req, res) {
    res.render('home', {
        title: "Home"
    });
};

exports.query = function(req, res) {
    const query = req.body.query;
    connection.query(query, (err, results, fields) => {
        try {
            if (err) throw err;

            const names = fields.map(fieldPacket => {
                return fieldPacket.name;
            });

            res.status(200).send({ results, names });
        } catch (e) {
            console.log(e);
            res.status(200).send({ err: e.code });
        }
    });
};

endConnection = function() {
    connection.end(function(err) {
        if (err) throw err;

        console.log('closed');
    });
}