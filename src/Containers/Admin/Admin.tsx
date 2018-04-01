import * as React from 'react';
import { Button } from '../../Components/Buttons';
import { Link } from 'react-router-dom';

interface AdminProps {}
interface AdminState {}
export class Admin extends React.PureComponent<AdminProps, AdminState> {
  render() {
    return (
      <main>
        <h1>Admin</h1>
        <Link to="/test">Admin</Link>
        <Button color="white">Test</Button>
        <Button color="primary">Test</Button>
        <Button color="secondary">Test</Button>
      </main>
    );
  }
}
