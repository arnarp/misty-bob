import * as React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../types';
import { Col, Row } from '../../Components/Layout';
import { CommentIcon } from '../Icons/CommentIcon';
import { Avatar } from './Avatar';
import './Discussions.css';

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
