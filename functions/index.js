const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const vision = require('@google-cloud/vision');
const visionClient = new vision.ImageAnnotatorClient();
const env = functions.config();

const algoliasearch = require('algoliasearch');
const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
const index = client.initIndex('tags');

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

exports.unindexPhoto = functions.firestore
  .document('photos/{document}')
  .onDelete((snap, context) => {
    const objectId = snap.id;

    // Delete an ID from the index
    return index.deleteObject(objectId);
  });
