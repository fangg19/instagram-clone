import React, { useState } from 'react';
import { db, storage } from './Firebase';
import firebase from 'firebase';
import '../App.scss';
import { IconButton } from '@material-ui/core';
import ImageSearchRoundedIcon from '@material-ui/icons/ImageSearchRounded';
import AddPhotoAlternateRoundedIcon from '@material-ui/icons/AddPhotoAlternateRounded';
import LinearProgress from '@material-ui/core/LinearProgress';

const ImageUpload = ({ username }) => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      // progress bar
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // error on upload
        console.log(error);
      },
      () => {
        // get the URL from the uploaded image
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // upload the image
            db.collection('posts').add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
            setProgress(0);
            setCaption('');
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="imageupload__container">
      <div className="imageupload">
        <input
          className="caption"
          type="text"
          placeholder="Describe your photo here"
          onChange={(event) => setCaption(event.target.value)}
          value={caption}
        />
        <div className="two__buttons">
          <input
            id="contained-button-file"
            type="file"
            onChange={handleChange}
          />

          <label htmlFor="contained-button-file">
            <IconButton variant="contained" component="span">
              <ImageSearchRoundedIcon color="secondary" fontSize="large" />
            </IconButton>
          </label>

          <IconButton onClick={handleUpload}>
            {/* <AddAPhotoRoundedIcon /> */}
            <AddPhotoAlternateRoundedIcon color="primary" fontSize="large" />
          </IconButton>
        </div>
      </div>

      {/* <progress className="progressbar" value={progress} max="100" /> */}
      <LinearProgress
        className="progressbar"
        variant="determinate"
        value={progress}
      />
    </div>
  );
};

export default ImageUpload;
