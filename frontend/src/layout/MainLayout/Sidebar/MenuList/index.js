// material-ui
import { Typography } from '@mui/material';
import { useState, useEffect } from 'react';
// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import axios from 'axios';
// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
    const [menu, setMenu] = useState(null);
    console.log(menuItem.items);
    useEffect(() => {
        if (localStorage.getItem('is_admin') == 'true') {
            setMenu(menuItem.items);
        } else {
            let data = [];
            for (let i = 0; i < menuItem.items.length; i++) {
                data = [...data, menuItem.items[i]];
                if (menuItem.items[i].id === 'pages') {
                    // delete user-admin-page child
                    data[i].children = data[i].children.filter((child) => child.id !== 'user-admin-page');
                }
            }
            setMenu(data);
        }
    }, []);
    let navItems = '';
    if (menu) {
        navItems = menu.map((item) => {
            switch (item.type) {
                case 'group':
                    return <NavGroup key={item.id} item={item} />;
                default:
                    return (
                        <Typography key={item.id} variant="h6" color="error" align="center">
                            Menu Items Error
                        </Typography>
                    );
            }
        });
    }

    return <>{navItems}</>;
};

export default MenuList;
