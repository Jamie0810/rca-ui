import React from "react";
import {
  XwjAnalysisPoolIAO_Panel,
  XwjAnalysisPoolIAO_PanelBody,
  XwjAnalysisPoolIAO_PanelHeader
} from "../XWJ/XwjAnalysisPoolIAO_Panel";
import { Table } from "reactstrap";
import { map } from "lodash";
import withLoading from "../../utils/hoc/withLoading";
import {withTranslation} from "react-i18next";
import {getProductSymptomCodeGroup} from "../../action/code-action";

class Product_CodeMapper_FailSymptom extends React.PureComponent{
  state = {
    codeMapperData: []
  };

  componentDidMount() {
    getProductSymptomCodeGroup(this.props.product.id).then(codeMapperData => {
      this.setState({ codeMapperData }, this.props.toggleLoading);
    })
  };

  render() {
    const { t } = this.props;

    return (
      <XwjAnalysisPoolIAO_Panel>
        <XwjAnalysisPoolIAO_PanelHeader caption={t('product.label_code.function.fail_symptom')}/>
        <XwjAnalysisPoolIAO_PanelBody>
          <Table responsive striped>
            <thead>
              <tr>
                <th className="border-top-0">{t('label_code.type_options.fail_symptom')}</th>
                <th className="border-top-0">{t('common.description')}</th>
              </tr>
            </thead>
            <tbody>
              {map(this.state.codeMapperData, item => {
                return (
                  <tr key={item.id}>
                    <td>{item.code}</td>
                    <td>{item.codeName}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </XwjAnalysisPoolIAO_PanelBody>
      </XwjAnalysisPoolIAO_Panel>
    );
  };
}

export default withTranslation()(withLoading(Product_CodeMapper_FailSymptom, true));
