import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactDropzone from 'react-dropzone';
import {
  Button, TextField, Typography, Grid,
  Table, TableBody, TableCell, TableHead, TableRow
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/NoteAddOutlined';
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
    document: /^[0-9A-Z ]{0,31}$/
  },
  onBlur: {
    document: /^[0-9A-Z ]{1,31}$/
  }
};

class DocumentsVehicle extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      documents: this.props.documents,
      documentsNames: this.props.documentsNames,
      documentsNamesErrors: this.props.documentsNamesErrors
    };

    this.dropzoneRef = React.createRef();
  };

  componentWillMount = () => {
    let documentsNamesErrors = this.state.documentsNamesErrors;
    this.state.documentsNames.forEach((name, i) => {
      documentsNamesErrors.push(false);
    });

    this.setState({
      documentsNamesErrors: documentsNamesErrors
    });
  }

  componentDidMount = () => {
    this.validateInputs();
  }

  onPreviewDrop = (documents) => {
    let documentsNames = this.state.documentsNames;
    let documentsNamesErrors = this.state.documentsNamesErrors;

    documents.forEach(e => {
      let name = e.name.substr(0, e.name.lastIndexOf('.'));
      name = name.toUpperCase().replace(/[^A-Z0-9 ]/g, '').replace(' ', '').substr(0, 31);
      documentsNames.push(name);
      documentsNamesErrors.push(false);
    });

    this.setState({
      documents: this.state.documents.concat(documents),
      documentsNames: documentsNames,
      documentsNamesErrors: documentsNamesErrors

    }, () => {
      this.props.update(this.state);
    });
  }


  onDelete = (documentPreview, i) => {
    let documents = this.state.documents;
    documents.splice(i, 1);

    let documentsNames = this.state.documentsNames;
    documentsNames.splice(i, 1);

    let documentsNamesErrors = this.state.documentsNamesErrors;
    documentsNamesErrors.splice(i, 1);

    this.setState({
      documents: documents,
      documentsNames: documentsNames,
      documentsNamesErrors: documentsNamesErrors
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
      const documentsNames = [...this.state.documentsNames];
      const documentsNamesErrors = [...this.state.documentsNamesErrors];
      documentsNames[i] = value;
      documentsNamesErrors[i] = false;

      this.setState({
        documentsNames: documentsNames,
        documentsNamesErrors: documentsNamesErrors
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
      const documentsNames = [...this.state.documentsNames];
      const documentsNamesErrors = [...this.state.documentsNamesErrors];
      documentsNames[i] = value;
      documentsNamesErrors[i] = false;

      this.setState({
        documentsNames: documentsNames,
        documentsNamesErrors: documentsNamesErrors
      }, () => {
        this.props.update(this.state);
      });
    } else {
      const documentsNamesErrors = [...this.state.documentsNamesErrors];
      documentsNamesErrors[i] = true;

      this.setState({
        documentsNamesErrors: documentsNamesErrors
      }, () => {
        this.props.update(this.state);
      });
    }
  };

  validateInputs = async () => {
    return new Promise((resolve, reject) => {
      try {
        const documentsNamesErrors = this.state.documentsNames.map((name, i) => {
          const value = name.toUpperCase().trim();
          const regPattern = new RegExp(inputsPattern.onBlur.document);
          return !regPattern.test(value);
        });

        this.setState({
          documentsNamesErrors: documentsNamesErrors
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
      width: 100,
      height: 100,
    };
    return (
      <React.Fragment>
        <Typography variant="title" gutterBottom>
          Documentos
        </Typography>
        <div className="app">
          <Grid container direction="row" justify="center" alignItems="center">
            <ReactDropzone
              ref={(node) => { this.dropzoneRef = node; }}
              accept="application/pdf"
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
                <TableCell>Documento</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.documents.map((file, i) => {
                return (
                  <TableRow key={(file.preview ? file.preview : file) + i}>
                    <TableCell>
                      <img
                        alt="Preview"
                        src={"https://png.icons8.com/metro/1600/pdf-2.png"}
                        style={previewStyle} />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="document"
                        name="document"
                        required={true}
                        fullWidth
                        autoComplete="off"
                        value={this.state.documentsNames[i]}
                        helperText={this.state.documentsNamesErrors[i] ? defaultMessages.error : ""}
                        error={this.state.documentsNamesErrors[i]}
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
      </React.Fragment>
    );
  }

}

DocumentsVehicle.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DocumentsVehicle);