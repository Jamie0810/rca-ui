import React, {Component, PureComponent} from "react";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';

const xTickLabelLength = 10;


class BarChart extends PureComponent {
  render() {
    let bar = {
      labels: this.props.labels,
      datasets: this.props.datasets
    };

    let options = {
      legend: {
        labels: {
          fontStyle: 'bold',
          fontColor: '#000000',
          fontSize: 14
        }
      },
      tooltips: {
        enabled: true,
        callbacks: {
          title: function (items, data) {
            return data.labels[items[0].index];
          },
          label: function (tooltipItem, config) {
            return `${config.datasets[tooltipItem.datasetIndex].label}: ${tooltipItem.yLabel}%`;
          }
        }
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: '(%)',
            fontSize: 13,
            fontColor: '#000000',
            padding: 0,
            lineHeight: 'normal'
          },
          ticks: {
            maxTicksLimit: 5,
            beginAtZero: true,
            // fontStyle: "bold",
            fontSize: 13,
            fontColor: '#000000',
          }
        }],
        xAxes: [{
          barPercentage: 0.8,
          categoryPercentage: 0.6,
          ticks: {
            fontSize: 15,
            fontColor: '#000000',
            // Include a dollar sign in the ticks
            callback: function (value) {
              return value.substr(0, xTickLabelLength) + (value.length > xTickLabelLength? '...': '' )
            }
          }
        }]
      },
      plugins: {
        datalabels: {
          color: '#000000',
          anchor: 'start',
          align: 'end',
          offset: -3,
          font: {
            size: '14'
            // style: 'bold',
          }
        }
      }
    };

    let plugins = [ChartDataLabels];

    return (
      <div className="chart-wrapper pt-3" style={{ height: '250px' }}>
        <Bar data={bar} options={options} plugins={plugins} />
      </div>
    );
  }
}

export default BarChart
