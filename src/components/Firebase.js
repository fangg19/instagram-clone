import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyBu_nA5WBFG5GyEY2dYZgunsp_zqdyxGP0',
  authDomain: 'instagram-clone-785b4.firebaseapp.com',
  databaseURL: 'https://instagram-clone-785b4.firebaseio.com',
  projectId: 'instagram-clone-785b4',
  storageBucket: 'instagram-clone-785b4.appspot.com',
  messagingSenderId: '748250848530',
  appId: '1:748250848530:web:ac67c706d057788e6c67cb',
  measurementId: 'G-B0WSS0ZTF3',
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
