import React from 'react';
import { Panel, PanelGroup } from 'react-bootstrap';
import { Org } from './Org';

class OrgList extends React.Component {

    getOrgList () {
        return this.props.orgs.map((org, index) => (
            <Panel header={org.name} eventKey={index} key={index}>
                <Org key={index} org={org}/>
            </Panel>
        ))
    }

    render (){
        return (
            <div className="container">
                <PanelGroup defaultActiveKey accordion>
                    {this.getOrgList()}
                </PanelGroup>
            </div >
        )
    }
}

OrgList.propTypes = {
  orgs: React.PropTypes.array.isRequired
}

export {OrgList};