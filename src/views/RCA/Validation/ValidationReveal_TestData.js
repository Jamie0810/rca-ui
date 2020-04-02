import React from "react";
import {
  XwjAnalysisPoolIAO_Panel,
  XwjAnalysisPoolIAO_PanelBody,
  XwjAnalysisPoolIAO_PanelHeader
} from "../../XWJ/XwjAnalysisPoolIAO_Panel";
import { Table } from "reactstrap";
import {getTestDataValidation} from "../../../action/validation-action";
import { map } from "lodash";
import withLoading from "../../../utils/hoc/withLoading";
import {withTranslation} from "react-i18next";

class ValidationReveal_TestData extends React.Component{
  state = {
    information: []
  };

  componentDidMount() {
    getTestDataValidation(this.props.sn).then(information => {
      this.setState({
        information: information.result
      }, this.props.toggleLoading)
    })
  }

  render() {
    const { t } = this.props;
    return (
      <XwjAnalysisPoolIAO_Panel>
        <XwjAnalysisPoolIAO_PanelHeader caption={t('validation.tab.test_data')} />
        <XwjAnalysisPoolIAO_PanelBody>
          <Table responsive striped>
            <thead>
              <tr>
                <th className="border-top-0">{t('defect.test_datetime')}</th>
                <th className="border-top-0">{t('defect.test_station')}</th>
                <th className="border-top-0">{t('defect.test_equipment')}</th>
                <th className="border-top-0">{t('defect.invalid_flag')}</th>
                <th className="border-top-0">{t('defect.fail_symptom')}</th>
              </tr>
            </thead>
            <tbody>
              {map(this.state.information, (item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.testStartTime}</td>
                    <td>{item.station}</td>
                    <td>{item.testmachine}</td>
                    <td>{item.istruefail}</td>
                    <td>{item.failsymptom}</td>
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
export default withTranslation()(withLoading(ValidationReveal_TestData, true));
