module.exports = (function () {
    var fs = require("fs");

    function askForCart(user) {
        var data = fs.readFileSync('./data/usesrs_carts/' + user + '.json', 'utf8'); 
        return data;
    }

    function writeCart(cart, data) {
        fs.writeFile('./data/usesrs_carts/' + cart + '.json', data, function (err) {
            if (err) {
                throw err;
            }
        });
    }

    function createFile(user) {
        fs.open('./data/usesrs_carts/' + user + '.json', 'wx+', function (err, fd) {
        });
    }

    return{
        askForCart: askForCart,
        writeCart: writeCart,
        createFile: createFile
    };

})();