import React from 'react'
import { FormGroup, Form, ControlLabel, FormControl, Grid,Row, Col, PageHeader, Modal, Image } from 'react-bootstrap'
import { Button, Well } from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux'
import DatePicker from 'react-bootstrap-date-picker';
import { Link } from 'react-router';
import { createFlyer } from '../firebase/index.js';
import { ImageDropzone } from './ImageDropzone.js';
import { PureFlyer } from './Flyer';
import Logo from '../asset/logoHorizontal.png';
// import TimePicker from 'react-times';
import 'react-times/css/classic/default.css';
import Alert from 'react-s-alert';
import { NoPersmission } from './NoPermission'
import 'rc-time-picker/assets/index.css';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
// import { CreateFlyerAction } from '../State/actions'

// import { AuthWrapper, ORG } from '../Commen'

class CreateFlyerPage extends React.Component {
  constructor (props) {
    super(props)
    this.onPreview = this.onPreview.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onClear = this.onClear.bind(this);
    this.getFlyer = this.getFlyer.bind(this);
    this.onTimeChange = this.onTimeChange.bind(this);
    this.getTimePicker = this.getTimePicker.bind(this);
    this.state = {
      active: true,
      success: false,
      show: false,
      likes: 0,
      name: "",
      date: new Date().toISOString(),
      time: '12:00 am',
      description: "",
      location: "",
      files: [],
      minute: "",
      hour: "",
      timefocus: false,
    }
  }


  onClear(event){
    event.preventDefault();
    this.setState({ success: false })

    findDOMNode(this.name).value = "";
    findDOMNode(this.description).value = "";
    findDOMNode(this.location).value = "";

  }


  onPreview(event){
    event.preventDefault();
    const name = findDOMNode(this.name).value;
    const description = findDOMNode(this.description).value;
    const location = findDOMNode(this.location).value;

    var imagesFiles = []
    if(this.refs.dropzone && this.refs.dropzone.state.files){
      imagesFiles = this.refs.dropzone.state.files
    }
    if(!imagesFiles.length)//file is not uploaded
     Alert.error('Please upload at least one image to preview');
     else{
    this.setState({
      show: true,
      location: location,
      name: name,
      description: description,
      files: imagesFiles
    })
   }
  }

  onCreate(event){
    event.preventDefault();
    const { hasOrg } = this.props.user
    const orgArray = this.props.orgs.filter((org)=>org.id === hasOrg)
    const { time } = this.state

    const flyer = {
      name: findDOMNode(this.name).value,
      description: findDOMNode(this.description).value,
      location: findDOMNode(this.location).value,
      date: this.state.date.substring(0,10),
      active: true,
      likes: 0,
      belongsTo: orgArray[0].name,
      time: time,
      images: {}
    }

    var imagesFiles = this.refs.dropzone.state.files
    if(flyer.name === "")
      Alert.error('Please enter valid name!');
    else if(flyer.description === "")
      Alert.error('Please enter valid description!');
    else if(flyer.location === "")
      Alert.error('Please enter valid location!');
    else if(!imagesFiles.length)//file is not uploaded
      Alert.error('Please upload at least one image!');
    else{
        createFlyer("events", flyer, this.props.user, imagesFiles)
        this.setState({ success: true})
    }
  }

  onTimeChange(value) {
    const format = 'h:mm a';
     this.setState({time: value && value.format(format)})
     console.log(value && value.format(format));

   }

  getTimePicker(){
    const format = 'h:mm a';
    const now = moment().hour(0).minute(0);
    return(

      <TimePicker
         showSecond={false}
         defaultValue={now}
         className="xxx"
         onChange={this.onTimeChange}
         format={format}
         use12Hours
       />

   )
  }

  getFlyer () {
      var ourDate = this.state.date
      var date = (ourDate || new Date().toISOString() ).substring(0,10)
      const { name, location, description, likes, files, time } = this.state

      const flyerData = {
        name: name,
        location: location,
        description: description,
        date: date,
        time: time,
        images: files,
        likes: likes,
        belongsTo: this.state.orgName
      }

      return(
          <Col sm={12} mdOffset={1} md={8} >
            <Well>
              <PureFlyer flyer={flyerData} />
            </Well>
          </Col>
      )
    }

  handleChange(value){
    this.setState({
      date: value,
    })
  }


  render() {

    const { isAuthenticated, isOrg } = this.props.user
    var ToRender = <NoPersmission/>
    if(isAuthenticated && isOrg){

     ToRender=(
          <Grid>
            <Row className="header">
              <Col sm={12} md={8} mdOffset={2}>

              <PageHeader>Create Event Flyer</PageHeader>
              </Col>
            </Row>
            <Row className="name">
              <Col sm={12} md={8} mdOffset={2}>
              <Form>
                <FormGroup>
                  <ControlLabel>What is the name of your upcoming event?</ControlLabel>

                  <FormControl
                    type="text"
                    placeholder="Enter name"
                    ref={(node) => {this.name = node}}
                  />
                </FormGroup>
              </Form>
              </Col>
            </Row>

            <Row className="time">
              <Col md={4} mdOffset={2}>
              <Form>
                <FormGroup bsSize="small">
                  <ControlLabel>When will it take place?</ControlLabel>
                  <DatePicker onChange={this.handleChange} placeholder="Placeholder"  value={this.state.date} />
                </FormGroup>
              </Form>
              </Col>
              <Col md={6} >
                  <ControlLabel>Time</ControlLabel>
                  <br/>
                  {this.getTimePicker()}
              </Col>
            </Row>

            <Row className="location">
              <Col sm={12} md={8} mdOffset={2}>
              <Form>
                <FormGroup>
                  <ControlLabel>Where is the new event going to be?</ControlLabel>
                  <FormControl
                    type="text"
                    placeholder="Enter location"
                    ref={(node) => {this.location = node}}
                  />
                  <FormControl.Feedback />
                </FormGroup>

                <FormGroup>
                  <ControlLabel>Please give students a detail description of your event</ControlLabel>
                  <FormControl
                    componentClass="textarea"
                    placeholder="Enter description"
                    ref={(node) => {this.description = node}}
                  />
                </FormGroup>

                <ImageDropzone ref="dropzone"/>


              </Form>
            </Col>
          </Row>

          <br/>

          <Row className="newButton">
            <Col md={1} mdOffset={2}>
              <Button
                bsStyle="primary"
                bsSize="small"
                onClick={this.onCreate}>CreateFlyer
              </Button>
            </Col>

            <Col md={1} >
              <Button
                bsStyle="success"
                bsSize="small"
                onClick={this.onPreview}>
                Preview flyer page
              </Button>

              <Modal show={this.state.success} onHide={this.close}>

                <Modal.Body>
                   <Modal.Title className='text-center' style={{color: 'blue'}}>
                      <div>Your flyer was successfully created!!!</div>
                    </Modal.Title>
                   <Image src={Logo} style={{marginTop:100}} responsive/>
                </Modal.Body>

                <Modal.Footer>
                  <Button onClick={this.onClear}>Create another flyer</Button>
                  <Link className='btn' to='/' onClick={() => this.setState({success: false})}>
                  Home Page</Link>
                </Modal.Footer>
              </Modal>

                <Modal show={this.state.show} onHide={this.close}>
                  <Modal.Body style={{height:600}}>
                      { this.getFlyer() }
                      <br/>
                      <br/>
                      <br/>
                      <br/>
                  </Modal.Body>

                  <Modal.Footer>
                    <Button onClick={() => this.setState({show: false})}>Close</Button>
                  </Modal.Footer>
                </Modal>

            </Col>
          </Row>
        </Grid>)
    }

    return (
      <div> {ToRender} </div>
    )
  }
}


function mapStateToProps(state){
  return{
    user: state.user,
    orgs: state.data.orgs
  }
}
const CreateFlyer = connect(mapStateToProps)(CreateFlyerPage)
export { CreateFlyer }
