// assets
import { IconBrandChrome, IconHelp, IconArtboard } from '@tabler/icons';
import FeedbackIcon from '@mui/icons-material/Feedback';
// constant
const icons = { IconBrandChrome, IconHelp, IconArtboard };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
    id: 'sample-docs-roadmap',
    type: 'group',
    children: [
        {
            id: 'backgrounds',
            title: 'Pricing Plans',
            type: 'item',
            url: '/plans',
            icon: icons.IconArtboard,
            breadcrumbs: false
        },
        {
            id: 'documentation',
            title: 'Demonstration',
            type: 'item',
            url: '/how_to',
            icon: icons.IconHelp,
            breadcrumbs: false
        },
        {
            id: 'feedback',
            title: 'Feedback',
            type: 'item',
            url: '/feedback',
            breadcrumbs: false,
            icon: FeedbackIcon
        }
    ]
};

export default other;
