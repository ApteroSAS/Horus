// import Person from '@material-ui/icons/Person';
// import { StateContextType } from '../../../../state';
import { Avatar } from '@mui/material';
import { Person } from '@mui/icons-material';

const styles = {
  red: {
    color: 'white',
    backgroundColor: '#F22F46',
  },
};

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((text) => text[0])
    .join('')
    .toUpperCase();
}

export default function UserAvatar({
  user,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any /*StateContextType['user']*/;
}) {
  const { displayName, photoURL } = user!;

  return photoURL ? (
    <Avatar src={photoURL} />
  ) : (
    <Avatar sx={styles.red}>
      {displayName ? getInitials(displayName) : <Person />}
    </Avatar>
  );
}
