import React from 'react';
import './avatar.css';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import { makeStyles } from '@mui/styles';
import { IconButton } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import RenderCropper from 'components/cropper/cropper';
import { TextField } from '@material-ui/core';
// import { useState, useRef } from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    cameraIcon: {
        heigth: '4rem',
        width: '4rem',
        position: 'absolute',
        bottom: '0',
        right: '20px',
        backgroundColor: 'white',
        '&:hover': {
            backgroundColor: 'white'
        }
    }
}));

export default function RenderAvatar() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const renderInputComponent = (inputProps) => {
        const { error, label, ref, ...rest } = inputProps;
        return <TextField error={!!error} label={label} fullWidth inputRef={inputProps.inputRef} {...rest} />;
    };
    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);
    const [showCropper, setShowCropper] = React.useState(null);
    const handleCropper = () => setShowCropper((prevValue) => !prevValue);
    return (
        <>
            <div className="avatar-container">
                <div className="avatar">
                    <img src="" alt="avatar" className="avatar-img" />
                </div>

                <IconButton
                    className={classes.cameraIcon}
                    ref={anchorRef}
                    id="composition-button"
                    aria-controls={open ? 'composition-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                >
                    <CameraAltIcon />
                </IconButton>
                <Popper open={open} anchorEl={anchorRef.current} role={undefined} placement="bottom-start" transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom' }}>
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList
                                        autoFocusItem={open}
                                        id="menu-list-grow"
                                        aria-labelledby="composition-button"
                                        onKeyDown={(event) => {
                                            handleListKeyDown(event);
                                        }}
                                    >
                                        <MenuItem onClick={handleClose}>View</MenuItem>
                                        <MenuItem
                                            onClick={(event) => {
                                                handleCropper();
                                                handleClose(event);
                                            }}
                                        >
                                            Change
                                        </MenuItem>
                                        <MenuItem onClick={handleClose}>Remove</MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
            {showCropper && <RenderCropper handleCropper={handleCropper} />}
        </>
    );
}
