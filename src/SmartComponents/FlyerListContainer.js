import React from 'react'
import { FlyerList } from '../DumbComponents/FlyerList'
import { connect } from 'react-redux'
import { fetchDataAsArray } from '../models'
import { SearchBar } from '../Commen'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import { Grid, Row, Col } from 'react-bootstrap';
import { Loader } from '../DumbComponents/Loader'

class FlyerListContainerPage extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      flyers: [],
      loading: true
    }
  }

  componentDidMount() {
    setTimeout(() => this.setState({ loading: false }), 2000);
  }

  componentWillMount () {
    const that = this;

    fetchDataAsArray('events')
    .then(function(events){
        var newFlyersList = events
        that.setState({
            flyers: newFlyersList,
        })
    })
    .catch(function(error){
        NotificationManager.error('Something is wrong', 'Opps!', 2222);
    })
  }

  render () {
    if(this.state.loading)
    return(<Loader />)
    else{
    return (
        <Grid>
          <NotificationContainer/>
          <Row>
            <SearchBar placeholder='search for flyers'/>
         </Row>
         <Row>
           <Col>
              <FlyerList flyers={this.state.flyers}/>
            </Col>
          </Row>
        </Grid>
    )
  }
  }
}

const FlyerListContainer = connect()(FlyerListContainerPage)

export { FlyerListContainer }
