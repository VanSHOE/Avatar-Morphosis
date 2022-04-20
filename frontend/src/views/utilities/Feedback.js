import { Link } from 'react-router-dom';
import { useState } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import TextField from '@mui/material/TextField';
// project imports
import AuthWrapper1 from 'views/pages/authentication/AuthWrapper1';
import AuthCardWrapper from 'views/pages/authentication/AuthCardWrapper';

import AuthFooter from 'ui-component/cards/AuthFooter';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@mui/material/Button';
import axios from 'axios';
import Alert from '@mui/material/Alert';
// assets

// ================================|| AUTH3 - LOGIN ||================================ //

const Feedback = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [submitFeed, setSubmitFeed] = useState('');
    const useStyles = makeStyles(() => ({
        input1: {
            height: 50
        }
    }));
    const classes = useStyles();
    const [desc, setDesc] = useState('');
    function onChangeDesc(e) {
        console.log(e.target.value);
        setDesc(e.target.value);
    }
    function submitFeedback() {
        const data = {
            feedback: desc
        };
        axios
            .post('http://https://https://mernvendorbuyer.me/api/user/feedback', data, {
                headers: { 'x-access-token': localStorage.getItem('user') }
            })
            .then((res) => {
                console.log(res.data);
                setSubmitFeed(true);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Typography variant="h1" sx={{ fontSize: [18, 19, 20], fontWeight: 'bold' }}>
                                        Feedback
                                    </Typography>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>

                                    <Typography variant="body1" sx={{ marginTop: '4px', fontSize: [14, 15, 16], fontWeight: 'bold' }}>
                                        Please provide your feedback below
                                    </Typography>
                                    <Grid item xs={12} style={{ margin: 15 }}>
                                        <TextField
                                            fullWidth
                                            id="outlined-error"
                                            label="Feeback"
                                            variant="outlined"
                                            value={desc}
                                            onChange={onChangeDesc}
                                            // InputProps={{ classes: { input: classes.input1 } }}
                                        />
                                    </Grid>
                                    <Grid item alignItems="center" xs={12} sx={{ m: 3, mt: 1 }}>
                                        <Button fullWidth variant="contained" color="primary" onClick={submitFeedback}>
                                            Submit
                                        </Button>
                                    </Grid>
                                    {submitFeed && (
                                        <Alert variant="filled" severity="success">
                                            Your Response are Submitted!
                                        </Alert>
                                    )}
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                    <AuthFooter />
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default Feedback;
