import * as React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'firebase/app';
import { auth } from 'src/firebase';
import { Popover, PopoverControl } from 'src/Components/Popover';
import { Col } from 'src/Components/Layout/Col';
import { Button } from 'src/Components/Buttons/Button';
import './AppBar.css';

interface AppBarProps {
  user?: User | null;
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
        {this.props.user && (
          <Popover
            deltaY={-2}
            deltaX={12}
            button={
              <button className="UserBtn">
                {this.props.user.photoURL && (
                  <img className="UserImg" src={this.props.user.photoURL} />
                )}
              </button>
            }
            provideControl={ref => {
              this.popover = ref;
            }}
          >
            <div className="AppBarAccountPopover">
              <div className="Info">
                {this.props.user.photoURL && (
                  <img src={this.props.user.photoURL} />
                )}
                <Col>
                  <span className="Bold">{this.props.user.displayName}</span>
                  <span>{this.props.user.email}</span>
                </Col>
              </div>
              <div className="ActionFooter">
                <Button
                  color="Primary"
                  style="Flat"
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
        {!this.props.user && (
          <Button
            color="Primary"
            style="Flat"
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
