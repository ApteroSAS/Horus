import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import React, { useState, useRef, useCallback } from 'react';
// import { makeStyles, Typography, Button, MenuItem, Link } from '@material-ui/core';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import { useAppState } from '../../../state';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UserAvatar from './UserAvatar/UserAvatar';
// import Menu from '@material-ui/core/Menu';
// import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const styles = {
  userContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: '1em',
    display: 'flex',
    alignItems: 'center',
  },
  userButton: {
    color: 'white',
  },
  logoutLink: {
    color: 'white',
    cursor: 'pointer',
    padding: '10px 20px',
  },
};

const UserMenu: React.FC = () => {
  // const { user, signOut } = useAppState();
  // const { localTracks } = useVideoContext();

  const [menuOpen, setMenuOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleSignOut = useCallback(
    () => {
      // localTracks.forEach((track) => track.stop());
      // signOut?.();
    },
    [
      /*localTracks, signOut*/
    ],
  );

  // if (process.env.REACT_APP_SET_AUTH === 'passcode') {
  //   return (
  //     <div className={styles.userContainer}>
  //       <Link onClick={handleSignOut} className={styles.logoutLink}>
  //         Logout
  //       </Link>
  //     </div>
  //   );
  // }

  // if (process.env.REACT_APP_SET_AUTH === 'firebase') {
  return (
    <Box sx={styles.userContainer}>
      <UserAvatar user={{} /*user*/} />
      <Button
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
        ref={anchorRef}
        sx={styles.userButton}
      >
        {/* {user!.displayName} */}
        <ExpandMoreIcon />
      </Button>
      <Menu
        open={menuOpen}
        onClose={() => setMenuOpen((isOpen) => !isOpen)}
        anchorEl={anchorRef.current}
        // getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={handleSignOut}>
          <Typography variant="body1">Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
  // }

  return null;
};

export default UserMenu;
