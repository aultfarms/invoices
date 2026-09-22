import * as React from 'react';
import { observer } from 'mobx-react-lite';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import { context } from './state';
import './NavBar.css';

export const NavBar = observer(function NavBar() {
  const { actions } = React.useContext(context);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutTrello = () => {
    actions.logoutTrello();
    handleMenuClose();
  };

  return (
    <AppBar position="static" className="navbar" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
            <img width="72" alt="" src="aultfarms_logo.png" />
            <Typography variant="h6" component="div" noWrap sx={{ ml: 1 }}>
              Feed Invoices
            </Typography>
          </div>
          <Tooltip title="Menu">
            <IconButton color="inherit" aria-label="Menu" onClick={(event) => setAnchorEl(event.currentTarget)}>
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleLogoutTrello}>Logout Trello</MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
});
