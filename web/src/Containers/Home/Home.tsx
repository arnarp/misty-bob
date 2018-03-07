import * as React from 'react';
import { Link } from 'react-router-dom';

interface HomeProps {}
interface HomeState {}
export class Home extends React.PureComponent<HomeProps, HomeState> {
  render() {
    return (
      <main>
        <h1>Home</h1>
        <Link to="/admin">Admin</Link>
      </main>
    );
  }
}
