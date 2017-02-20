import React, {Component} from 'react';
import { Link } from 'react-router';
import MainStore from '../stores/main-store.js'

class Main extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {};

    this.bindedOnChange = this.onChange.bind(this);
  }

  componentWillMount() {
    MainStore.addChangeListener(this.bindedOnChange);
  }

  componentWillUnmount() {
    MainStore.removeChangeListener(this.bindedOnChange);
  }

  componentDidMount() {
    this.checkAuth();
  }

  onChange() {
    this.setState(MainStore.getState());
  }

  displayMenu() {
    return !['/', 'auth'].includes(this.props.location.pathname);
  }

  togglePanel() {
    MainStore.togglePanel();
  }

  async checkAuth() {
    const url = '/api/auth/check';

    const response = await fetch(url, {credentials: 'same-origin'});
    const json = await response.json();

    if (json.username) {
      MainStore.setUser(json.username);
    }
  }

  render() {
    return (
        <div>
          <nav className="c-nav c-nav--inline">
              <span className="c-nav__item" style={{display: this.displayMenu() ? 'inline-block' : 'none'}} onClick={this.togglePanel}>
                  <span className="fa fa-bars"></span>
              </span>
              <Link to="/" className="c-nav__item c-text--loud">
                  <span className="fa fa-subway"></span>
                  {" citylines.co "}
              </Link>
              { this.state.username ?
              <span className="c-nav__item c-nav__item--right"><i className="fa fa-user-circle-o"></i> {this.state.username}</span>  :
              <Link to="/auth" className="c-nav__item c-nav__item--right"><i className="fa fa-user-circle-o"></i> Ingresar</Link> }
          </nav>
          <div className="o-grid o-panel o-panel--nav-top">
            {this.props.children}
          </div>
        </div>
      )
  }
}

export default Main
