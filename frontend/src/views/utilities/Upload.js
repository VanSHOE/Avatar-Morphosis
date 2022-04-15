import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// material-ui
import { Box, Card, Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import Stack from '@mui/material/Stack';
// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import axios from 'axios';
import Header from 'layout/MainLayout/Header';
import TextField from '@mui/material/TextField';
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

// ===============================|| UI COLOR ||=============================== //

const UIColor = () => {
    const [files, setFiles] = useState([]);
    const [selectedImage, setSelectedImage] = useState({ _id: -1 });
    const [selectedAudio, setSelectedAudio] = useState({ _id: -1 });
    const [selectedVideo, setSelectedVideo] = useState({ _id: -1 });
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [downloadURL, setDownloadURL] = useState('');
    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    };
    function onChangeName(e) {
        console.log(e.target.value);
        setName(e.target.value);
    }

    function send4lipsync() {
        if (selectedImage._id === -1 || selectedAudio._id === -1) {
            alert('Please select all the files');
            return;
        }
        setLoading(true);
        const data = {
            audio_path: selectedAudio.path,
            image_path: selectedImage.path,
            name: name
        };
        axios
            .post('http://localhost:4000/upload/modelize', data, { headers: { 'x-access-token': localStorage.getItem('user') } })
            .then((res) => {
                console.log(res.data);
                setDownloadURL(res.data.url);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }

    useEffect(() => {
        axios
            .get('http://localhost:4000/upload/get_files', { headers: { 'x-access-token': localStorage.getItem('user') } })
            .then((res) => {
                setFiles(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    return (
        <MainCard title="Media Upload" secondary={<SecondaryAction link="https://next.material-ui.com/system/palette/" />}>
            <Grid container spacing={gridSpacing} alignItems="center" justifyContent="center">
                <Grid item>
                    <Grid item xs={12} style={{ margin: 15 }}>
                        <TextField fullWidth id="outlined-error" label="Title" variant="outlined" value={name} onChange={onChangeName} />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <SubCard title="Image Upload">
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} sm={6} md={4} lg={2}>
                                <Box component="span" sx={{ p: 2, border: '1px dashed grey', borderRadius: 2 }}>
                                    <Button component={Link} to="/utils/upload-file" sx={{ color: 'black' }}>
                                        +
                                    </Button>
                                </Box>
                            </Grid>
                            {files.map((file) =>
                                file.type === 'image' ? (
                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                        <Button
                                            sx={{ color: 'black' }}
                                            onClick={() => {
                                                setSelectedImage(file);
                                                console.log(selectedImage);
                                            }}
                                        >
                                            <div
                                                component="span"
                                                style={{
                                                    p: 2,
                                                    border: '1px solid grey',
                                                    borderRadius: 2,
                                                    backgroundColor: file._id === selectedImage._id ? 'green' : 'grey'
                                                }}
                                            >
                                                <div>
                                                    <img
                                                        style={{ width: '100%', height: '100%' }}
                                                        alt="Custom"
                                                        src={'http://localhost:4000/' + file.path}
                                                    />
                                                </div>
                                            </div>
                                        </Button>
                                    </Grid>
                                ) : (
                                    ''
                                )
                            )}
                        </Grid>
                    </SubCard>
                </Grid>
                {/* <Grid item xs={12}>
                    <SubCard title="Video Upload">
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} sm={6} md={4} lg={2}>
                                <Box component="span" sx={{ p: 2, border: '1px dashed grey', borderRadius: 2 }}>
                                    <Button component={Link} to="/utils/upload-image" sx={{ color: 'black' }}>
                                        +
                                    </Button>
                                </Box>
                            </Grid>

                            {files.map((file) =>
                                file.type === 'video' ? (
                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                        <Button
                                            sx={{ color: 'black' }}
                                            onClick={() => {
                                                setSelectedVideo(file);
                                            }}
                                        >
                                            <div
                                                component="span"
                                                style={{
                                                    p: 2,
                                                    border: '1px solid grey',
                                                    borderRadius: 2,
                                                    backgroundColor: file._id === selectedVideo._id ? 'green' : 'primary.light'
                                                }}
                                            >
                                                <div>
                                                    {file.name} : {file.purpose}
                                                </div>
                                            </div>
                                        </Button>
                                    </Grid>
                                ) : (
                                    ''
                                )
                            )}
                        </Grid>
                    </SubCard>
                </Grid> */}
                <Grid item xs={12}>
                    <SubCard title="Audio Upload">
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} sm={6} md={4} lg={2}>
                                <Box component="span" sx={{ p: 2, border: '1px dashed grey', borderRadius: 2 }}>
                                    <Button component={Link} to="/utils/upload-file" sx={{ color: 'black' }}>
                                        +
                                    </Button>
                                </Box>
                            </Grid>
                            {files.map((file) =>
                                file.type === 'audio' ? (
                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                        <Button
                                            sx={{ color: 'black' }}
                                            onClick={() => {
                                                setSelectedAudio(file);
                                            }}
                                        >
                                            <div
                                                component="span"
                                                style={{
                                                    p: 2,
                                                    border: '1px solid grey',
                                                    borderRadius: 2,
                                                    backgroundColor: file._id === selectedAudio._id ? 'green' : 'primary.light'
                                                }}
                                            >
                                                <div>
                                                    {file.name} : {file.purpose}
                                                </div>
                                            </div>
                                        </Button>
                                    </Grid>
                                ) : (
                                    ''
                                )
                            )}
                        </Grid>
                    </SubCard>
                </Grid>
                <Grid item xs={1} alignContent="center" justifyContent="center">
                    {/* <Box component="span" sx={{ p: 2, border: '1px dashed grey', borderRadius: 2, marginLeft: 85 }}> */}
                    <LoadingButton
                        onClick={() => send4lipsync()}
                        endIcon={<SendIcon />}
                        loading={loading}
                        loadingPosition="end"
                        variant="contained"
                    >
                        Send
                    </LoadingButton>

                    {/* </Box> */}
                </Grid>
                {downloadURL != '' ? (
                    <Grid item xs={1} alignContent="center" justifyContent="center">
                        {/* <Box component="span" sx={{ p: 2, border: '1px dashed grey', borderRadius: 2, marginLeft: 85 }}> */}
                        <LoadingButton
                            onClick={() => {
                                window.open(downloadURL);
                            }}
                            endIcon={<SaveIcon />}
                            loading={loading}
                            loadingPosition="end"
                            variant="contained"
                            // margin-left="2rem"
                        >
                            Open
                        </LoadingButton>

                        {/* </Box> */}
                    </Grid>
                ) : (
                    ''
                )}
            </Grid>
        </MainCard>
    );
};

export default UIColor;
