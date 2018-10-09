import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactDropzone from 'react-dropzone';
import {
  Button, TextField, Typography, Grid,
  Table, TableBody, TableCell, TableHead, TableRow
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddPhotoAlternateOutlined';
import DeleteIcon from '@material-ui/icons/Delete';


const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  table: {
    marginTop: 20,
    minWidth: 700,
  },
});


const defaultMessages = {
  success: 'Cumple',
  error: 'Requiere un nombre de máximo 31 caracteres'
};

const inputsPattern = {
  onChange: {
    image: /^[0-9A-Z ]{0,31}$/
  },
  onBlur: {
    image: /^[0-9A-Z ]{1,31}$/
  }
};


class ImagesVehicle extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      images: this.props.images,
      imagesNames: this.props.imagesNames,
      imagesNamesErrors: this.props.imagesNamesErrors
    };

    this.dropzoneRef = React.createRef();
  };

  componentWillMount = () => {
    let imagesNamesErrors = this.state.imagesNamesErrors;
    this.state.imagesNames.forEach((name, i) => {
      imagesNamesErrors.push(false);
    });

    this.setState({
      imagesNamesErrors: imagesNamesErrors
    });
  }

  componentDidMount = () => {
    this.validateInputs();
  }

  onPreviewDrop = (images) => {
    let imagesNames = this.state.imagesNames;
    let imagesNamesErrors = this.state.imagesNamesErrors;

    images.forEach(e => {
      let name = e.name.substr(0, e.name.lastIndexOf('.'));
      name = name.toUpperCase().replace(/[^A-Z0-9 ]/g, '').replace(' ', '').substr(0, 31);
      imagesNames.push(name);
      imagesNamesErrors.push(false);
    });

    this.setState({
      images: this.state.images.concat(images),
      imagesNames: imagesNames,
      imagesNamesErrors: imagesNamesErrors
    }, () => {
      this.props.update(this.state);
    });
  }

  onDelete = (imagePreview, i) => {
    let images = this.state.images;
    images.splice(i, 1);

    let imagesNames = this.state.imagesNames;
    imagesNames.splice(i, 1);

    let imagesNamesErrors = this.state.imagesNamesErrors;
    imagesNamesErrors.splice(i, 1);

    this.setState({
      images: images,
      imagesNames: imagesNames,
      imagesNamesErrors: imagesNamesErrors
    }, () => {
      this.props.update(this.state);
    });
  }

  onChange = (i) => e => {
    const name = e.target.name;
    const value = e.target.value.toUpperCase().replace(/\s\s+/g, ' ');
    const regPattern = new RegExp(inputsPattern.onChange[name]);
    const hasPattern = regPattern.test(value);

    if (hasPattern) {
      const imagesNames = [...this.state.imagesNames];
      const imagesNamesErrors = [...this.state.imagesNamesErrors];
      imagesNames[i] = value;
      imagesNamesErrors[i] = false;

      this.setState({
        imagesNames: imagesNames,
        imagesNamesErrors: imagesNamesErrors
      }, () => {
        this.props.update(this.state);
      });
    }
  }

  onBlur = (i) => e => {
    const name = e.target.name;
    const value = e.target.value.toUpperCase().trim();
    const regPattern = new RegExp(inputsPattern.onBlur[name]);
    const hasPattern = regPattern.test(value);

    if (hasPattern) {
      const imagesNames = [...this.state.imagesNames];
      const imagesNamesErrors = [...this.state.imagesNamesErrors];
      imagesNames[i] = value;
      imagesNamesErrors[i] = false;

      this.setState({
        imagesNames: imagesNames,
        imagesNamesErrors: imagesNamesErrors
      }, () => {
        this.props.update(this.state);
      });
    } else {
      const imagesNamesErrors = [...this.state.imagesNamesErrors];
      imagesNamesErrors[i] = true;

      this.setState({
        imagesNamesErrors: imagesNamesErrors
      }, () => {
        this.props.update(this.state);
      });
    }
  };

  validateInputs = async () => {
    return new Promise((resolve, reject) => {
      try {
        const imagesNamesErrors = this.state.imagesNames.map((name, i) => {
          const value = name.toUpperCase().trim();
          const regPattern = new RegExp(inputsPattern.onBlur.image);
          return !regPattern.test(value);
        });

        this.setState({
          imagesNamesErrors: imagesNamesErrors
        }, () => {
          this.props.update(this.state);
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  };


  render() {
    const { classes } = this.props;
    const previewStyle = {
      display: 'inline',
      minWidth: 100,
      minHeight: 100,
      maxWidth: 100,
      maxHeight: 100
    };

    return (
      <React.Fragment>
        <Typography variant="title" gutterBottom>
          Fotos
        </Typography>
        <div className="app">
          <Grid container direction="row" justify="center" alignItems="center">
            <ReactDropzone
              ref={(node) => { this.dropzoneRef = node; }}
              accept="image/jpeg"
              onDrop={this.onPreviewDrop}
              style={{
                position: 'relative',
                width: 0,
                height: 0
              }}>
            </ReactDropzone>


          </Grid>

          <Grid container item xs={12} sm={12} direction="row" justify="flex-end" alignItems="center">
            <Button variant="contained" color="primary" className={classes.button}
              onClick={() => { this.dropzoneRef.open() }}>
              <AddIcon className={classes.leftIcon} />
              Agregar
            </Button>
          </Grid>

          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Imagen</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.images.map((file, i) => {
                return (
                  <TableRow key={(file.preview ? file.preview : file) + i}>
                    <TableCell>
                      {file.preview ?
                        (
                          <img
                            alt="Preview"
                            src={file.preview}
                            style={previewStyle} />
                        ) : (
                          <img
                            alt="Preview"
                            src={"https://gateway.ipfs.io/ipfs//" + file}
                            style={previewStyle} />
                        )
                      }
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="image"
                        name="image"
                        required={true}
                        fullWidth
                        autoComplete="off"
                        value={this.state.imagesNames[i]}
                        helperText={this.state.imagesNamesErrors[i] ? defaultMessages.error : ""}
                        error={this.state.imagesNamesErrors[i]}
                        onChange={this.onChange(i)}
                        onBlur={this.onBlur(i)} />
                    </TableCell>
                    <TableCell>
                      <DeleteIcon onClick={() => { this.onDelete(file.preview ? file.preview : file, i) }} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </React.Fragment >
    );
  }
}

ImagesVehicle.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImagesVehicle);