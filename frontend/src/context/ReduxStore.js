import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

// Example slices (reducers)

import userReducer from '../redux/userSlice';
import notificationReducer from '../redux/notificationSlice';
import analyticsReducer from '../redux/analyticsSlice';
import policyReducer from '../redux/policySlice';
import complianceReducer from '../redux/complianceSlice';
import contentReducer from '../redux/contentSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    notifications: notificationReducer,
    analytics: analyticsReducer,
    policy: policyReducer,
    compliance: complianceReducer,
    content: contentReducer,
  },
});

export const ReduxProvider = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);
