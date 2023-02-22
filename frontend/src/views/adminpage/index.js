import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// material-ui
import { Box, Card, Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// ===============================|| COLOR BOX ||=============================== //

const ColorBox = ({ bgcolor, title, data, dark }) => (
    <>
        <Card sx={{ mb: 3 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 4.5,
                    bgcolor,
                    color: dark ? 'grey.800' : '#ffffff'
                }}
            >
                {title && (
                    <Typography variant="subtitle1" color="inherit">
                        {title}
                    </Typography>
                )}
                {!title && <Box sx={{ p: 1.15 }} />}
            </Box>
        </Card>
        {data && (
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="subtitle2">{data.label}</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle1" sx={{ textTransform: 'uppercase' }}>
                        {data.color}
                    </Typography>
                </Grid>
            </Grid>
        )}
    </>
);

ColorBox.propTypes = {
    bgcolor: PropTypes.string,
    title: PropTypes.string,
    data: PropTypes.object.isRequired,
    dark: PropTypes.bool
};

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary
}));

// ===============================|| UI ADMIN ||=============================== //

const AdminPage = () => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        const data = {
            show_all: true
        };
        axios
            .post('http://localhost:4000/upload/get_result', data, {
                headers: { 'x-access-token': localStorage.getItem('user') }
            })
            .then((res) => {
                console.log(res.data);
                console.log('Check');
                let data = res.data;
                // Reverse data
                data.reverse();
                setResults(data);
            })
            .catch((err) => {
                console.log('ERROR?');
                console.log(err);
            });
    }, []);
    return (
        <>
            {results.map((result, index) => (
                <Paper
                    sx={{
                        p: 2,
                        margin: 2,
                        flexGrow: 1,
                        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff')
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                                <Grid item xs>
                                    <Typography gutterBottom variant="subtitle1" component="div">
                                        {result.name}
                                    </Typography>
                                    <Typography sx={{ color: 'black' }}>Uploaded by: {result.user}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Seen: {result.seen ? 'Yes' : 'No'}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <LoadingButton
                                        onClick={() => {
                                            window.open('http://localhost:4000/' + result.path);
                                        }}
                                        endIcon={<SaveIcon />}
                                        loadingPosition="end"
                                        variant="contained"
                                    // margin-left="2rem"
                                    >
                                        Open
                                    </LoadingButton>
                                </Grid>
                                <Grid item>
                                    <LoadingButton
                                        onClick={() => {
                                            const item2send = {
                                                id: result.id
                                            };
                                            axios
                                                .post('http://localhost:4000/upload/del_result', item2send, {
                                                    headers: { 'x-access-token': localStorage.getItem('user') }
                                                })
                                                .then((res) => {
                                                    console.log(res.data);
                                                    // refresh page
                                                    window.location.reload();
                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                });
                                        }}
                                        endIcon={<CancelIcon />}
                                        loadingPosition="end"
                                        variant="contained"

                                    // margin-left="2rem"
                                    >
                                        Remove
                                    </LoadingButton>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle1" component="div">
                                    {result.created_at}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            ))}
        </>
    );
};

export default AdminPage;
