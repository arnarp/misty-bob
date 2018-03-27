import * as React from 'react';
import { Link } from 'react-router-dom';
import { DocumentTitle } from 'src/Components/SideEffects/DocumentTitle';
import { FixedActionPanel } from 'src/Components/Layout/FixedActionPanel';
import { Button } from 'src/Components/Buttons';
import { AddIcon } from 'src/Components/Icons/AddIcon';

interface HomeProps {}
interface HomeState {}
export class HomePage extends React.PureComponent<HomeProps, HomeState> {
  render() {
    return (
      <main>
        <DocumentTitle title="Forsíða" />
        <h1>Home</h1>
        <Link to="/admin">Admin</Link>
        <FixedActionPanel>
          <Button color="Primary" style="Action" to="/create">
            <AddIcon color="White" size="Large" />
          </Button>
        </FixedActionPanel>
      </main>
    );
  }
}
