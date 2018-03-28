import * as React from 'react';
import { DocumentTitle } from 'src/Components/SideEffects/DocumentTitle';
import { FixedActionPanel } from 'src/Components/Layout/FixedActionPanel';
import { Button } from 'src/Components/Buttons';
import { AddIcon } from 'src/Components/Icons/AddIcon';
import { firestore } from 'src/firebase';
import { Post } from 'src/types';
import { mapDocument } from 'src/types/FirestoreSchema';
import { Col, Row } from 'src/Components/Layout';

type HomePageProps = {};
const initialState = { posts: [] as Post[] };
type HomePageState = Readonly<typeof initialState>;

export class HomePage extends React.PureComponent<
  HomePageProps,
  HomePageState
> {
  subscriptions: Array<() => void> = [];
  readonly state: HomePageState = initialState;
  componentDidMount() {
    const subscription = firestore
      .collection('posts')
      .orderBy('dateOfLastActivity', 'desc')
      .onSnapshot(s => {
        this.setState(() => ({ posts: s.docs.map(p => mapDocument<Post>(p)) }));
      });
    this.subscriptions.push(subscription);
  }
  componentWillUnmount() {
    this.subscriptions.forEach(u => u());
  }
  render() {
    return (
      <main>
        <DocumentTitle title="Forsíða" />
        <h1>Home</h1>
        <Col>{this.state.posts.map(p => <Row key={p.id}>{p.title}</Row>)}</Col>
        <FixedActionPanel>
          <Button color="Primary" style="Action" to="/create">
            <AddIcon color="White" size="Large" />
          </Button>
        </FixedActionPanel>
      </main>
    );
  }
}
