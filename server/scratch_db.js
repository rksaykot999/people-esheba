const mysql = require('mysql2/promise');
console.log('Before pool creation');
const pool = mysql.createPool({
  host: 'bad-host.doesnotexist.com',
  user: 'root',
  password: 'password'
});
console.log('After pool creation, before query');
