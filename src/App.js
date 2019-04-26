import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk'
import reducer from './reducers';
import Day from './components/Day';
import { Layout } from 'antd';
import 'antd/dist/antd.css'
import './App.scss';

const {
  Header, Content
} = Layout


const store = createStore(reducer, {}, applyMiddleware(reduxThunk))

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Layout className="App">
          <Header className="header">
            <h1>Enjoy.Todo</h1>
          </Header>
          <Content className="body flex-container">
              <Day dateOffset={-1} />
              <Day dateOffset={0} />
              <Day dateOffset={1} />
          </Content>
        </Layout>
      </Provider>
    );
  }
}

export default App;
