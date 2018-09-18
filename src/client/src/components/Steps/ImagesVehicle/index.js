import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ReactDropzone from 'react-dropzone';


class ImagesVehicle extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      images: this.props.images,
    };
  };

  onPreviewDrop = (images) => {
    this.setState({
      images: this.state.images.concat(images)
    }, () => {
      this.props.update(this.state);
    });
  }

  onDelete = (photoPreview) => {
    let images = this.state.images;
    images = images.filter((image) => {
      return image.preview !== photoPreview && image !== photoPreview;
    });
    this.setState({ images: images }, () => {
      this.props.update(this.state);
    });
  }

  render() {
    const previewStyle = {
      display: 'inline',
      width: 100,
      height: 100,
    };


    return (
      <React.Fragment>
        <Typography variant="title" gutterBottom>
          Fotos
        </Typography>
        <div className="app">
          <Grid container direction="row" justify="center" alignItems="center">
            <ReactDropzone
              accept="image/jpeg"
              onDrop={this.onPreviewDrop}
              style={{
                position: 'relative',
                width: 700,
                height: 200,
                borderWidth: 2,
                borderColor: 'rgb(70,130,180)',
                borderStyle: 'dashed',
                borderRadius: 5
              }}>
              <Grid container direction="column" justify="center" alignItems="center">
                Hacer clic o arrastrar fotos aquí...
              </Grid>
            </ReactDropzone>
          </Grid>
          {this.state.images.length > 0 &&
            <React.Fragment>
              <Typography variant="subheading" gutterBottom>
                Vista previa
              </Typography>
              {this.state.images.map((file) => {
                if (file.preview) {
                  return (
                    <img
                      alt="Preview"
                      key={file.preview}
                      src={file.preview}
                      style={previewStyle}
                      onClick={() => this.onDelete(file.preview)}
                    />
                  );
                } else {
                  return (
                    <img
                      alt="Preview"
                      key={file}
                      src={"https://gateway.ipfs.io/ipfs//" + file}
                      style={previewStyle}
                      onClick={() => this.onDelete(file)} />
                  );
                }
              })}
            </React.Fragment>
          }
        </div>
      </React.Fragment>
    );
  }
}

export default ImagesVehicle;