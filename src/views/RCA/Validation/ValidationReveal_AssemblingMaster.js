import React from "react";
import {
  XwjAnalysisPoolIAO_Panel,
  XwjAnalysisPoolIAO_PanelBody,
  XwjAnalysisPoolIAO_PanelHeader
} from "../../XWJ/XwjAnalysisPoolIAO_Panel";
import { Table } from "reactstrap";
import { getAssemblingMasterDataValidation } from "../../../action/validation-action";
import { map } from "lodash";
import withLoading from "../../../utils/hoc/withLoading";
import {withTranslation} from "react-i18next";

class ValidationReveal_AssemblingMaster extends React.Component{
  state = {
    information: []
  }

  componentDidMount() {
    getAssemblingMasterDataValidation(this.props.sn).then(information => {
      this.setState({
        information: information.result
      }, this.props.toggleLoading)
    })
  }

  render() {
    const { t } = this.props;
    return (
      <XwjAnalysisPoolIAO_Panel>
        <XwjAnalysisPoolIAO_PanelHeader caption={t('validation.tab.assemble_master')} />
        <XwjAnalysisPoolIAO_PanelBody>
          <Table responsive striped>
            <thead>
              <tr>
                <th className="border-top-0">{t('defect.assemble_datetime')}</th>
                <th className="border-top-0">{t('common.id')}</th>
                <th className="border-top-0">{t('defect.assemble_station')}</th>
                <th className="border-top-0">{t('defect.wo')}</th>
                <th className="border-top-0">{t('common.floor')}</th>
              </tr>
            </thead>
            <tbody>
              {map(this.state.information, (item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.assemblyTime}</td>
                    <td>{item.id}</td>
                    <td>{item.teststation}</td>
                    <td>{item.wo}</td>
                    <td>{item.floor}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </XwjAnalysisPoolIAO_PanelBody>
      </XwjAnalysisPoolIAO_Panel>
    );
  }
}
export default withTranslation()(withLoading(ValidationReveal_AssemblingMaster, true));
