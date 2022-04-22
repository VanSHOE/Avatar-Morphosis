// material-ui

import {
    Drawer,
    Fab,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    Radio,
    RadioGroup,
    Slider,
    Tooltip,
    Typography
} from '@mui/material';

import Box from '@mui/material/Box';
// project imports
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

const bull = (
    <Box component="span" sx={{ display: 'inline-block', mx: '15px', transform: 'scale(0.8)' }}>
        •
    </Box>
);

const Plans = () => (
    <Grid container spacing={2}>
        <Grid item xs={12}>
            <MainCard
                title={
                    <Typography variant="h1" alignContent="center">
                        Want help using our product?
                    </Typography>
                }
            >
                <Typography>
                    <h2>
                        <b>Workflow: </b>
                    </h2>
                    {bull} <h4>Our application uses just one picture to generate a video which can be lip synced with any audio of choice</h4>
                    {bull} <h4>
                        We have made our user interface in a very helpful manner - Users need to register/login and depending on their
                        payment plan, they’ll be able to access specific features offered by our application.
                    </h4>
                    {bull} <h4>
                        Once the user is logged in, they will be redirected to the dashboard - for detailed instructions, they can refer to 
                        the help page or the demo video we have provided for their ease.
                    </h4>
                    {bull} <h4>
                        From the Dashboard, the user, depending on their permissions and their type can access the admin/profile page of our application.
                    </h4>
                    {bull} <h4>
                        In the upload page, on the navigation sidebar, the user can upload their images and upload an audio file of their choice and get back 
                        a resultant video. 
                    </h4>
                    {bull} <h4>
                        Users can upload files used in previous videos as well - all files that the user has used can be viewed and selected based on preference.
                    </h4>
                    <h2>
                        An overview of our features:
                    </h2>
                    {bull} <h4>
                        Google Login, Profile Picture, Image and audio upload and storage, Result video receival and storage, Demo Video 
                        and Help page, Feedback and Notifications.
                    </h4>
                    <h2>
                        An overview of the technology we have used: 
                    </h2>
                    {bull} <h4>
                        MongoDB, Express, ReactJS, NodeJS, Google Colab, AWS s3, JWT Tokens
                    </h4>
                </Typography>
            </MainCard>
        </Grid>
    </Grid>
);

export default Plans;
