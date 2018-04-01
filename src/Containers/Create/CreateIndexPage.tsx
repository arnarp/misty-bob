import * as React from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import * as firebase from 'firebase';
import { DocumentTitle } from '../../Components/SideEffects/DocumentTitle';
import { Col } from '../../Components/Layout/Col';
import { TextInput } from '../../Components/Inputs/TextInput';
import { RequiredTextInputValidator } from '../../Components/Inputs/TextInputValidators';
import { RichTextEditor } from '../../Components/Editor';
import { Button } from '../../Components/Buttons';
import { NewPostDocument, UserInfo } from 'src/types';
import { firestore } from '../../firebase';

type CreateIndexPageProps = {
  userInfo: UserInfo;
};

const initialState = {
  title: '',
  editorState: EditorState.createEmpty(),
  hasClickedSubmit: false,
};
type CreateIndexPageState = Readonly<typeof initialState>;

export class CreateIndexPage extends React.PureComponent<
  CreateIndexPageProps,
  CreateIndexPageState
> {
  readonly state: CreateIndexPageState = initialState;
  constructor(props: CreateIndexPageProps) {
    super(props);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  render() {
    return (
      <main>
        <DocumentTitle title="Stofna nýjan póst" />
        <Col spacing="medium">
          <h1>Stofna nýjan póst</h1>
          <form onSubmit={this.onSubmit}>
            <Col spacing="medium">
              <TextInput
                size="h1"
                label="Titill færslu"
                value={this.state.title}
                onChange={this.onTitleChange}
                validators={[RequiredTextInputValidator]}
                hasClickedSubmit={this.state.hasClickedSubmit}
              />
              <RichTextEditor
                editorState={this.state.editorState}
                onChange={this.onEditorChange}
                editorControls={['H2', 'H3']}
              />
              <Button width="fit-content" type="submit" color="default">
                Senda
              </Button>
            </Col>
          </form>
        </Col>
      </main>
    );
  }

  private onTitleChange(title: string) {
    this.setState(() => ({ title }));
  }

  private onEditorChange = (editorState: EditorState) => {
    this.setState(() => ({ editorState }));
  };

  private onSubmit(event: React.FormEvent<{}>) {
    console.log('onSubmit', this.props);
    event.preventDefault();
    this.setState(() => ({ hasClickedSubmit: true }));
    const post: NewPostDocument = {
      title: this.state.title,
      authorUid: this.props.userInfo.uid,
      authorName: this.props.userInfo.displayName,
      authorPhotoURL: this.props.userInfo.photoURL,
      dateOfCreation: firebase.firestore.FieldValue.serverTimestamp(),
      dateOfLastActivity: firebase.firestore.FieldValue.serverTimestamp(),
      content: convertToRaw(this.state.editorState.getCurrentContent()),
    };
    firestore
      .collection('posts')
      .add(post)
      .then(() => {
        console.log('post added');
      })
      .catch((reason: firebase.firestore.FirestoreError) => {
        console.log(
          'post added rejected',
          reason.code,
          reason.message,
          reason.name,
        );
      });
  }
}
