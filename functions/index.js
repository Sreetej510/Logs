const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const runtimeOpts = {
    timeoutSeconds: 10,
    memory: '128MB'
}

exports.getSubCollections = functions.runWith(runtimeOpts).region("asia-south1").https.onCall(async (data, context) => {

    const docPath = data.docPath;

    const collections = await admin.firestore().doc(docPath).listCollections();
    const collectionIds = collections.map(col => col.id);

    return { collections: collectionIds };

});
