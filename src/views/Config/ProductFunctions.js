import React from "react";
import {Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import classnames from "classnames";
import Product_DataLogic from "./Product_DataLogic";
import Product_StatisticConfig from "./Product_StatisticConfig";
import Product_CodeMapper from "./Product_CodeMapper";
import Product_DataValidation from "./Product_DataValidation";
import {withTranslation} from "react-i18next";

class ProductFunctions extends React.PureComponent {
  state = {
    activeTab: 'PRODUCT_DATA_LOGIC'
  };

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  };

  render() {
    const { t } = this.props;

    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({
                active: this.state.activeTab === 'PRODUCT_DATA_LOGIC'
              })}
              onClick={() => { this.toggle('PRODUCT_DATA_LOGIC'); }}
            >{t('product.function.data_capture')}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: this.state.activeTab === 'PRODUCT_STATISTIC_CONFIG'
              })}
              onClick={() => { this.toggle('PRODUCT_STATISTIC_CONFIG'); }}
            >{t('product.function.data_filter')}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: this.state.activeTab === 'PRODUCT_CODE_MAPPER'
              })}
              onClick={() => { this.toggle('PRODUCT_CODE_MAPPER'); }}
            >{t('product.function.label_code')}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: this.state.activeTab === 'PRODUCT_DATA_VALIDATION'
              })}
              onClick={() => { this.toggle('PRODUCT_DATA_VALIDATION'); }}
            >{t('product.function.validation')}
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="PRODUCT_DATA_LOGIC">
            {this.state.activeTab === 'PRODUCT_DATA_LOGIC'? (
              <Product_DataLogic {...this.props} />
            ): null}
          </TabPane>
          <TabPane tabId="PRODUCT_STATISTIC_CONFIG">
            {this.state.activeTab === 'PRODUCT_STATISTIC_CONFIG'? (
              <Product_StatisticConfig {...this.props}/>
            ): null}
          </TabPane>
          <TabPane tabId="PRODUCT_CODE_MAPPER">
            {this.state.activeTab === 'PRODUCT_CODE_MAPPER'? (
              <Product_CodeMapper {...this.props}/>
            ): null}
          </TabPane>
          <TabPane tabId="PRODUCT_DATA_VALIDATION">
            {this.state.activeTab === 'PRODUCT_DATA_VALIDATION'? (
              <Product_DataValidation {...this.props}/>
            ): null}
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

export default withTranslation()(ProductFunctions);
