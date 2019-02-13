import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyBImQ-55LoC1WuTr3ZkyAwZh8yUrzbk2Co',
  authDomain: 'photo-share-a271c.firebaseapp.com',
  databaseURL: 'https://photo-share-a271c.firebaseio.com',
  projectId: 'photo-share-a271c',
  storageBucket: 'photo-share-a271c.appspot.com',
  messagingSenderId: '553594430987'
};

firebase.initializeApp(config);

export const db = firebase.firestore();
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const githubAuthProvider = new firebase.auth.GithubAuthProvider();
