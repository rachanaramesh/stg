import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { connect } from 'react-redux';
import { useSelector } from "react-redux"

export function LocationToolbar() {
  const locations: readonly ILocation[] = useSelector(
    (state: LocationState) => state.locations
  )
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          {locations.map((location:ILocation) => {
              return <div><CustomizedTypography {...location} key={location.location} /></div>
          })}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function CustomizedTypography(location: ILocation) {
  return (
    <Typography variant="h6" color="inherit" component="div" key={location.location} style={{borderRight: "1px solid white", padding: "10px 50px", }}>
      {`${location.location} (${location.count})`}
    </Typography>
  )
}


const mapState = (state: { locations: any; }) => ({
  locations: state.locations,
})

const connector = connect(mapState, null);

export default connector(LocationToolbar);
