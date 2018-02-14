const assert = require('assert');

describe('Array#indexOf()',()=>{
   it('return -1 of empty',()=>{
       assert.equal(-1,[12,345,7].indexOf(2));
   }) ;
});