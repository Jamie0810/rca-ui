import React, { Component } from 'react';
import { Table } from 'reactstrap';
import {withTranslation} from "react-i18next";

class CommonalityAnalysis extends Component {
  render () {
    const { t } = this.props;
    let {failureSymptom_display, testStation, riskList = []} = this.props.selectedYield || {};
    const tableCaption = failureSymptom_display + '@' + testStation;

    return (
      <React.Fragment>
        <div className="h2 wyj-text-brown text-center">
          {t('wyj.commonality_analysis_template', {name: tableCaption})}
        </div>
        <Table className="h4 mt-3 text-white">
          <thead className="font-weight-bold">
            <tr>
              <th className="align-middle text-left">{t('common.type')}</th>
              <th className="align-middle text-left">{t('defect.risk')}</th>
              <th className="align-middle text-left">{t('wyj.risk_id')}</th>
              <th className="align-middle text-right">{t('defect.commonality')}</th>
              <th className="align-middle text-center">{t('wyj.risk_defect_amount')}</th>
            </tr>
          </thead>
          <tbody className="font-weight-normal">
            {riskList.map((item, i) => {
              return (
                <tr key={i}>
                  <td className="text-left">
                    <svg height="10" width="10">
                      <circle cx="5" cy="5" r="4" fill={item.riskSignalColor} />
                    </svg>
                    <span className="ml-1">{t(item.riskTypeLabel)}</span>
                  </td>
                  <td className="text-left">{item.riskName_display}</td>
                  <td className="word-break-all text-left">{item.riskId_display}</td>
                  <td className="text-right">{item.commonalityLabel}
                    <span className="wyj-punctuation-color"> %</span>
                  </td>
                  <td className="text-center">{item.riskFailQty}
                    <span className="wyj-punctuation-color"> / </span>
                    {item.riskInput}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </React.Fragment>
    );
  }
}

export default withTranslation()(CommonalityAnalysis);
