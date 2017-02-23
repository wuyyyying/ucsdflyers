import React from 'react'
import { firebase } from '../FlyersFirebase'
import { TopBarGuest } from './TopBarGuest';
import { TopBarStudent } from './TopBarStudent';
// import { TopBarOrg } from './TopBarOrg';

class TopBar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        topbar: <TopBarGuest/>
    }
  }

  componentWillMount(){
    const that = this;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            that.setState({
                topbar: <TopBarStudent/>
            })
        } else {
            that.setState({
                topbar: <TopBarGuest/>
            })
        }
    })
  }

  render () {
      return <div>{this.state.topbar}</div>
  }
}

export { TopBar }