import React from 'react';
import { Col, FormGroup, Button } from 'reactstrap';
import DataModal from "../Coommon/DataModal";
import XwjDataSetSourceInfo from "./XwjDataSetSourceInfo";
import {withTranslation} from "react-i18next";
import {BlockLabel, BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";

class XwjAnalysisPoolInformation extends React.PureComponent {

  state = {
    dataSetSourceModal: false,
  };

  render() {
    const { t } = this.props;

    return (
      <React.Fragment>
        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('common.product')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <BlockLabel>
              {this.props.analysisPoolInfo.product} 
            </BlockLabel>
          </FormValueColumn>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('analysis_set.data_source')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <Button
              color="link" 
              className="p-0"
              onClick={this.dataSetSourceModalToggle}>
              {this.props.analysisPoolInfo.dataSetName}
            </Button>
            <DataModal
              caption={t('common.basic_information')} size="xl"
              isOpen={this.state.dataSetSourceModal}
              toggle={this.dataSetSourceModalToggle}
              confirm={this.dataSetSourceConfirm}>
              <XwjDataSetSourceInfo 
                dataSetId={this.props.analysisPoolInfo.dssId}/>
            </DataModal>
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('analysis_set.name')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <BlockLabel>
              {`${this.props.analysisPoolInfo.name} (#${this.props.analysisPoolInfo.id})`}
            </BlockLabel>
          </FormValueColumn>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('analysis_set.data_update_datetime')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <BlockLabel>
              {this.props.analysisPoolInfo.dataLastDate}
            </BlockLabel>
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('common.description')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <BlockLabel>
              {this.props.analysisPoolInfo.remark}
            </BlockLabel>
          </FormValueColumn>
        </FormRow>
      </React.Fragment>
    );
  }

  dataSetSourceModalToggle = () => {
    this.setState(prevState => ({ 
      dataSetSourceModal: !prevState.dataSetSourceModal 
    }));
  };

  dataSetSourceConfirm = () => {
    this.setState({
      dataSetSourceModal: false
    });
  };
}

export default withTranslation()(XwjAnalysisPoolInformation);
