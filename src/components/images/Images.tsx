import React, { Component } from 'react';
import { db } from '../../firebase';
import { Photo } from '../Photo';
import ImageItem from './ImageItem';

interface ImagesState {
  photos: Photo[];
}

export class Images extends Component<{}, ImagesState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      photos: []
    };
  }

  componentDidMount() {
    db.collection('photos').onSnapshot(snapshot => {
      const photos: Photo[] = [];
      snapshot.forEach(doc => {
        const item = doc.data();
        item.id = doc.id;

        photos.push(item as Photo);
      });
      this.setState({ photos });
    });
  }

  render() {
    const { photos } = this.state;
    if (photos.length > 0) {
      return (
        <div>
          <h3 className="text-center">Photos</h3>
          <ul className="list-group">
            {photos.map((photo: Photo) => (
              <ImageItem key={photo.name} photo={photo} />
            ))}
          </ul>
        </div>
      );
    } else {
      return (
        <div className="text-center">
          <div
            className="spinner-border"
            style={{ width: '3rem', height: '3rem', marginTop: '5rem' }}
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }
  }
}

export default Images;
