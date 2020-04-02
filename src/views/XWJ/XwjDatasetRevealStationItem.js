import React from 'react';
import { Table, Label } from 'reactstrap';
import { withTranslation } from "react-i18next";
import { map, uniq } from 'lodash';

class XwjDatasetRevealStationItem extends React.Component {
  render () {
    const { t, dataSetStationItem } = this.props;
    const total = dataSetStationItem.length;
    const station = uniq(map(dataSetStationItem, 'station')).length;

    return (
      <div>
        <Label className="my-3">
          {t('dataset.data_pool.test_station_item_information', {
            station_count: station,
            item_count: total
          })}
        </Label>
        <Table responsive striped>
          <thead>
            <tr>
              <th className="border-top-0">{t('common.serial')}</th>
              <th className="border-top-0">{t('defect.test_station')}</th>
              <th className="border-top-0">{t('defect.test_item')}</th>
            </tr>
          </thead>
          <tbody>
          {
            dataSetStationItem.map((stationItem, index) => (
              <tr key={index}>
                <td>{index+1}</td>
                <td>{stationItem.station}</td>
                <td>{stationItem.item}</td>
              </tr>
            ))
          }
          </tbody>
        </Table>
      </div>
    );
  }
}

export default withTranslation()(XwjDatasetRevealStationItem);
