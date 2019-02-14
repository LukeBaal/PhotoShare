import React, { Component } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { db } from '../firebase';
import { connect } from 'react-redux';
import { AppState } from '../reducers';
import { AuthState } from '../reducers/auth';
import { History } from 'history';

interface AddImageProps {
  history: History;
  auth: AuthState;
}

interface AddImageState {
  name: string;
  image: any;
  progress: number;
}

class AddImage extends Component<AddImageProps, AddImageState> {
  constructor(props: AddImageProps) {
    super(props);

    this.state = {
      name: '',
      image: '',
      progress: 0
    };
  }

  onChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ name: e.currentTarget.value });
  };

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const { image } = this.state;

    e.preventDefault();

    const uploadTask: firebase.storage.UploadTask = firebase
      .storage()
      .ref('photos')
      .child(image.name)
      .put(image);

    await uploadTask.on(
      'state_changed',
      (snapshot: any) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.setState({ progress });
      },
      (error: any) => {
        console.log(error);
      },
      async () => {
        const { bucket, name } = uploadTask.snapshot.metadata;
        const { user } = this.props.auth;
        console.log(`Uploaded to: gc://${bucket}/photos/${name}`);

        const publicUrl = await firebase
          .storage()
          .ref('photos')
          .child(name)
          .getDownloadURL();

        // Add DB entry for photo
        const newPhoto = {
          name: this.state.name,
          filename: name,
          user: user && user.displayName ? user.displayName : 'Anonymous',
          url: `gs://${bucket}/photos/${name}`,
          publicUrl
        };

        await db.collection('photos').add(newPhoto);
        this.props.history.push('/dashboard');
      }
    );
  };

  handleImageAdded = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      const image = e.currentTarget.files[0];

      this.setState({ image });
    }
  };

  render() {
    const { progress, name, image } = this.state;
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={name}
              onChange={this.onChange}
            />
          </div>
          <div className="custom-file mb-1">
            <label htmlFor="image" className="custom-file-label">
              Upload Image
            </label>
            <input
              type="file"
              className="custom-file-input"
              name="image"
              accept="image/*"
              style={{ cursor: 'pointer' }}
              onChange={this.handleImageAdded}
            />
          </div>
          <div className="progress mb-3">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <div className="media">
            <img src={image} alt="" />
            <div className="media-body">
              <p>{image.name}</p>
            </div>
          </div>
          <button
            className="btn btn-success btn-block"
            type="submit"
            disabled={image === '' || name === ''}
          >
            Submit
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(AddImage);
