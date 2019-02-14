import React from 'react';
import { Label } from '../Photo';

interface PhotoHit {
  objectID: string;
  name: string;
  publicUrl: string;
  string: string;
  labels: Label[];
  user: string;
}

function ImageHit({ hit }: { hit: PhotoHit }) {
  const { objectID, publicUrl, name, labels, user } = hit;
  return (
    <div className="row no-gutters">
      <div className="col-xl-4">
        <img
          src={publicUrl}
          className="img-fluid img-thumbnail"
          data-toggle="modal"
          data-target={`#modal${objectID}`}
          style={{ cursor: 'zoom-in' }}
        />
      </div>
      <div className="col-xl-8">
        <div className="card-body">
          <div className="d-flex">
            <h4>{name}</h4>
            <span
              className="text-muted mt-2 ml-2"
              style={{ fontSize: '0.8em' }}
            >
              {user}
            </span>
          </div>
          {labels.map((label: Label) => (
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
      </div>
      <div
        className="modal fade"
        id={`modal${objectID}`}
        role="dialog"
        aria-labelledby={`${objectID}Label`}
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`${objectID}Label`}>
                {name} - {user}
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
  );
}

export default ImageHit;
