
import { Grid, Typography, Toolbar } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { AppGrid, AppButton } from 'src/components';

const AllowScanPage = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [nextPage, setNextPage] = useState(false);



    // temporary fix the background flickering issue caused by video component is disposed when switching pages
    // by putting a loading box when next page button is clicked
    useEffect(() => {
        if (nextPage) {
            history.push('/scan-page');
        }
    })

    return (
        <>
            <Grid
                container
                justifyContent="center"
            // alignItems="center"
            >
                <img
                    src="https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350"
                    alt="new"
                />
                <Grid sx={{
                    display: 'grid',
                    alignContent: 'flex-start',
                    position: 'relative'
                }}>
                    <Typography variant="h4" style={{ padding: '7%', fontSize: '1.9rem' }}>
                        AR requires access to
                        device motion sensors.
                    </Typography>
                    <Grid container columns={16} sx={{
                        display: 'flex',
                        alignContent: 'flex-start',
                        position: 'relative',
                        justifyContent: "space-around",

                    }}>
                        <Button variant="outlined" style={{ borderRadius: 0, width: "40%" }}>Cancel</Button>
                        <Button variant="contained" style={{ borderRadius: 0, width: "40%" }}>Allow</Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default AllowScanPage;
