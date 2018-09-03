import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ReactDropzone from 'react-dropzone';
import ReactDOM from 'react-dom';
//import  '../../../../node_modules/react-dropzone-component/styles/filepicker.css'
import ipfs from './../../../utils/ipfs';


class ImagesVehicle extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      images: this.props.images,
    };

    this.onPreviewDrop = this.onPreviewDrop.bind(this);
  };
  
  onPreviewDrop = (images) => {
    
    this.setState({
      images: this.state.images.concat(images)
    }, () => {
      this.props.update(this.state);
    });

    images.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileAsBinaryString = reader.result;
        this.convertToBuffer(fileAsBinaryString);
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      //reader.readAsBinaryString(file);
    });
  }

  convertToBuffer = async(blob) => {
    let buffer = new Buffer(blob, "binary");

    await ipfs.add(buffer, (err, ipfsHash) => {
      console.log(err, ipfsHash);

      /*let photos;
      console.log(photos);
      if(this.state.vehicle.photos === "") {
        photos = ipfsHash[0].hash;
      } else {
        photos = this.state.vehicle.photos + "," + ipfsHash[0].hash;
      }*/
    })
  }

  onDeletePhoto = (photoPreview) => {
    let images = this.state.images;
    images = images.filter((image) => {
      return image.preview!=photoPreview
    });
    this.setState({images: images}, () => {
      this.props.update(this.state);
    });
  }

  render(){
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
          accept="image/*"
          onDrop={this.onPreviewDrop}
          style={{position: 'relative',
            width:700,
            height: 200,
            'border-width': 2,
            'border-color': 'rgb(70,130,180)',
            'border-style': 'dashed',
            'border-radius': 5,}}
        >
          <Grid container direction="column" justify="center" alignItems="center">
            Arrastrar fotos aquí...
          </Grid>
        </ReactDropzone>
        </Grid>
        {this.state.images.length > 0 &&
          <React.Fragment>
            <h3>Previews</h3>
            {this.state.images.map((file) => (
              <img
                alt="Preview"
                key={file.preview}
                src={file.preview}
                style={previewStyle}
                onClick={() => this.onDeletePhoto(file.preview)}
              />
            ))}
          </React.Fragment>
        }
      </div>
    </React.Fragment>
  );}
}

export default ImagesVehicle;