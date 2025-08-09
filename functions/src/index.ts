/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const moderators = ['amrfahmy9@gmail.com', 'ashraf.gawdat@gmail.com'];

function determineStatus(userEmail: string) {
  return moderators.includes(userEmail) ? 1 : 2;
}

exports.setQuestionStatus = functions.firestore
  .document('questions/{questionId}')
  .onCreate(async (snap: any, context: any) => {
    const data = snap.data();
    const userEmail = data.userEmail; // Make sure client includes this field

    const status = determineStatus(userEmail);

    // Update the document with the status
    return snap.ref.update({ status });
  });

  exports.setQuestionStatusOnUpdate = functions.firestore
  .document('questions/{questionId}')
  .onUpdate(async (change: any, context: any) => {
    const before = change.before.data();
    const after = change.after.data();

    const userEmail = after.userEmail;

    // Prevent unnecessary writes
    if (before.status === after.status) {
      return null;
    }

    const status = determineStatus(userEmail);
    return change.after.ref.update({ status });
  });
