import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ReactDropzone from 'react-dropzone';
import ReactDOM from 'react-dom';
//import  '../../../../node_modules/react-dropzone-component/styles/filepicker.css'
var ReactDOMServer = require('react-dom/server');


class ImagesVehicle extends React.Component {

  constructor(props){

    super(props);

    this.state = {
      files: [],
    };
    this.onDrop = this.onDrop.bind(this);
    this.onPreviewDrop = this.onPreviewDrop.bind(this);

   };

   onPreviewDrop = (files) => {
    this.setState({
      files: this.state.files.concat(files),
     });
  }

  onDrop = (files) => {
    // POST to a test endpoint for demo purposes
    files.forEach(file => {
    
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
      <Grid container direction="row"  justify="center" alignItems="center">
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
          Arrastrar fotos aquí...
        </ReactDropzone>

        </Grid>
        {this.state.files.length > 0 &&
          <React.Fragment>
            <h3>Previews</h3>
            {this.state.files.map((file) => (
              <img
                alt="Preview"
                key={file.preview}
                src={file.preview}
                style={previewStyle}
              />
            ))}
          </React.Fragment>
        }
      </div>
    </React.Fragment>
  );}
}

export default ImagesVehicle;