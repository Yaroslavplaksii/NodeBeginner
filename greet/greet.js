
module.exports = function(greeting){
    return function(name){
        return `${greeting} ${name}`;
    }
}