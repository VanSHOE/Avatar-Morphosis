import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// material-ui
import { Box, Card, Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import axios from 'axios';
// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
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

const ResultPage = () => {
    const [results, setResults] = useState([]);
    const [email, setEmail] = useState('');

    useEffect(() => {
        const data = {
            showall: false
        };
        axios
            .post('https://mernvendorbuyer.me/api/upload/get_result', data, {
                headers: { 'x-access-token': localStorage.getItem('user') }
            })
            .then((res) => {
                console.log(res.data);
                let data = res.data;
                // Reverse data
                data.reverse();
                setResults(data);
            });

        axios
            .get('https://mernvendorbuyer.me/api/user/get_details', {
                headers: { 'x-access-token': localStorage.getItem('user') }
            })
            .then((res) => {
                console.log(res.data);
                setEmail(res.data.email);
            });
    }, []);

    return (
        <>
            {results.map((item, index) => (
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
                            <Grid xs container direction="column" spacing={2}>
                                <Grid item xs>
                                    <Typography gutterBottom variant="subtitle1" component="div">
                                        {item.name}
                                    </Typography>
                                    <Typography to="/user/user-videos" sx={{ color: 'black' }}>
                                        Seen: {item.seen ? 'Yes' : 'No'}
                                    </Typography>
                                    {/* <Typography variant="body2" color="text.secondary">
                                        Tags:
                                    </Typography> */}
                                </Grid>
                                <Grid item>
                                    <LoadingButton
                                        onClick={() => {
                                            const item2send = {
                                                id: item.id
                                            };
                                            axios.post('https://mernvendorbuyer.me/api/upload/mark_seen', item2send, {
                                                headers: { 'x-access-token': localStorage.getItem('user') }
                                            });
                                            window.open('https://mernvendorbuyer.me/api/' + item.path);
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
                                                id: item.id
                                            };
                                            axios
                                                .post('https://mernvendorbuyer.me/api/upload/del_result', item2send, {
                                                    headers: { 'x-access-token': localStorage.getItem('user') }
                                                })
                                                .then((res) => {
                                                    console.log(res.data);
                                                    // Refresh page
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
                                    {item.created_at}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            ))}
        </>
    );
};

export default ResultPage;
