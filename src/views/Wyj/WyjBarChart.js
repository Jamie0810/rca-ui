import React, {Component} from 'react';
import Highcharts from 'highcharts/highcharts';
import HighchartsReact from 'highcharts-react-official';
import {withTranslation} from "react-i18next";

class WyjBarChart extends Component {
	// state = {
	//  alertList: [],
  // };
  //
  // static getDerivedStateFromProps(props, state) {
  //   let alertList = props.alertList || [];
  //   return {alertList};
  // }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (nextProps.alertList !== this.props.alertList)
  }

  // componentDidUpdate(){
	// 	console.log('Barchart componentDidUpdate')
	// };
  //
  // componentWillUnmount() {
  //   console.log('Barchart componentWillUnmount')
  // }

  // shouldComponentUpdate(nextProps, nextState){
	// 	console.log('Barchart shouldComponentUpdate')
	// 	console.log('this.props.alertList:',this.props.alertList,'nextProps.alertList:', nextProps.alertList)
	// 	console.log('this.state.alertList:',this.state.alertList, 'nextState.alertList:',nextState.alertList)
	// 	if (this.props.alertList !== nextProps.alertList){
	// 		return true
	// 	} 
	// 	return false
	// }
	
	// componentDidUpdate (prevProps) {
  //   // console.log('Barchart componentDidUpdate, prevProps.alertList: ', prevProps.alertList, '; this.props.alertList: ', this.props.alertList)
  //   if (prevProps.alertList !== this.props.alertList) {
	// 		this.setState({ alertList: this.props.alertList });
  //   }
  // }

	render () {
    const { t } = this.props;
    let alertList = this.props.alertList || [];
		// console.log('Barchart render, this.state.alertList:', this.state.alertList)
		let options = {
			chart: {
				type: 'bar',
				backgroundColor:'#243047',
        marginTop: 30,
        marginBottom: 70,
				// height: this.chartHeight,
				// height: 300
			},
			title: {
				text: undefined,
			},
			xAxis: {
				// categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
				categories: alertList.map(item => {
					return item.failureSymptom_display;
				}),
				title: {
					text: t('defect.fail_symptom'),
					rotation: -90 ,//0
					style: {
						color: '#FFFFFF',
						fontSize:'14px',
						fontFamily: '"Microsoft Yahei", "Noto Sans","Avenir", Helvetica, Arial, sans-serif'
					}
				},
				labels:{
					style: {
					color: '#FFFFFF',
					fontSize:'14px'
					}
				}
			},
			yAxis: {
				min: 0,
        endOnTick: false,
        tickPixelInterval: 90,
				title: {
					text: `${t('defect.fail_rate')} (%)`,
					align: 'high',
					style: {
						color: '#FFFFFF',
						fontSize:'14px',
						fontFamily: '"Microsoft Yahei", "Noto Sans","Avenir", Helvetica, Arial, sans-serif'
					}
				},
				labels: {
				// overflow: 'justify',
					style: {
						color: '#FFFFFF',
						fontSize:'14px'
					}
				}
			},
      tooltip: {
        headerFormat: '<span style="font-size: 14px">{point.key}</span><br/>',
        valueSuffix: '%',
        valueDecimals: 2,
        style: {
          fontSize: "14px",
          fontWeight: "blod",
        },
      },
			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true,
						style: {
							color: '#FFFFFF',
							fontSize:'14px'
						}
					}
				}
			},
			credits: {
				enabled: false
			},
			legend: {
				align: 'center',
        margin: '20',
				itemStyle: {
					fontSize:'14px',//不良率
					color: '#FFFFFF'
				},
			},
			series: [{
				name: t('defect.fail_rate'),
				// data: [1, 2, 3,4,5],
				data: alertList.map(item => {
					return Number((item.failRate * 100).toFixed(2));
				}),
				color:'#2B908F',
			}],
		};
		return ( <HighchartsReact highcharts={Highcharts} options={options}/> )
	}
}

export default withTranslation()(WyjBarChart);
