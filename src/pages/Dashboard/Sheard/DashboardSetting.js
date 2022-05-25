import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import { BiEditAlt } from 'react-icons/bi';
import { CgLogOut } from 'react-icons/cg';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logOut } from '../../../management/actions/userActions';
import './Dashboard.css';
export default function DashboardSetting({ children }) {
    const dispatch = useDispatch();
    const handleLogOut = () => {
        dispatch(logOut())
    }
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div className='dash-setting-menu'>
            <Box>
                <Tooltip title="Settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        {children}
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem sx={{ padding: '15px', borderBottom: '1px solid rgba(196, 196, 196, 0.2)' }}>
                    <Link to="/dashboard/edit-profile/" style={{ color: "#222222", textDecoration: 'none' }}>
                        <ListItemIcon>
                            <BiEditAlt size={20} />
                        </ListItemIcon>
                        Edit Profile
                    </Link>
                </MenuItem>

                <MenuItem sx={{ padding: '15px', borderBottom: '1px solid rgba(196, 196, 196, 0.2)' }}>
                    <Link to="/dashboard/change-password/" style={{ color: "#222222", textDecoration: 'none' }}>
                        <ListItemIcon>
                            <RiLockPasswordLine size={20} />
                        </ListItemIcon>
                        Password Change</Link>
                </MenuItem>
                <MenuItem sx={{ padding: '15px', }} onClick={handleLogOut}>
                    <ListItemIcon>
                        <CgLogOut size={20} />
                    </ListItemIcon>
                    Log Out
                </MenuItem>
            </Menu>
        </div >
    );
}