const functions = require('firebase-functions');

// able to use admin SDK to interact with different services like authentication and firestore service
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const createNotification = (notification) => {
    return admin.firestore().collection('notifications')

        .add(notification)
        .then(doc => console.log('notification added', doc))

}

// new plan trigger
exports.planCreated = functions.firestore
    .document('projects/{projectId}')
    .onCreate(doc => {

        const plan = doc.data();
        const notification = {
            content: 'Added a new plan',
            user: `${plan.authorFirstName} ${plan.authorLastName}`,
            time: admin.firestore.FieldValue.serverTimestamp()
        }

        return createNotification(notification)

});

// new user trigger
exports.userJoined = functions.auth
    .user()
    .onCreate(user => {

        return admin.firestore().collection('users')
            .doc(user.uid)
            .get()
            .then(doc => {
                const newUser = doc.data();
                const notification = {
                    content: 'Joined the travel planer',
                    user: `${newUser.firstName} ${newUser.lastName}`,
                    time: admin.firestore.FieldValue.serverTimestamp()
                }

                return createNotification(notification)
            })
})