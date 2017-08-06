module.exports = (function () {
    var fs = require("fs");
    var users = fs.readFileSync("./data/users.json", "utf8");
    parsedUsers= JSON.parse(users);


    function writeToFile(data) {
        var parsedData = JSON.stringify(data);
        fs.writeFile('./data/users.json', parsedData, function (err) {
            if (err) {
                throw err;
            }
        });
    }

    function returnUsers(){
        return users;
    }

    function ifUserExists(user){
        var userName = user.username;
        var password = user.password;
        var responce = false;

        for(var i=0; i<parsedUsers.length;i++){
            if(parsedUsers[i].id == userName && parsedUsers[i].pass == password){
                responce= true;
                break;
            }
        }
        return responce;
    }

    function ifUserExistsByMail(user){
        var userName = user.username;
        var password = user.password;
        var responce = false;

        for(var i=0; i<parsedUsers.length;i++){
            if(parsedUsers[i].id == userName){
                responce= true;
                break;
            }
        }
        return responce;
    }

    return{
        ifUserExists: ifUserExists,
        ifUserExistsByMail: ifUserExistsByMail,
        returnUsers: returnUsers,
        writeToFile: writeToFile
    };


})();