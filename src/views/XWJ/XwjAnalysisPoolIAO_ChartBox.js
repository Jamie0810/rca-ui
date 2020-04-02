import React from "react";
import {values, keys, isEmpty, map, concat} from 'lodash';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsExporting from 'highcharts/modules/exporting';
import {COLOR_SERIES} from "../../utils/color-util";
import {withTranslation} from "react-i18next";

HighchartsMore(Highcharts);
HighchartsExporting(Highcharts);

class XwjAnalysisPoolIAO_ChartBox extends React.PureComponent {
  render() {
    const {
      t,
      setting: {caption, yField, yTitle, yStart, yEnd, groupField, groupFieldTag},
      data: {chart_data: {group}, statistic: {boundary}, updateTime}
    } = this.props;
    let plotLines = [
      {
        value: boundary.testLower,
        color: 'red',
        width: 1,
        zIndex: 3,
        label: {
          text: t('common.range_lower_bound'),
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
          text: t('common.range_upper_bound'),
          align: 'center',
          style: {
            color: 'gray'
          }
        }
      }
    ];
    // let index = 0;
    let options = {
      chart: {
        type: 'boxplot',
        height: 360,
        zoomType: 'x',
        panning: true,
        panKey: 'shift',
      },
      colors: COLOR_SERIES,
      title: {
        text: caption || `#${yField} by #${groupField}`
      },

      // legend: {
      //   layout: 'vertical',
      //   align: 'left',
      //   verticalAlign: 'top',
      //   x: 100,
      //   y: 70,
      //   floating: true,
      //   backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
      //   borderWidth: 1
      // },

      legend: {
        enabled: false
      },

      xAxis: {
        categories: keys(group).map(name => (isEmpty(name)? t('common.undefined'): name)),
        title: {
          text: groupFieldTag
        }
      },

      yAxis: {
        title: {
          text: yTitle
        },
        max: yEnd,
        min: yStart,
        plotLines: plotLines,
      },

      series: [{
        name: yTitle,
        data: map(group, ({value}) => value),
        // tooltip: {
        //   headerFormat: '<em>Experiment No {point.key}</em><br/>'
        // }
      }, {
        name: 'Outlier',
        // color: Highcharts.getOptions().colors[0],
        type: 'scatter',
        data: concat(...values(group).map(({outlier = []}, index) => outlier.map(v => ([index, v])))),
        // data: [ // x, y positions where 0 is the first category
        //   [0, 644],
        //   [4, 718],
        //   [4, 951],
        //   [4, 969]
        // ],
        // marker: {
        //   fillColor: 'white',
        //   lineWidth: 1,
        //   lineColor: Highcharts.getOptions().colors[0]
        // },
        // tooltip: {
        //   pointFormat: 'Observation: {point.y}'
        // }
      }
      ]

    };
    return ( <HighchartsReact highcharts={Highcharts} options={options} /> );
  }
}

export default withTranslation()(XwjAnalysisPoolIAO_ChartBox);
