import React from 'react';
import { render } from '@testing-library/react';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../../reducers';

import App from './App';

const store = createStore(reducers, applyMiddleware(thunk));

test('App is being rendered', () => {
  const { getByText } = render(<Provider store={store}><App /></Provider>);
  const linkElement = getByText(/React Todo/i);
  expect(linkElement).toBeInTheDocument();
});

test('Greeting message being rendered', () => {
  const { getByText } = render(<Provider store={store}><App /></Provider>);
  const linkElement = getByText(/Welcome!/i);
  expect(linkElement).toBeInTheDocument();
});

test('Todo tile being rendered', () => {
  const { getAllByText } = render(<Provider store={store}><App /></Provider>);
  const linkElement = getAllByText(/Todos/i);
  expect(linkElement[0]).toBeInTheDocument();
});

test('Bucket tile is being rendered', () => {
  const { getByText } = render(<Provider store={store}><App /></Provider>);
  const linkElement = getByText(/Buckets/i);
  expect(linkElement).toBeInTheDocument();
});

test('Footer is being rendered', () => {
  const { getByText } = render(<Provider store={store}><App /></Provider>);
  const linkElement = getByText(/Pranav Jain/i);
  expect(linkElement).toBeInTheDocument();
});
