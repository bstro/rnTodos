/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';

import { ACTION, APP } from './types'
import store from './Store';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

const TodosContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Todos)

const App = () => <TodosContainer />

function Todos({props, actions}) {
  const
    { onChangeVisibilityFilter, onUpdateCreateField
    , onAdd, onToggleClick, onToggleAll
    , onEdit, onDestroyClick, onClearCompleted
    } = actions;

  const 
    { todos
    , count
    , nowShowing
    , createField 
    } = props;
  return (
    <Text>{todos.map(todo => todo.get('text'))}</Text>
  )
}

export default class rnTodos extends Component {
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <App />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case APP.ALL_TODOS:
      return todos
    case APP.ACTIVE_TODOS:
      return todos.filter(t => !t.get('completed'))
    case APP.COMPLETED_TODOS:
      return todos.filter(t => t.get('completed'))
    default:
      return todos
  }
}

function mapStateToProps(state) {
  return {
    props: {
      todos: getVisibleTodos(state.get('todos'), state.get('nowShowing')),
      createField: state.get('createField'),
      nowShowing: state.get('nowShowing'),
      count: state.get('todos').filter(todo => !todo.get('completed')).size
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      onUpdateCreateField: ({target}) =>
        dispatch({ type: ACTION.UPDATE_CREATE_FIELD, text: target.value }),

      onChangeVisibilityFilter: (filter) =>
        () =>
          dispatch({ type: ACTION.CHANGE_VISIBILITY_FILTER, filter }),

      onAdd: (text) => (e) => {
        e.preventDefault()
        dispatch({ type: ACTION.ADD_TODO, text })
      },

      onEdit: (id, text) =>
        ({target}) =>
          dispatch({ type: ACTION.EDIT_TODO, text: target.value, id }),

      onClearCompleted: () =>
        dispatch({ type: ACTION.CLEAR_COMPLETED }),

      onDestroyClick: (id) =>
        () =>
          dispatch({ type: ACTION.DELETE_TODO, id }),

      onToggleClick: (id, completed) =>
        () =>
          dispatch({ type: ACTION.COMPLETE_TODO, completed: !completed, id }),

      onToggleAll: () =>
        dispatch({ type: ACTION.TOGGLE_ALL })
    }
  }
}

AppRegistry.registerComponent('rnTodos', () => rnTodos);
