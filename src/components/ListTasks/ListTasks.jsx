import React from 'react';
import { Grid } from '@mui/material';
import CardTask from '../CardTask';

const ListTasks = ({ tasks }) => {
    console.log('ListTasks rendered');

    return (
        <Grid container spacing={2}>
            {tasks &&
                tasks.length > 0 &&
                tasks.map((task, index) => (
                    <Grid item key={index} xs={12} md={4}>
                        <CardTask task={task} />
                    </Grid>
                ))}
        </Grid>
    );
};

export default React.memo(ListTasks);
