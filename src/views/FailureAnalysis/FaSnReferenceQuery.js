import React, {Component} from "react";
import {Button, Input, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import "flatpickr/dist/l10n";
import 'flatpickr/dist/themes/material_green.css';
import Flatpickr from "react-flatpickr";
import {FatalRecordCheckboxTable} from "./FatalRecordListTable";
import moment from "moment";
import LoadingMask from "../Coommon/LoadingMask";
import DataModal from "../Coommon/DataModal";
import {withTranslation} from "react-i18next";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn, PlainColumn} from "../Layout";
import {fatalRecordQuery} from "../../action/defective-action";

class FaSnReferenceQuery extends Component {
  state = {
    loading: false,
    fatalRecords: null,
    failSymptom: null,
    // failSymptomInvalid: false,
    failSymptomList: [],
    testTimeStart: null,
    testTimeEnd: null,
  };

  render () {
    const { t, i18n } = this.props;
    const locale = i18n.language.split('-')[0];

    return (
      <LoadingMask loading={this.state.loading}>
        <div className="border-bottom mb-3 pb-3">
          <div className="pr-2 mr-2">
            <FormRow>
              <FormPropertyColumn md={4}>
                <BoldLabel>{t('common.sn')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn md={4}>
                <Input type="text" bsSize="sm" innerRef={ref => this.sn = ref} />
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn md={4}>
                <BoldLabel>{t('defect.fail_symptom')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn md={4}>
                <Input
                  type="select" bsSize="sm"
                  // invalid={this.state.failSymptomInvalid}
                  innerRef={ref => this.failSymptom = ref}
                >
                  <option value="">{t('common.any')}</option>
                  {this.props.testSymptoms.map(item => (<option value={item} key={item}>{item}</option>))}
                </Input>
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn md={4}>
                <BoldLabel>{t('defect.test_datetime')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn md={4}>
                <InputGroup>
                  <Flatpickr
                    className="form-control form-control-sm bg-white"
                    options={{
                      time_24hr: true,
                      // enableTime: true,
                      // value: this.state.occurTime,
                      // defaultDate: this.state.testTime,
                      dateFormat: 'Y-m-d',
                      locale,
                      minuteIncrement: 30
                    }}
                    // value={this.state.testTime}
                    onChange={date => this.setState({ testTimeStart: date[0] })}
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText><i className="fa fa-chevron-right" /></InputGroupText>
                  </InputGroupAddon>
                  <Flatpickr
                    className="form-control form-control-sm bg-white"
                    options={{
                      time_24hr: true,
                      // enableTime: true,
                      // value: this.state.occurTime,
                      // defaultDate: this.state.testTime,
                      dateFormat: 'Y-m-d',
                      locale,
                      minuteIncrement: 30
                    }}
                    // value={this.state.testTime}
                    onChange={date => this.setState({ testTimeEnd: date[0] })}
                  />
                </InputGroup>
              </FormValueColumn>
              <PlainColumn>
                <Button type="button" size="sm" color="primary"
                        onClick={this.search}>
                  <i className="icon-magnifier mr-1"/>{t('common.search')}
                </Button>
              </PlainColumn>
            </FormRow>

          </div>
        </div>

        <DataModal
          isOpen={!!this.state.fatalRecords} size="xl" caption={t('fa.caption.defect_list')}
          toggle={() => this.setState({ fatalRecords: null })}
          confirm={() => {
            let item = this.fatalRecordSelector.item();
            this.props.fatalRecordSelectedCallback(item);
            this.setState({ fatalRecords: null });
          }}
        >
          {this.state.fatalRecords? (
            <FatalRecordCheckboxTable
              ref={ref => this.fatalRecordSelector = ref }
              fatalRecords={this.state.fatalRecords} />
          ): (
            <div className="text-center"><i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" /></div>)}
        </DataModal>
      </LoadingMask>
    );
  };

  search = () => {
    this.setState({ loading: true });

    let criteria = {
      sn: (this.sn.value === '' || !this.sn.value)? undefined: this.sn.value,
      symptom: Boolean(this.failSymptom.value)? this.failSymptom.value: undefined,
      testStartDate: this.state.testTimeStart? moment(this.state.testTimeStart).format('YYYY-MM-DD HH:mm:ss'): undefined,
      testEndDate: this.state.testTimeEnd? moment(this.state.testTimeEnd).format('YYYY-MM-DD HH:mm:ss'): undefined,
    };

    fatalRecordQuery(criteria).then(fatalRecords => this.setState({
      loading: false,
      fatalRecords: fatalRecords
    }));

  }
}

export default withTranslation()(FaSnReferenceQuery);
