import * as React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { auth } from '../../firebase';
import { Popover, PopoverControl } from '../../Components/Popover';
import { Col, Row, Button } from '../../Components';
import './AppBar.css';
import { UserInfo } from '../../types';

interface AppBarProps {
  userInfo: UserInfo | null;
  onLogout: () => void;
}

export class AppBar extends React.PureComponent<AppBarProps, {}> {
  popover: PopoverControl | null;
  render() {
    return (
      <Row
        alignItems="center"
        role="banner"
        justifyContent="spaceBetween"
        className="AppBar"
        sidePaddings="mediumResponsive"
      >
        <Row as="nav" justifyContent="end" grow className="AppBarNav">
          <Link to="/">Heim </Link>
        </Row>
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
              <Row
                justifyContent="spaceBetween"
                alignItems="center"
                className="ActionFooter"
                sidePaddings="medium"
              >
                <Button
                  to="/settings"
                  color="primary"
                  style="flat"
                  onClick={() => this.popover && this.popover.closePopover()}
                >
                  <FormattedMessage id="settings" />
                </Button>
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
                  <FormattedMessage id="logoutBtn" />
                </Button>
              </Row>
            </div>
          </Popover>
        )}
        {!this.props.userInfo && (
          <Button
            color="primary"
            style="flat"
            onClick={() => {
              const provider = new auth.GoogleAuthProvider();
              provider.setCustomParameters({ prompt: 'select_account' });
              auth().signInWithRedirect(provider);
            }}
          >
            Innskráning
          </Button>
        )}
      </Row>
    );
  }
}
