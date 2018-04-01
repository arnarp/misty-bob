import * as React from 'react';
import { Link } from 'react-router-dom';
import { auth } from 'src/firebase';
import { Popover, PopoverControl } from 'src/Components/Popover';
import { Col } from 'src/Components/Layout/Col';
import { Button } from 'src/Components/Buttons/Button';
import './AppBar.css';
import { UserInfo } from 'src/types';

interface AppBarProps {
  userInfo?: UserInfo | null;
  onLogout: () => void;
}

export class AppBar extends React.PureComponent<AppBarProps, {}> {
  popover: PopoverControl | null;
  render() {
    return (
      <div role="banner" className="AppBar">
        <nav className="AppBarNav">
          <Link to="/">Heim </Link>
        </nav>
        {this.props.userInfo && (
          <Popover
            deltaY={-2}
            deltaX={12}
            button={
              <button className="UserBtn">
                <img className="UserImg" src={this.props.userInfo.photoURL} />
              </button>
            }
            provideControl={ref => {
              this.popover = ref;
            }}
          >
            <div className="AppBarAccountPopover">
              <div className="Info">
                <img src={this.props.userInfo.photoURL} />
                <Col>
                  <span className="Bold">
                    {this.props.userInfo.displayName}
                  </span>
                  <span>{this.props.userInfo.email}</span>
                </Col>
              </div>
              <div className="ActionFooter">
                <Button
                  color="primary"
                  style="flat"
                  onClick={() => {
                    if (this.popover) {
                      this.popover.closePopover();
                    }
                    setTimeout(() => {
                      this.props.onLogout();
                      auth().signOut();
                    }, 300);
                  }}
                >
                  Útskráning
                </Button>
              </div>
            </div>
          </Popover>
        )}
        {!this.props.userInfo && (
          <Button
            color="primary"
            style="flat"
            onClick={() => {
              const provider = new auth.GoogleAuthProvider();
              auth()
                .signInWithPopup(provider)
                // .signInWithRedirect(provider)
                .then(result => {})
                .catch(function() {});
            }}
          >
            Innskráning
          </Button>
        )}
      </div>
    );
  }
}
