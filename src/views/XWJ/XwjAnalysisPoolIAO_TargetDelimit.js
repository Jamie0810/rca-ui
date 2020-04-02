import React from "react";
import {Button, Input} from "reactstrap";
import {isEmpty, map} from 'lodash';
import DataModal from "../Coommon/DataModal";
import XwjAnalysisPoolIAO_TargetDelimitFieldPicker from "./XwjAnalysisPoolIAO_TargetDelimitFieldPicker";
import XwjAnalysisPoolIAO_TargetDelimitFieldMaker from "./XwjAnalysisPoolIAO_TargetDelimitFieldMaker";
import XwjAnalysisPoolIAO_TargetDelimitFieldCriteria from "./XwjAnalysisPoolIAO_TargetDelimitFieldCriteria";
import {getDatasetFields} from "../../action/dataset-action";
import {updateAnalysisSetFieldConfig} from "../../action/analysis-pool-action";
import {
  DATA_DISTINCT_OPTIONS,
  CustomFieldRefExpressionNode,
  FieldRestrictionExpressionNode
} from "../../utils/xwj-util";
import {withTranslation} from "react-i18next";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn, PlainLabel, TagBadge} from "../Layout";

class XwjAnalysisPoolIAO_TargetDelimit extends React.PureComponent {
  constructor(props) {
    super(props);
    let settingJson = isEmpty(props.analysisPoolInfo.settingJson)? {}: JSON.parse(props.analysisPoolInfo.settingJson);
    let {selectField, createField, condition, filter} = settingJson;
    this.state = {
      fieldPickerModal: false,
      fieldMakerModal: false,
      fieldRestrictionModal: false,
      datasetFields: [],
      fieldSelected: selectField || [],
      fieldMade: createField || [],
      fieldRestrictions: filter || [],
      fieldPickerInvalid: false,
      fieldMakerInvalid: false,
      fieldCondition: condition? condition[0]: null,
      fieldRestrictionInvalid: false,
      timeStart: new Date(),
      timeEnd: new Date()
    };
  }

  componentDidMount() {
    if (this.state.fieldCondition) {
      this.condition.value = this.state.fieldCondition.value;
    }
    getDatasetFields(this.props.analysisPoolInfo.dssId).then(datasetFields => this.setState({ datasetFields }));
  }

  render() {
    const { t } = this.props;

    return (
      <React.Fragment>
        <div className="pb-3">
          {/*欄位清單*/}
          <FormRow>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('analysis_set.target.field_list')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <Button
                color={`${this.state.fieldPickerInvalid? 'danger': undefined}`}
                className="shadow-none"
                onClick={e => this.setState({ fieldPickerModal: true })}><i className="fa fa-plus" /></Button>
              <div className="d-block mt-2">
                {this.state.fieldSelected.map(item => {
                  return (
                    <TagBadge key={item.name} toDelete={() => this.setState(prevState => ({
                      fieldSelected:
                        prevState.fieldSelected.filter(selected => (selected.name !== item.name)),
                      fieldRestrictions:
                        prevState.fieldRestrictions.filter(restriction => (restriction.name !== item.name))
                    }))}>
                      {item.name}
                    </TagBadge>
                  );
                })}
              </div>
              <DataModal
                caption="欄位清單" size="lg"
                isOpen={this.state.fieldPickerModal}
                toggle={() => this.setState({ fieldPickerModal: false })}
                confirm={this.fieldPickerConfirm}>
                <XwjAnalysisPoolIAO_TargetDelimitFieldPicker
                  ref={ref => this.fieldPicker = ref}
                  datasetFields={this.state.datasetFields}
                  fieldSelected={this.state.fieldSelected} />
              </DataModal>
            </FormValueColumn>
          </FormRow>

          {/*自訂欄位設定*/}
          <FormRow>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('analysis_set.target.customize_field')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <Button
                color={`${this.state.fieldMakerInvalid? 'danger': undefined}`}
                className="shadow-none"
                onClick={e => this.setState({ fieldMakerModal: true })}><i className="fa fa-plus" /></Button>
              <div className="d-block mt-2">
                {this.state.fieldMade.map(item => {
                  return (
                    <div key={item.newname}>
                      <TagBadge toDelete={() => this.setState(prevState => ({
                        fieldMade: prevState.fieldMade.filter(made => (made.newname !== item.newname)),
                        fieldRestrictions:
                          prevState.fieldRestrictions.filter(restriction => (restriction.name !== item.newname))
                      }))}>
                        <CustomFieldRefExpressionNode {...item}/>
                      </TagBadge>
                    </div>
                  );
                })}
              </div>
              <DataModal
                caption={t('analysis_set.target.customize_field')} size="lg"
                isOpen={this.state.fieldMakerModal}
                toggle={() => this.setState({ fieldMakerModal: false })}
                confirm={this.fieldMakerConfirm}>
                <XwjAnalysisPoolIAO_TargetDelimitFieldMaker
                  ref={ref => this.fieldMaker = ref}
                  datasetFields={this.state.datasetFields}
                  fieldSelected={this.state.fieldSelected}
                  fieldMade={this.state.fieldMade} />
              </DataModal>
            </FormValueColumn>
          </FormRow>

          {/*測試數據擷取設定*/}
          <FormRow>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('analysis_set.target.data_election')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <Input type="select" bsSize="sm" innerRef={ref => this.condition = ref}>
                {map(DATA_DISTINCT_OPTIONS, (value, key) => {
                  return (<option key={key} value={key}>{t(value)}</option>);
                })}
              </Input>
            </FormValueColumn>
          </FormRow>

          {/*數據篩選設定*/}
          <FormRow>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('analysis_set.target.data_filter')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <Button
                color={`${this.state.fieldRestrictionInvalid? 'danger': undefined}`}
                className="shadow-none"
                onClick={e => this.setState({ fieldRestrictionModal: true })}><i className="fa fa-plus" /></Button>
              <div className="d-block mt-2">
                {this.state.fieldRestrictions.map(item => {
                  return (
                    <div key={item.name}>
                      <TagBadge toDelete={() => this.setState(prevState => ({
                        fieldRestrictions: prevState.fieldRestrictions
                          .filter(restriction => (restriction.name !== item.name))
                      }))}>
                        <FieldRestrictionExpressionNode {...item}/>
                      </TagBadge>
                    </div>
                  );
                })}
              </div>
              <DataModal
                caption={t('analysis_set.target.data_filter')} size="lg"
                isOpen={this.state.fieldRestrictionModal}
                toggle={() => this.setState({ fieldRestrictionModal: false })}
                confirm={this.fieldRestrictConfirm}>
                <XwjAnalysisPoolIAO_TargetDelimitFieldCriteria
                  ref={ref => this.fieldRestriction = ref}
                  fieldSelected={this.state.fieldSelected}
                  fieldMade={this.state.fieldMade}/>
              </DataModal>
            </FormValueColumn>
          </FormRow>
        </div>
        <div className="border-top text-right pt-2 pr-5">
          <Button type="button" color="primary" size="sm" onClick={this.submitHandler}>
            <i className="fa fa-dot-circle-o mr-1" />{t('common.save')}
          </Button>
        </div>
      </React.Fragment>
    );
  }

  fieldPickerConfirm = () => {
    let fieldSelected = this.fieldPicker.getSelectedList();
    // if (fieldSelected.length > 0) {
      this.setState({
        fieldSelected,
        fieldPickerModal: false
      })
    // }
  };

  fieldMakerConfirm = () => {
    let config = this.fieldMaker.getFieldConfig();
    if (config) {
      this.setState(prevState => ({
        fieldMade: prevState.fieldMade.concat(config),
        fieldMakerModal: false
      }));
    }
  };

  fieldRestrictConfirm = () => {
    let restriction = this.fieldRestriction.getRestriction();
    if (restriction) {
      this.setState(prevState => ({
        fieldRestrictions: prevState.fieldRestrictions.concat(restriction),
        fieldRestrictionModal: false
      }));
    }
  };

  submitHandler = () => {
    this.props.toggleLoading(true);

    let data = {
      settingJson: {
        selectField: this.state.fieldSelected,
        createField: this.state.fieldMade,
        condition: [{
          type: 'fixed',
          name: 'value_rank',
          operator: 'equals',
          value: this.condition.value
        }],
        filter: this.state.fieldRestrictions
      }
    };

    updateAnalysisSetFieldConfig(this.props.analysisPoolInfo.id, data).then(data => {
      this.props.updateAnalysisPoolInfo(data);
      this.props.next();
    }).catch(error => this.props.pushNotification(
      this.props.t('message.system.save_failed')
    )).finally(this.props.toggleLoading)
  };
}

export default withTranslation()(XwjAnalysisPoolIAO_TargetDelimit);
