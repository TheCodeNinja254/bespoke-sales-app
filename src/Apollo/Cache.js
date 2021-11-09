import { InMemoryCache } from '@apollo/client';
import { loadingStatus, staticFooter } from './ReactiveVariables';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            let status = false;
            const localVariable = localStorage.getItem('isLoggedIn');
            if (localVariable === 'true') {
              status = true;
            }
            return status;
          }
        },
        staticFooter: {
          read() {
            return staticFooter();
          }
        },
        loadingStatus: {
          read() {
            return loadingStatus();
          }
        }
      }
    }
  }
});

export default cache;
