import * as React from 'react';
import { DocumentTitle } from '../../Components/SideEffects/DocumentTitle';
import { FixedActionPanel } from '../../Components/Layout/FixedActionPanel';
import { Button } from '../../Components/Buttons';
import { AddIcon } from '../../Components/Icons/AddIcon';
import { firestore } from '../../firebase';
import { Post } from '../../types';
import { mapDocument } from '../../types/FirestoreSchema';
import { Discussions } from '../../Components/Discussions';
import { Section } from '../../Components/Layout/Section';

type HomePageProps = {};
const initialState = { posts: [] as Post[] };
type HomePageState = Readonly<typeof initialState>;

export class HomePage extends React.PureComponent<
  HomePageProps,
  HomePageState
> {
  readonly subscriptions: Array<() => void> = [];
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
        <Section>
          <Discussions posts={this.state.posts} />
        </Section>
        <FixedActionPanel>
          <Button color="primary" style="Action" to="/create">
            <AddIcon color="white" size="large" />
          </Button>
        </FixedActionPanel>
      </main>
    );
  }
}
