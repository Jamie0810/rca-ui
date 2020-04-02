import React from "react";
import {
  XwjAnalysisPoolIAO_Panel,
  XwjAnalysisPoolIAO_PanelBody,
  XwjAnalysisPoolIAO_PanelHeader
} from "../XWJ/XwjAnalysisPoolIAO_Panel";
import { Table } from "reactstrap";
import { getSNInformation } from "../../action/validation-action";
import { map } from "lodash";
import withLoading from "../../utils/hoc/withLoading";
import {withTranslation} from "react-i18next";

class SNDetailMainTableBreakDown extends React.Component{
  state = {
    SNInformaion: []
  }

  componentDidMount() {
    getSNInformation(this.props.sn, 'detail').then(SNInformaion => {
      this.setState({ 
        SNInformaion: SNInformaion.result
      }, this.props.toggleLoading)
    })
  }

  render() {
    const { t } = this.props;
    return (
      <XwjAnalysisPoolIAO_Panel>
        <XwjAnalysisPoolIAO_PanelHeader caption={t('validation.tab.assemble_detail')}>
          {this.props.children}
        </XwjAnalysisPoolIAO_PanelHeader>
        <XwjAnalysisPoolIAO_PanelBody>
          <Table responsive striped>
            <thead>
              <tr>
                <th className="border-top-0">{t('defect.assemble_datetime')}</th>
                <th className="border-top-0">{t('common.id')}</th>
                <th className="border-top-0">{t('defect.assemble_station')}</th>
                <th className="border-top-0">{t('defect.assemble_item')}</th>
                <th className="border-top-0">{t('defect.assemble_item_sn')}</th>
                <th className="border-top-0">{t('common.line')}</th>
              </tr>
            </thead>
            <tbody>
              {map(this.state.SNInformaion, (item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.assemblyTime}</td>
                    <td>{item.id}</td>
                    <td>{item.teststation}</td>
                    <td>{item.part}</td>
                    <td>{item.partsn}</td>
                    <td>{item.line}</td>
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
export default withTranslation()(withLoading(SNDetailMainTableBreakDown, true));
