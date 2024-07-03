import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {FullFeaturedCrudGrid} from './components/UserGrid';
import { applyMiddleware, Store } from "redux";
import { legacy_createStore as createStore } from 'redux';
import { Provider } from "react-redux"
import {thunk} from "redux-thunk"
import reducer from "./store/locationState";
import { updateLocationCount } from "./store/actionCreators";
import LocationToolbar from './components/LocationToolbar';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const store: Store<LocationState, LocationAction> & {
  dispatch: DispatchType
} = createStore(reducer, applyMiddleware(thunk))

function App() {
  return (
    <Provider store={store}>
    <ThemeProvider theme={lightTheme}>
    <div className="App">
      <LocationToolbar />
      <div style={{padding: "1em"}}><FullFeaturedCrudGrid updateLocationCount={updateLocationCount} /></div>
    </div>
    </ThemeProvider>
    </Provider>
  );
}

export default App;
