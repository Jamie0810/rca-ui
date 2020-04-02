import React from "react";
import {map, orderBy, values} from 'lodash';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsExporting from 'highcharts/modules/exporting';
import {COLOR_SERIES} from "../../utils/color-util";
import {withTranslation} from "react-i18next";

HighchartsExporting(Highcharts);

class XwjAnalysisPoolIAO_ChartNormalDistribution extends React.PureComponent {
  render() {
    const {
      t,
      setting: {caption, xField, xTitle},
      data: {chart_data, statistic: {boundary, min, classInterval}, updateTime}
    } = this.props;

    let plotLines = [
      {
        value: boundary.testLower,
        color: 'red',
        width: 1,
        zIndex: 3,
        label: {
          // text: '規格下限',
          align: 'center',
          style: {
            color: 'gray'
          }
        }
      }, {
        value: boundary.testUpper,
        color: 'red',
        width: 1,
        zIndex: 4,
        label: {
          // text: '規格上限',
          align: 'center',
          style: {
            color: 'gray'
          }
        }
      }
    ];

    let options = {
      chart: {
        // type: 'scatter',
        height: 360,
        zoomType: 'xy',
      },
      colors: COLOR_SERIES,
      title: {
        text: caption || `#${xField}`
      },
      yAxis: [{
        min: 0,
        // max: 1,
        title: {
          text: t('common.probability_density_function')
        }
      }, {
        title: {
          text: t('common.amount')
        },
        opposite: true
      }],
      plotOptions: {
        series: {
          pointStart: min, // 开始值
          pointInterval: classInterval,
          // pointPlacement: 'between'
        }
      },
      xAxis: {
        plotLines: plotLines,
        title: {
          text: xTitle || xField
        },
        tickPositions: map(orderBy(chart_data.nd_data, ['xValue']), 'xValue')
      },
      series: [{
        // pointStart: 20, // 开始值
        // pointInterval: 1,
        type: 'spline',
        name: t('common.distribution'),
        // data: [],
        data: map(orderBy(chart_data.nd_data, ['xValue']), 'yValue'),
        marker: {
          enabled: false
        },
        zIndex: 2
      },{
        yAxis: 1,
        type: 'column',
        name: t('common.amount'),
        // pointStart: 25, // 开始值
        // pointInterval: 1,
        pointPadding: 0,
        groupPadding: 0,
        borderWidth: 0,
        // shadow: false,
        // data: [],
        data: map(orderBy(chart_data.bar_data, ['xValue']), 'yValue'),
        zIndex: 1
      }]
    };
    return ( <HighchartsReact highcharts={Highcharts} options={options} /> );
  }
}

export default withTranslation()(XwjAnalysisPoolIAO_ChartNormalDistribution);
