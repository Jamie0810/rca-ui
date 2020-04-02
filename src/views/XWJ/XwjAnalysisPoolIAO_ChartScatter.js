import React from "react";
import {isEmpty, map} from 'lodash';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsExporting from 'highcharts/modules/exporting';
import Boost from 'highcharts/modules/boost';
import {COLOR_SERIES} from "../../utils/color-util";
import {withTranslation} from "react-i18next";

Boost(Highcharts);
HighchartsExporting(Highcharts);

class XwjAnalysisPoolIAO_ChartScatter extends React.PureComponent {
  render() {
    const {
      t,
      setting: {caption, xField, yField, xTitle, yTitle, xStart, xEnd, yStart, yEnd, groupField},
      data: {chart_data, statistic: {boundary = {}}, updateTime}
    } = this.props;

    let options = {
      chart: {
        type: 'scatter',
        height: 360,
        zoomType: 'xy',
      },
      boost: {
        useGPUTranslations: true,
        usePreAllocated: true
      },
      colors: COLOR_SERIES,
      title: {
        text: caption || `#${xField} #${yField}`
      },
      subtitle: {
          // text: 'Source: Heinz  2003'
      },
      xAxis: {
        title: {
          enabled: true,
          text: xTitle || xField
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true,
        // max: xStart,
        // min: xEnd
        plotLines: [
          {
            value: boundary.XtestLower,
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
            value: boundary.XtestUpper,
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
        ]
      },
      yAxis: {
        title: {
          text: yTitle || yField
        },
        // max: yStart,
        // min: yEnd
        plotLines: [
          {
            value: boundary.YtestLower,
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
            value: boundary.YtestUpper,
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
        ]
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
      plotOptions: {
        scatter: {
          marker: {
            // radius: 5,
            states: {
              hover: {
                enabled: true,
                lineColor: 'rgb(100,100,100)'
              }
            }
          },
          states: {
            hover: {
              marker: {
                enabled: false
              }
            }
          },
          // tooltip: {
          //   headerFormat: '<b>{series.name}</b><br>',
          //   pointFormat: '{point.x} cm, {point.y} kg'
          // }
        }
      },
      series: map(chart_data, (groupData, key) => ({
        name: isEmpty(key)? t('common.undefined'): key,
        // color: COLOR_SERIES[index++],
        data: map(groupData, point => ([point.x, point.y]))
      })),
    };
    return ( <HighchartsReact highcharts={Highcharts} options={options} /> );
  }
}

export default withTranslation()(XwjAnalysisPoolIAO_ChartScatter);
