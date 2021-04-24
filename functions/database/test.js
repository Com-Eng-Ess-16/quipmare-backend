const functions = require('firebase-functions');

exports.test = functions.database.ref('/test').onCreate((snapshot, context) => {
    console.log("create")
    const original = snapshot.val().original;
      functions.logger.log('Uppercasing', original);
      const uppercase = original.toUpperCase();
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return snapshot.ref.child('uppercase').set(uppercase);
})

exports.test1 = functions.database.ref('/test').onUpdate((snapshot, context) => {
    console.log("update")
    const after = snapshot.after.val();
    const before = snapshot.before.val();
    let changeKey;
    Object.keys(after).forEach(key => {
      console.log(key);
      if (after[key] !== before[key]){
        changeKey = key;
        console.log(key + " Change");
      }
    })
      functions.logger.log('Uppercasing', after[changeKey]);
      const uppercase = after[changeKey].toUpperCase();
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return snapshot.after.ref.child(changeKey).set(uppercase);
})