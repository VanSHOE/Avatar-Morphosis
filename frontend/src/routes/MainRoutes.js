import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { decomposeColor } from '@mui/system';
import backgrounds from 'views/plans';
import AdminPage from 'views/adminpage';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const Help = Loadable(lazy(() => import('views/help')));

const Startpage = Loadable(lazy(() => import('views/pages/authentication/authentication3/Startpage')));
// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsUpload = Loadable(lazy(() => import('views/utilities/Upload')));
const UtilsImage = Loadable(lazy(() => import('views/utilities/Image')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));
const Admin = Loadable(lazy(() => import('views/adminpage/index')));
const Results = Loadable(lazy(() => import('views/resultspage/index')));
const UserVideos = Loadable(lazy(() => import('views/user_profile/index')));

// sample page routing
const Demonstrate = Loadable(lazy(() => import('views/how_to')));
const Plans = Loadable(lazy(() => import('views/plans')));
const Profile = Loadable(lazy(() => import('views/profile')));
const UploadImage = Loadable(lazy(() => import('views/upload/imageupload')));
const Feedback = Loadable(lazy(() => import('views/utilities/Feedback')));
const Feedbacks = Loadable(lazy(() => import('views/utilities/Admin_feedback')));
// import Startpage from 'views/pages/authentication/authentication3/Startpage';
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <Startpage />
        },
        {
            path: '/dashboard/default',
            element: <DashboardDefault />
        },
        {
            path: '/dashboard/help',
            element: <Help />
        },
        // {
        //     path: '/utils/util-typography',
        //     element: <UtilsTypography />
        // },
        {
            path: '/utils/upload-file',
            element: <UploadImage />
        },
        // {
        //     path: '/utils/util-image',
        //     element: <UtilsImage />
        // },
        // {
        //     path: '/utils/util-color',
        //     element: <UtilsColor />
        // },
        {
            path: '/utils/util-upload',
            element: <UtilsUpload />
        },
        // {
        //     path: '/utils/util-shadow',
        //     element: <UtilsShadow />
        // },
        // {
        //     path: '/icons/tabler-icons',
        //     element: <UtilsTablerIcons />
        // },
        // {
        //     path: '/icons/material-icons',
        //     element: <UtilsMaterialIcons />
        // },
        {
            path: '/how_to',
            element: <Demonstrate />
        },
        {
            path: '/plans',
            element: <Plans />
        },
        {
            path: '/user/social-profile',
            element: <Profile />
        },
        {
            path: '/user/admin-page',
            element: <Admin />
        },
        {
            path: '/user/results-page',
            element: <Results />
        },
        {
            path: '/feedback',
            element: <Feedback />
        },
        {
            path: '/user/admin-feedbacks',
            element: <Feedbacks />
        }

        // {
        //     path: '/user/user-videos',
        //     element: <UserVideos />
        // }
    ]
};

export default MainRoutes;
