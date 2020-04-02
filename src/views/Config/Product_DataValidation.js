import React from "react";
import Product_DataValidationInformation from "./Product_DataValidationInformation";
import Product_DataValidationResult from "./Product_DataValidationResult";
import {
  getFtpDataValidation,
  getProductValidation, getSummaryValidation,
  getValidationInfo,
} from "../../action/product-action";
import {pick} from 'lodash';
import {withTranslation} from "react-i18next";

function Product_FtpDataValidation (props) {
  return (
    <Product_DataValidationResult
      product={props.product}
      dataProvider={getFtpDataValidation}
      title={props.t('product.validation.type.ftp_source_date_format')}
    />
  );
}

function Product_ProductValidation (props) {
  return (
    <Product_DataValidationResult
      product={props.product}
      dataProvider={getProductValidation}
      title={props.t('product.validation.type.product')}
    />
  );
}

function Product_SummaryDataValidation (props) {
  return (
    <Product_DataValidationResult
      product={props.product}
      dataProvider={getSummaryValidation}
      title={props.t('product.validation.type.summary_data_format')}
    />
  );
}

class Product_DataValidation extends React.PureComponent {
  state = {};

  componentDidMount() {
    getValidationInfo(this.props.product.id)
      .then(validation => this.setState(validation));
  }

  render() {
    const props = pick(this.props, ['t', 'product']);

    return (
      <React.Fragment>
        <Product_DataValidationInformation validationInfo={this.state} />
        <Product_FtpDataValidation {...props} />
        <Product_ProductValidation {...props} />
        <Product_SummaryDataValidation {...props} />
      </React.Fragment>
    );
  }
}

export default withTranslation()(Product_DataValidation);
