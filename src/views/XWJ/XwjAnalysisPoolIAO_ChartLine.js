import React from "react";
import { map } from 'lodash';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsExporting from 'highcharts/modules/exporting';
import {COLOR_SERIES} from "../../utils/color-util";

HighchartsExporting(Highcharts);

class XwjAnalysisPoolIAO_ChartLine extends React.PureComponent {
  render() {
    let {
      setting: {caption, yField, yTitle, groupField, groupFieldTag, yObserve},
      data: {chart_data, statistic, updateTime}
    } = this.props;

    let options = {
      chart: {
        type: 'line',
        height: 360,
        zoomType: 'x',
        panning: true,
        panKey: 'shift',
        // scrollablePlotArea: {
        //   minWidth: 600
        // }
      },
      colors: COLOR_SERIES,

      title: {
        text: caption || `#${yField}`
      },

      // subtitle: {
      //   text: 'An annotated chart in Highcharts'
      // },

      xAxis: {
        // pointInterval: 3600000, // one hour
        // pointStart: Date.UTC(2018, 1, 13, 0, 0, 0),
        type: 'datetime',
        // title: {
        //   text: `#${groupField}`
        // },
        // dateTimeLabelFormats: {
        //   day: '%e\%b\%y',
        //   month: '%b \'%y'
        // }
      },

      yAxis: {
        // max: 1,
        startOnTick: true,
        // endOnTick: false,
        // maxPadding: 0.35,
        title: {
          text: yTitle || `#${yField}`
        },
        // labels: {
        //   format: '{value} m'
        // }
      },

      // tooltip: {
      //   headerFormat: 'Distance: {point.x:.1f} km<br>',
      //   pointFormat: '{point.y} m a. s. l.',
      //   shared: true
      // },

      legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 100,
        y: 70,
        floating: true,
        // backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
        borderWidth: 1
      },

      series: [{
        data: map(chart_data.line_data, point => ([point.xValue, point.yValue])),
        // fillOpacity: 0.5,
        name: yTitle || `#${yField}`,
        marker: {
          enabled: true
        },
        // threshold: null
      }]

    };
    return ( <HighchartsReact highcharts={Highcharts} options={options} /> );
  }
}

export default XwjAnalysisPoolIAO_ChartLine;
