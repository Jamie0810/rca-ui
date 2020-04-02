import React from "react";
import {Button} from "reactstrap";
import Product_CodeMapper_FailSymptom from "./Product_CodeMapper_FailSymptom";
import Product_CodeMapper_Material from "./Product_CodeMapper_Material";
import Product_CodeMapper_Company from "./Product_CodeMapper_Company";
import Product_CodeMapper_DateCode from "./Product_CodeMapper_DateCode";
import {withTranslation} from "react-i18next";

const TAB_FAIL_SYMPTOM = 'fail_symptom';
const TAB_MATERIAL = 'material';
const TAB_COMPANY = 'company';
const TAB_DATE_CODE = 'date_code';

class Product_CodeMapper extends React.PureComponent{
  state = {
    activeTab: TAB_FAIL_SYMPTOM
  };

  PoolTargetContent(props) {
    switch (props.activeTab) {
      case TAB_FAIL_SYMPTOM:
        return (<Product_CodeMapper_FailSymptom {...props}/>);
      case TAB_MATERIAL:
        return (<Product_CodeMapper_Material {...props}/>);
      case TAB_COMPANY:
        return (<Product_CodeMapper_Company {...props}/>);
      case TAB_DATE_CODE:
        return (<Product_CodeMapper_DateCode {...props}/>);
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
            disabled={this.state.activeTab === TAB_FAIL_SYMPTOM}
            onClick={e => this.setState({ activeTab: TAB_FAIL_SYMPTOM })}
          >{t('product.label_code.function.fail_symptom')}</Button>
          <Button
            size="sm" color='white' className="border-left"
            disabled={this.state.activeTab === TAB_MATERIAL}
            onClick={e => this.setState({ activeTab: TAB_MATERIAL })}
          >{t('product.label_code.function.component')}</Button>
          <Button
            size="sm" color='white' className="border-left"
            disabled={this.state.activeTab === TAB_COMPANY}
            onClick={e => this.setState({ activeTab: TAB_COMPANY })}
          >{t('product.label_code.function.vendor')}</Button>
          <Button
            size="sm" color='white' className="border-left"
            disabled={this.state.activeTab === TAB_DATE_CODE}
            onClick={e => this.setState({ activeTab: TAB_DATE_CODE })}
          >{t('product.label_code.function.date_code')}</Button>
        </div>
        <PoolTargetContent {...this.props} activeTab={this.state.activeTab}/>
      </React.Fragment>
    );
  }
}

export default withTranslation()(Product_CodeMapper);
