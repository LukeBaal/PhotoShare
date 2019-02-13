import React, { Component } from 'react';
import { Photo } from '../Photo';

interface ImageItemProps {
  photo: Photo;
}

class ImageItem extends Component<ImageItemProps, {}> {
  constructor(props: ImageItemProps) {
    super(props);
  }

  render() {
    const { photo } = this.props;

    const { id, name, publicUrl, labels, user } = photo;
    if (photo) {
      return (
        <div className="card">
          <div className="row no-gutters">
            <div className="col-md-4">
              <img
                src={publicUrl}
                className="img-fluid"
                style={{
                  maxHeight: '20em',
                  cursor: 'zoom-in'
                }}
                data-toggle="modal"
                data-target={`#${id}`}
              />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <div className="d-flex">
                  <h3 className="card-title">{name}</h3>
                  <p className="text-muted mt-2 ml-3">{user}</p>
                </div>
                <h4>Labels</h4>
                {labels.map(label => (
                  <div
                    key={label.mid}
                    className="badge ml-1"
                    style={{
                      backgroundColor:
                        label.score > 0.9
                          ? '#1ac21a'
                          : label.score > 0.8
                          ? '#abe22a'
                          : label.score > 0.75
                          ? 'yellow'
                          : 'orange'
                    }}
                  >
                    {label.description}
                  </div>
                ))}
              </div>

              <div
                className="modal fade"
                id={id}
                role="dialog"
                aria-labelledby={`${id}Label`}
                aria-hidden="true"
              >
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id={`${id}Label`}>
                        {name}
                      </h5>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <img src={publicUrl} className="img-fluid" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }
  }
}

export default ImageItem;
