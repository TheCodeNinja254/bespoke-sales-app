import React, { Suspense } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import './assets/styles/App.css';
import DefaultTheme from './theme';
import GlobalStyles from './assets/styles/GlobalStyles';
import Loader from './components/Loader';
import Routes from './Routes';

const App = () => {
  return (
    <ThemeProvider theme={DefaultTheme}>
      <Suspense fallback={<Loader />}>
        <BrowserRouter basename={process.env.REACT_APP_BASENAME || '/'}>
          <GlobalStyles />
          <Routes />
        </BrowserRouter>
      </Suspense>
    </ThemeProvider>
  );
};

export default App;
