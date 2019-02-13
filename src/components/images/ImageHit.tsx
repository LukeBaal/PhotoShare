import React from 'react';
import { Photo, Label } from '../Photo';

function ImageHit({ hit }: { hit: Photo }) {
  const { publicUrl, name, labels } = hit;
  return (
    <div className="card">
      <div className="row no-gutters">
        <div className="col-md-4">
          <img src={publicUrl} className="img-fluid" />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            {name}
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
      </div>
    </div>
  );
}

export default ImageHit;
