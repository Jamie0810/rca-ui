import React from "react";
import { Table } from 'reactstrap';
import { map } from 'lodash';
import { getAnalysisPoolStatisticsData } from '../../action/analysis-pool-action';
import {withTranslation} from "react-i18next";

class XwjAnalysisPoolIAO_TargetStatistics extends React.PureComponent {
 
  state = {
    statisticData: {}
  }
  
  componentDidMount () {
    getAnalysisPoolStatisticsData(this.props.match.params.id).then(data => {
      this.setState({ statisticData: data.dataStatistic });
    })
  }

  render() {
    const { t } = this.props;

    return (
      <Table responsive striped>
        <thead>
          <tr>
            <th className="border-top-0">{t('common.field')}</th>
            <th className="border-top-0">{t('common.type')}</th>
            <th className="border-top-0">{t('analysis_set.target.statistic_summary')}</th>
          </tr>
        </thead>
        <tbody>
        {
          map(this.state.statisticData,  (data, field) => {
            // console.log('data',data, 'field',field)
            return (
              <tr key={field}>
                <td>{field}</td>
                <td>{data.type}</td>
                <td>
                  msg: {data.msg}<br/>
                  Total: {data.total}<br/>
                  missing: {data.missing}<br/>
                  {data.min? 'min:'+ data.min : null} 
                  {data.max? 'max:'+ data.max : null} 
                  {data.deviation? 'deviation:'+ data.deviation : null} 
                  {data.total_Sum? 'total_Sum:'+ data.total_Sum : null} 
                  {data.temp_length? 'temp_length:'+ data.temp_length : null} 
                  </td>
              </tr>
            );
            })
          }
        </tbody>
      </Table>
    );
  }
}

export default withTranslation()(XwjAnalysisPoolIAO_TargetStatistics);
