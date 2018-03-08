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
        <Button color="White">Test</Button>
        <Button color="Primary">Test</Button>
        <Button color="Secondary">Test</Button>
      </main>
    );
  }
}
