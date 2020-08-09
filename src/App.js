import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Post from './components/Post';
import { db, auth } from './components/Firebase';
import './App.scss';
import logo from './images/logo_1_black.png';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload';

function App() {
  const [posts, setPosts] = useState([]);
  // const post = [];

  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        //user has logged out
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    let unsubscribe;
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };

  return (
    <div className="App">
      <Modal className="modal" open={open} onClose={() => setOpen(false)}>
        <div className="modal__inside">
          <form className="modal__form">
            <center>
              <img className="modal__image" src={logo} alt="" />
            </center>
            <Input
              type="text"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              disableElevation
              onClick={signUp}
            >
              SIGN UP
            </Button>
          </form>
        </div>
      </Modal>
      <Modal
        className="modal"
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div className="modal__inside">
          <form className="modal__form">
            <center>
              <img className="modal__image" src={logo} alt="" />
            </center>
            <Input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              disableElevation
              onClick={signIn}
            >
              LOG IN
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <Header />
        {user ? (
          <Button
            variant="outlined"
            color="secondary"
            disableElevation
            onClick={() => auth.signOut()}
            size="small"
          >
            SIGN OUT
          </Button>
        ) : (
          <div className="app__loginContainer">
            <Button
              variant="outlined"
              color="primary"
              disableElevation
              onClick={() => setOpenSignIn(true)}
              size="small"
            >
              LOG IN
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disableElevation
              onClick={() => setOpen(true)}
              size="small"
            >
              SIGN UP
            </Button>
          </div>
        )}
      </div>

      {posts.map(({ id, post }) => (
        <Post
          key={id}
          postId={id}
          user={user}
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
        />
      ))}

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <div className="app__notlogged">
          <h3>
            Please create an account to post or comment{' '}
            <span role="img">🔥 📷</span>{' '}
          </h3>
        </div>
      )}
    </div>
  );
}

export default App;
