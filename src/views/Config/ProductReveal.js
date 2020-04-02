import React from "react";
import {Button, Card, CardHeader} from "reactstrap";
import CardBody from "reactstrap/es/CardBody";
import ProductInformation from "./ProductInformation";
import ProductFunctions from "./ProductFunctions";
import { getProductInformation } from "../../action/product-action";
import withNotify from "../../../src/utils/hoc/withNotify";
import {withTranslation} from "react-i18next";

class ProductReveal extends React.PureComponent{
  id = this.props.match.params.id;

  state = {
    product: {}
  };

  componentDidMount() {
    getProductInformation(this.id).then(product => {
      this.setState({ product }, this.props.toggleLoading)
    })
  }

  render() {
    const { t } = this.props;

    return (
      <Card>
        <CardHeader className="px-4">
          <span>{t('common.basic_information')}</span>
          <div className="card-header-actions">
            <Button
              color="link"
              className="card-header-action"
              onClick={this.toEdit}>
              <i className="fa fa-pencil fa-lg" />
            </Button>
          </div>
        </CardHeader>
        <CardBody className="border-bottom">
          {this.state.product? (
            <React.Fragment>
              <ProductInformation product={this.state.product}/>
              <div className="pt-4">
                <ProductFunctions {...this.props} product={this.state.product}/>
              </div>
            </React.Fragment>
          ): null}
        </CardBody>
      </Card>
    );
  };

  toEdit = () => {
    this.props.history.push({
      pathname: `/configuration/products/${this.id}/edit`,
      product: this.state.product
    });
  };
}

export default withTranslation()(withNotify(ProductReveal, true));
