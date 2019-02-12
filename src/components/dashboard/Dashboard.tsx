import React, { Component, Fragment } from 'react';
import axios from 'axios';

interface Label {
  mid: string;
  description: string;
  score: number;
  topicality: number;
}

interface DashboardState {
  isLoading: boolean;
  imgName: string;
  publicUrl: string;
  labels: Label[];
}

class Dashboard extends Component<{}, DashboardState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      isLoading: true,
      imgName: 'buildings-city-cityscape-1880871.jpg',
      publicUrl: '',
      labels: []
    };
  }

  async componentDidMount() {
    const publicUrl = `https://storage.googleapis.com/${
      process.env.REACT_APP_IMAGE_BUCKET
    }/${this.state.imgName}`;

    const data = {
      requests: [
        {
          image: {
            source: {
              imageUri: publicUrl
            }
          },
          features: [
            {
              type: 'LABEL_DETECTION'
            }
          ]
        }
      ]
    };
    // Get Image Labels
    const imageLabels = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${
        process.env.REACT_APP_GCLOUD_KEY
      }`,
      data
    );
    this.setState({
      isLoading: false,
      publicUrl,
      labels: await imageLabels.data.responses[0].labelAnnotations
    });
  }

  // lerpColour = (score: number): string => {
  //   const green = [0, 255, 0];
  //   const red = [255, 0, 0];
  //   let colour = [0, 0, 0];
  //   colour = colour.map((c, index) =>
  //     Math.floor((1 - score) * red[index] + score * green[index])
  //   );
  //   return colour.join(',');
  // };

  render() {
    const { isLoading, imgName, publicUrl, labels } = this.state;
    if (!isLoading) {
      return (
        <Fragment>
          <h1>Dashboard</h1>
          <div className="card">
            <div className="row no-gutters">
              <div className="col-md-4">
                <img src={publicUrl} className="img-fluid" />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h3 className="card-title">{imgName}</h3>
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
              </div>
            </div>
          </div>
        </Fragment>
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

export default Dashboard;
