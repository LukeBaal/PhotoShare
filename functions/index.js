const functions = require('firebase-functions');
const admin = require('firebase-admin');
const vision = require('@google-cloud/vision');
const algoliasearch = require('algoliasearch');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();
const db = admin.firestore();
const visionClient = new vision.ImageAnnotatorClient();
const env = functions.config();
const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
const index = client.initIndex('tags');

const APP_NAME = 'Photo Share';

// When Image is Stored in Database, call Google Vision API and add image labels to database entry
exports.getImageLabels = functions.firestore
  .document('photos/{document}')
  .onCreate((snap, context) => {
    const data = snap.data();

    return Promise.resolve()
      .then(() => {
        return visionClient.labelDetection(data.url);
      })
      .then(res => {
        console.log(
          `Result: ${JSON.stringify({ results: res[0].labelAnnotations })}`
        );
        let labels = res[0].labelAnnotations;
        labels = labels.map(label => ({
          mid: label.mid,
          score: label.score,
          description: label.description,
          topicality: label.topicality
        }));
        console.log(labels);
        return db
          .collection('photos')
          .doc(context.params.document)
          .update({
            labels
          });
      })
      .then(() => console.log(`Labels added to ${context.params.document}`))
      .catch(err => console.log(err));
  });

// When photo database entry is updated (ie. photo is now labeled), add it to the Algolia search index.
exports.addToIndex = functions.firestore
  .document('photos/{document}')
  .onUpdate((change, context) => {
    const data = change.after.data();
    const { name, filename, url, user, publicUrl, labels } = data;
    const objectID = change.id;
    console.log(data);

    return index.addObject({
      objectID,
      name,
      filename,
      url,
      user,
      publicUrl,
      labels
    });
  });

// When photo database entry is deleted, remove it from Algolia search index
exports.unindexPhoto = functions.firestore
  .document('photos/{document}')
  .onDelete((snap, context) => {
    const objectId = snap.id;

    // Delete an ID from the index
    return index.deleteObject(objectId);
  });

// When user signs in for the first time, send a welcome email
exports.sendWelcomeEmail = functions.auth.user().onCreate(user => {
  const { email, displayName } = user;

  sgMail.setApiKey(env.send_grid.api_key);
  const msg = {
    to: email,
    from: 'lukeisaacb@gmail.com',
    subject: `Welcome to ${APP_NAME}`,
    text: `Hello ${displayName || ''},
Welcome to ${APP_NAME}. Begin sharing and browsing photos today!

Sincerely,
Photo Share`
  };
  return sgMail
    .send(msg)
    .then(() => console.log(`Email sent to ${msg.to}`))
    .catch(err => console.log(err));
});
