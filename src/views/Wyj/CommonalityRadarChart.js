import React, {PureComponent} from 'react';
import HighchartsReact from 'highcharts-react-official';
import highchartsMore from 'highcharts/highcharts-more';
import Highcharts from 'highcharts/highcharts';
import {withTranslation} from "react-i18next";

highchartsMore(Highcharts);

class CommonalityRadarChart extends PureComponent {
  render () {
    const { t } = this.props;
    const options = {
      chart: {
        animation: false,
        polar: true,
        type: 'area',
        backgroundColor: '#243047',
        marginBottom: -70,
      },
      credits: {
        enabled: false
      },
      xAxis: {
        // offset: -20,
        categories: [t('defect.assembling'), t('defect.station'), t('defect.date_code')],
        tickmarkPlacement: 'on',
        lineWidth: 0,
        // gridLineColor: '#37474F',
        labels: {
          style: {
            color: '#FFFFFF',
            fontSize: '18px',
            fontFamily: '"Microsoft Yahei", "Noto Sans","Avenir", Helvetica, Arial, sans-serif'
          },
          y: -5
        },
      },
      yAxis: {
        showLastLabel: true,
        gridLineInterpolation: 'polygon',
        min: 0,
        max: 100,
        lineColor: '#455A64',
        tickInterval: 20,
        labels: {
          format: '{value}%',
          style: {
            color: '#FFFFFF',
            fontSize: '14px'
          }
        },
        gridLineColor: '#37474F',
      },
      tooltip: {
        backgroundColor: '#FCFFC5',
        headerFormat: '<span style="font-size: 14px">{point.key}</span><br/>',
        style: {
          fontSize: "14px",
          fontWeight: "blod",
        },
        // valueDecimals: 2,
        valueSuffix: '%',
      },
      legend: {
        align: 'center',
        color: '#A8ABB5',
        itemStyle: {
          fontSize:'14px',//集中性的點
          color: '#FFFFFF'
        },
      },
      series: [{
        // connectNulls: true,
        // connectEnds: true,
        color: '#FF9120',
        name: '集中性',
        data: this.props.commonality,
        pointPlacement: 'on',
        marker: {
          radius: 10
        }
      }],
      plotOptions: {
        area: {
          findNearestPointBy: 'xy'
        },
        boxplot: {
          colorByPoint: false,
          fillColor: '#FFCCBC',
          // gapSize: 2
        }
      }
    };
    return (<HighchartsReact options={options} highcharts={Highcharts}/>)
  }
}
export default withTranslation()(CommonalityRadarChart);
