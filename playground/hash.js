const bcrypt = require('bcryptjs');

var password = 1234567;
// console.log('hashing:', password);
// bcrypt.genSalt(10, function (err, salt) {
//     console.log(salt);
//     bcrypt.hash('password', salt, function (err, hash) {
//         console.log('hashed:', hash);
//         // this.password = hash;
//         // console.log('updated:', this.password);

//     });
// });

bcrypt.compare(password, '$2a$10$rb/VMVWh0.jasWUSQABeae54BIxaR4q4tFWIGSCkHA7d34nV0Jo3i', (err, val) => {
    console.log(val);
    
})