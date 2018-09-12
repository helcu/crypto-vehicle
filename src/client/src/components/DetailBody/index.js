import React from 'react'
import { Paper, Typography } from '@material-ui/core';


class DetailBody extends React.Component {

    constructor(props) {
        super(props);


    }


    render() {

        return (
            <div>
            <Paper md={10}>
                <Typography variant="title" color="inherit">
                    Detalle
                </Typography>

            </Paper>
            </div>

        )


    }


}

export default DetailBody;
