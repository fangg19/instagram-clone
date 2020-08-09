import React, { useState, useEffect, Fragment } from 'react';
import '../App.scss';
import { db } from './Firebase';
import firebase from 'firebase';
import Avatar from '@material-ui/core/Avatar';
import { Button, IconButton } from '@material-ui/core';
import RemoveCircleOutlineRoundedIcon from '@material-ui/icons/RemoveCircleOutlineRounded';
import WhatshotIcon from '@material-ui/icons/Whatshot';

function Post({ postId, user, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [posts, setPosts] = useState([]);

  console.log(firebase.auth().currentUser);
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      db.collection('posts')
        .doc(postId)
        .collection('comments')
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    // return () => {
    //   unsubscribe();
    // };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection('posts').doc(postId).collection('comments').add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment('');
  };

  // let colorBtn = '';

  // const fireUp = () => {
  //   colorBtn = 'primary';
  //   return colorBtn;
  // };

  return (
    <div className="post__container">
      <div className="post">
        {/* header -> avatar + user + location */}

        <div className="post__header">
          <Avatar className="post__avatar" alt={username} src="/" />
          <h4>{username}</h4>
          {user && username === firebase.auth().currentUser.displayName ? (
            <IconButton
              onClick={(event) => {
                db.collection('posts').doc(postId).delete();
              }}
            >
              <RemoveCircleOutlineRoundedIcon />
            </IconButton>
          ) : null}
        </div>

        {/* image */}
        <img className="post__image" src={imageUrl} alt="image"></img>
        {/* <div className="fire__btn">
          <IconButton color={colorBtn} onClick={fireUp}>
            <WhatshotIcon />
          </IconButton>
        </div> */}

        {/* user + caption */}
        <h4 className="post__caption">
          <strong>{username}</strong> {caption}
        </h4>

        {/* comments */}
        <div className="post__comments">
          {comments.map((comment) => (
            <h5>
              <strong>{comment.username}</strong> {comment.text}
            </h5>
          ))}
        </div>
        {user && (
          <form className="comment__box">
            <input
              className="comment__input"
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              className="post__btn"
              disableElevation
              variant="outlined"
              disabled={!comment}
              type="submit"
              onClick={postComment}
            >
              Post
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Post;
