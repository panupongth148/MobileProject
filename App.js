import React from "react";
import { StyleSheet } from "react-native";
import MainNavigator from "./navigation/MainNavigator";
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import usersReducer from './store/reducers/UsersReducer';

const rootReducer = combineReducers({
  users: usersReducer
});

const store = createStore(rootReducer);

export default function App() {
  return(
    <Provider store={store}>
      <MainNavigator users={rootReducer} />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
});
