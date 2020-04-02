import React from 'react';
import { Table, Label } from 'reactstrap';
import {withTranslation} from "react-i18next";

class XwjDatasetRevealMaterial extends React.PureComponent {

  render () {
    const { t, dataSetPart } = this.props;

    return (
      <div>
        <Label className="my-3">
          {t('dataset.crucial_component_kinds_template', {count: this.props.dataSetPart.length})}
        </Label>
        <Table responsive striped>
          <thead>
            <tr>
              <th className="border-top-0">{t('common.serial')}</th>
              <th className="border-top-0">{t('common.crucial_component')}</th>
            </tr>        
          </thead>
          <tbody>
          {
            dataSetPart.map(({component}, index) => (
              <tr key={index}>
                <td>{index+1}</td>
                <td>{component}</td>
              </tr>
            ))
          }
          </tbody>
        </Table>
      </div>
    );
  }
}

export default withTranslation()(XwjDatasetRevealMaterial);
