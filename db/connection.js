const mongoose = require('mongoose');
require('dotenv/config');

mongoose.Promise = global.Promise;

/**connect from your NoSql db
connection path is save in .env create your path if it doesn't exist
*/

mongoose
.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true})
.then(()=>{console.log('DB connected');})
.catch(err=>{console.log("db connection throws an error", err)});

module.exports = mongoose;
