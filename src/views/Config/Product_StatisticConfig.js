import React from "react";
import Product_StatisticTestStation from "./Product_StatisticTestStation";
import Product_StatisticEssentialMaterial from "./Product_StatisticEssentialMaterial";
import Product_StatisticMaterialTransform from "./Product_StatisticMaterialTransform";
import {Button} from "reactstrap";
import {withTranslation} from "react-i18next";

const TAB_TEST_STATION = 'fail_symptom';
const TAB_ESSENTIAL_MATERIAL = 'essential_material';
const TAB_MATERIAL_TRANSFORM = 'material_transform';

class Product_StatisticConfig extends React.PureComponent{
  state = {
    activeTab: TAB_TEST_STATION
  };

  PoolTargetContent(props) {
    switch (props.activeTab) {
      case TAB_TEST_STATION:
        return (<Product_StatisticTestStation {...props}/>);
      case TAB_ESSENTIAL_MATERIAL:
        return (<Product_StatisticEssentialMaterial {...props}/>);
      case TAB_MATERIAL_TRANSFORM:
        return (<Product_StatisticMaterialTransform {...props}/>);
      default:
        return null;
    }
  };

  render() {
    const { t } = this.props;
    let PoolTargetContent = this.PoolTargetContent;

    return (
      <React.Fragment>
        <div className="text-right px-3">
          <Button
            size="sm" color='white' className="border-left"
            disabled={this.state.activeTab === TAB_TEST_STATION}
            onClick={e => this.setState({ activeTab: TAB_TEST_STATION })}
          >{t('product.data_filter.crucial_test_station_caption')}</Button>
          <Button
            size="sm" color='white' className="border-left"
            disabled={this.state.activeTab === TAB_ESSENTIAL_MATERIAL}
            onClick={e => this.setState({ activeTab: TAB_ESSENTIAL_MATERIAL })}
          >{t('product.data_filter.crucial_component_caption')}</Button>
          <Button
            size="sm" color='white' className="border-left"
            disabled={this.state.activeTab === TAB_MATERIAL_TRANSFORM}
            onClick={e => this.setState({ activeTab: TAB_MATERIAL_TRANSFORM })}
          >{t('product.data_filter.material_code_conversion_caption')}</Button>
        </div>
        <PoolTargetContent {...this.props} activeTab={this.state.activeTab}/>
      </React.Fragment>
    );
  }
}

export default withTranslation()(Product_StatisticConfig);
