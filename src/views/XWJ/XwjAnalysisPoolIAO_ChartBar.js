import React from "react";
import {isEmpty, map} from 'lodash';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsExporting from 'highcharts/modules/exporting';
import {COLOR_SERIES} from "../../utils/color-util";
import {withTranslation} from "react-i18next";

HighchartsExporting(Highcharts);

class XwjAnalysisPoolIAO_ChartBar extends React.PureComponent {
  render() {
    const {
      t,
      setting: {caption, yField, yTitle, groupField, groupFieldTag, groupField2, yObserved},
      data: {chart_data, statistic, updateTime}
    } = this.props;

    let options = {
      chart: {
        type: 'column',
        height: 360,
        zoomType: 'x',
        panning: true,
        panKey: 'shift',
      },
      colors: COLOR_SERIES,
      title: {
        text: caption || `#${yField}`
      },
      // subtitle: {
      //   text: 'Source: WorldClimate.com'
      // },
      xAxis: {
        categories: chart_data.categories,
        crosshair: true,
        title: {
          enabled: true,
          text: groupFieldTag || groupField
        },
      },
      yAxis: {
        // min: 0,
        title: {
          text: yTitle || yField
        }
      },
      legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 100,
        y: 70,
        floating: true,
        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
        borderWidth: 1
      },
      // tooltip: {
      //   headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      //   pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      //     '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
      //   footerFormat: '</table>',
      //   shared: true,
      //   useHTML: true
      // },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: map(chart_data.series, (data, name) => ({data, name: isEmpty(name)? t('common.undefined'): name}))
    };
    return ( <HighchartsReact highcharts={Highcharts} options={options} /> );
  }
}

export default withTranslation()(XwjAnalysisPoolIAO_ChartBar);
