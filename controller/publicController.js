exports.getHomePage = function(req, res) {
    res.render('home', {
        title: "Home"
    });
}