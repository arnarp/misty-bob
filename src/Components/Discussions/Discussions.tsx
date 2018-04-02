import * as React from 'react';
import { Post } from 'src/types';
import { Col, Row } from 'src/Components/Layout';
import { Avatar } from './Avatar';
import { Link } from 'react-router-dom';
import './Discussions.css';
import { CommentIcon } from '../Icons/CommentIcon';

type DiscussionsProps = {
  posts: Post[];
};

const initialState = {};
type DiscussionsState = Readonly<typeof initialState>;

export class Discussions extends React.PureComponent<
  DiscussionsProps,
  DiscussionsState
> {
  readonly state: DiscussionsState = initialState;

  render() {
    return (
      <Col as="ol" className="Discussions">
        {this.props.posts.map(p => (
          <Row as="li" key={p.id} spacing="medium">
            <Avatar photoURL={p.authorPhotoURL} size="default" />
            <Row justifyContent="spaceBetween" grow>
              <Link to={`/d/${p.id}`}>
                <h3>{p.title}</h3>
              </Link>
              <Col justifyContent="center">
                <Row spacing="small" alignItems="center">
                  <span>{p.numberOfComments}</span>
                  <CommentIcon size="small" color="primary" />
                </Row>
              </Col>
            </Row>
          </Row>
        ))}
      </Col>
    );
  }
}
