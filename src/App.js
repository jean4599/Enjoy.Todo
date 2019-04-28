import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Day from './components/Day';
import { Layout } from 'antd';
import 'antd/dist/antd.css'
import './App.scss';
import store from './store';

const {
  Header, Content
} = Layout




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
