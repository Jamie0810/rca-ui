import React from 'react';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import classnames from 'classnames';
import XwjDatasetRevealDataPool from './XwjDatasetRevealDataPool';
import XwjDatasetRevealStationItem from './XwjDatasetRevealStationItem';
import XwjDatasetRevealMaterial from './XwjDatasetRevealMaterial';
import {withTranslation} from "react-i18next";

class XwjDatasetRevealDetailContainer extends React.Component {

  state = {
    activeTab: 'dataPool',
  };

  // componentDidMount () {
  //   this.props.toggleLoading(true);
  //   getDataset(this.props.revealItemId).then(dataset => this.setState({
  //     dataset
  //   }));
  // }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  }

  render () {  
    if (!this.props.dataset) {
      return null;
    }

    const { t } = this.props;

    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ 
                active: this.state.activeTab === 'dataPool' 
              })}
              onClick={() => { this.toggle('dataPool'); }}
            >{t('dataset.data_pool.big_table')}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: this.state.activeTab === 'stationItem' 
              })}
              onClick={() => { this.toggle('stationItem'); }}
            >{t('dataset.test_station_and_test_item')}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: this.state.activeTab === 'material' 
              })}
              onClick={() => { this.toggle('material'); }}
            >{t('common.crucial_component')}
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="dataPool">
            <XwjDatasetRevealDataPool
              toggleLoading={this.props.toggleLoading}
              dataset={this.props.dataset} />
          </TabPane>
          <TabPane tabId="stationItem">
            <XwjDatasetRevealStationItem
              dataSetStationItem={this.props.dataset.dataSetStationItem}/>
          </TabPane>
          <TabPane tabId="material">
            <XwjDatasetRevealMaterial
              dataSetPart={this.props.dataset.dataSetPart}/>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

export default withTranslation()(XwjDatasetRevealDetailContainer);
