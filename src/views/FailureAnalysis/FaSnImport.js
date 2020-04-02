import React, {Component} from "react";
import { Button, CardBody, CardHeader, Input, InputGroup, InputGroupAddon } from "reactstrap";
import {FatalRecordRadioTable} from "./FatalRecordListTable";
import LoadingMask from "../Coommon/LoadingMask";
import withNotify from "../../utils/hoc/withNotify";
import DataModal from "../Coommon/DataModal";
import {withTranslation} from "react-i18next";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";
import {fatalRecordQuery} from "../../action/defective-action";

class FaImportForm extends Component {
  state = {
    // modal: false,
    loading: false,
    fatalRecords: null,
    snInvalid: false,
    // selectedFatalRecord: null,
  };

  render () {
    const { t } = this.props;

    return (
      <React.Fragment>
        <CardHeader className="px-4">
          <span>{t('fa.caption.defect_search')}</span>
        </CardHeader>
        <LoadingMask loading={this.state.loading}>
          <CardBody className="pr-5 border-bottom">
            <FormRow>
              <FormPropertyColumn md={2}>
                <BoldLabel>{t('common.sn')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn md={5}>
                <InputGroup size="sm">
                  <Input type="text" invalid={this.state.snInvalid} innerRef={ref => this.sn = ref} />
                  <InputGroupAddon addonType="append">
                    <Button color="light" onClick={this.search}>
                      <i className="fa fa-search" /><span className="ml-1">{t('fa.defect_import')}</span>
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormValueColumn>
            </FormRow>
          </CardBody>
        </LoadingMask>
        <DataModal
          isOpen={!!this.state.fatalRecords} size="xl" caption={'不良測試記錄'}
          toggle={() => this.setState({
            // modal: false,
            fatalRecords: null,
          })}
          confirm={() => {
            let item = this.fatalRecordSelector.item();
            // console.log('item: ', item);
            if (item) {
              this.props.fatalRecordSelectedCallback(item);
              this.setState({ fatalRecords: null });
            }
          }}>
          {this.state.fatalRecords? (
            <FatalRecordRadioTable
              ref={ref => this.fatalRecordSelector = ref }
              fatalRecords={this.state.fatalRecords} />
          ): (
            <div className="text-center"><i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" /></div>)}
        </DataModal>
      </React.Fragment>
    );
  };

  search = () => {
    // console.log(this.sn.value);
    this.setState({
      snInvalid: !this.sn.value || ('' === this.sn.value)
    }, () => {
      if (!this.state.snInvalid) {
        this.setState({ loading: true });

        fatalRecordQuery({ sn: this.sn.value })
          .then(fatalRecords => this.setState({ fatalRecords }))
          .catch(err => this.props.pushNotification(this.props.t('message.system.load_failed')))
          .finally(() => this.setState({ loading: false }));
      }
    });
  }
}

export default withTranslation()(withNotify(FaImportForm));
