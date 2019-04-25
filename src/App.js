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
        <div className="App">
          <Layout>
            <Header>My Todos</Header>
            <Content>
              <div className="main flex-container">
                <Day dateOffset={-1} />
                <Day dateOffset={0} />
                <Day dateOffset={1} />
              </div>
            </Content>
          </Layout>
        </div>
      </Provider>
    );
  }
}

export default App;
