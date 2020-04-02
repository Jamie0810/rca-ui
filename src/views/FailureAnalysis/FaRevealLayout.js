import React, { Component } from 'react';
import 'flatpickr/dist/themes/material_green.css';
import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/l10n";
import {
  fatalAnalysisQuery,
  getFaProductSymptoms, getFaCreateUsers
} from "../../action/failure-analysis-action";
import {
  Button, Card, CardBody, CardHeader, Col, Collapse, FormGroup, Input, InputGroup, InputGroupAddon,
  InputGroupText, Label, Table
} from "reactstrap";
import LoadingMask from "../Coommon/LoadingMask";
import FaEditForm from "./FaEditForm";
import {isEmpty, orderBy} from "lodash";
import {RISK_FACTOR_MAPPER} from "../../utils/constant-util";
import {API_SERVICE_BASE_URL} from '../../utils/site-util';
import {withTranslation} from "react-i18next";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn, PlainColumn} from "../Layout";

const QueryForm = withTranslation()(
  class extends Component {
    state = {
      // collapse: false,
      loading: true,
      productSymptoms: {},
      product: null,
      userList: [],
      timeStart: undefined,
      timeEnd: undefined,
    };

    componentDidMount() {
      Promise.all([
        getFaProductSymptoms(),
        getFaCreateUsers()
      ]).then(([productSymptoms, userList]) => {
        this.setState({
          productSymptoms,
          userList,
          loading: false
        });
      })
    }

    render () {
      const { t, i18n } = this.props;
      const locale = i18n.language.split('-')[0];
      let products = Object.keys(this.state.productSymptoms);
      let symptoms = this.state.productSymptoms[this.state.product] || [];

      return (
        <Collapse isOpen={!this.props.collapse}>
          <LoadingMask loading={this.state.loading}>
            <Card>
              <CardHeader className="px-4">
                {t('fa.query')}
                <div className="card-header-actions">
                  {/*<Button*/}
                  {/*color="link"*/}
                  {/*className="card-header-action"*/}
                  {/*data-target="#InfoBlock"*/}
                  {/*onClick={e => this.setState({ collapse: !this.state.collapse })}>*/}
                  {/*<i className="icon-arrow-up" />*/}
                  {/*</Button>*/}
                </div>
              </CardHeader>
              <CardBody className="pr-5">
                <FormRow>
                  <FormPropertyColumn md={2}>
                    <BoldLabel>{t('common.product')}</BoldLabel>
                  </FormPropertyColumn>
                  <FormValueColumn md={3}>
                    <Input
                      type="select" name="product" bsSize="sm"
                      innerRef={ref => this.product = ref}
                      onChange={e => this.setState({ product: e.target.value })}
                    >
                      <option value={''}>{t('common.choose')}</option>
                      {products.map(item => (<option value={item} key={item}>{item}</option>))}
                    </Input>
                  </FormValueColumn>

                  <FormPropertyColumn md={2}>
                    <BoldLabel>{t('fa.risk_type')}</BoldLabel>
                  </FormPropertyColumn>
                  <FormValueColumn md={3}>
                    <Input
                      type="select" name="failFactorCategory" bsSize="sm"
                      innerRef={ref => this.failFactorCategory = ref}
                    >
                      <option value={''}>{t('common.choose')}</option>
                      {Object.keys(RISK_FACTOR_MAPPER).map(
                        code => (<option value={code} key={code}>{t(RISK_FACTOR_MAPPER[code])}</option>))}
                    </Input>
                  </FormValueColumn>
                </FormRow>

                <FormRow>
                  <FormPropertyColumn md={2}>
                    <BoldLabel>{t('fa.symptom')}</BoldLabel>
                  </FormPropertyColumn>
                  <FormValueColumn md={3}>
                    <Input
                      type="select" name="failSymptom" bsSize="sm"
                      innerRef={ref => this.failSymptom = ref}
                    >
                      <option value={''}>{t('common.choose')}</option>
                      {symptoms.map(item => (<option value={item} key={item}>{item}</option>))}
                    </Input>
                  </FormValueColumn>
                  <FormPropertyColumn md={2}>
                    <BoldLabel>{t('fa.creator')}</BoldLabel>
                  </FormPropertyColumn>
                  <FormValueColumn md={3}>
                    <Input
                      type="select" name="creator" bsSize="sm"
                      innerRef={ref => this.creator = ref}
                    >
                      <option value={''}>{t('common.choose')}</option>
                      {this.state.userList.map(item => (<option value={item} key={item}>{item}</option>))}
                    </Input>
                  </FormValueColumn>
                </FormRow>

                <FormRow>
                  <FormPropertyColumn md={2}>
                    <BoldLabel>{t('fa.occur_datetime')}</BoldLabel>
                  </FormPropertyColumn>
                  <FormValueColumn md={8}>
                    <InputGroup>
                      <Flatpickr
                        className="form-control form-control-sm first bg-white"
                        options={{
                          time_24hr: true,
                          enableTime: true,
                          defaultDate: this.state.timeStart,
                          dateFormat: 'Y-m-d H:i',
                          locale,
                          minuteIncrement: 30
                        }}
                        onChange={date => this.setState({ timeStart: date[0].getTime() })} />
                      <InputGroupAddon addonType="append">
                        <InputGroupText><i className="fa fa-chevron-right" /></InputGroupText>
                      </InputGroupAddon>
                      <Flatpickr
                        className="form-control form-control-sm bg-white"
                        options={{
                          time_24hr: true,
                          enableTime: true,
                          defaultDate: this.state.timeEnd,
                          dateFormat: 'Y-m-d H:i',
                          locale,
                          minuteIncrement: 30
                        }}
                        onChange={date => this.setState({ timeEnd: date[0].getTime() })} />
                    </InputGroup>
                  </FormValueColumn>
                  <PlainColumn>
                    <Button type="button" size="sm" color="primary" onClick={this.search}>
                      <i className="fa fa-dot-circle-o mr-1" />{t('common.search')}
                    </Button>
                  </PlainColumn>
                </FormRow>


              </CardBody>
            </Card>
          </LoadingMask>
        </Collapse>
      );
    };

    // toggle = () => {
    //   this.setState({ collapse: !this.state.collapse });
    // };

    search = () => {
      this.setState({ loading: true });

      let criteria = {
        product: isEmpty(this.product.value)? undefined: this.product.value,
        riskType: isEmpty(this.failFactorCategory.value)? undefined: this.failFactorCategory.value,
        createUser: isEmpty(this.creator.value)? undefined: this.creator.value,
        failSymptom: isEmpty(this.failSymptom.value)? undefined: this.failSymptom.value,
        startTimestamp: this.state.timeStart? this.state.timeStart: undefined,
        stopTimestamp: this.state.timeEnd? this.state.timeEnd: undefined,
      };

      fatalAnalysisQuery(criteria).then(faRecords => {
        this.props.commit({ criteria, faRecords });
        this.setState({ loading: false });
      });

    }
  }
);

const RecordList = withTranslation()(
  class extends Component {
    state = {
      // collapse: false,
      loading: false,
      sortByField: 'testStartTimeStr',
      isAscending: false,
    };

    tableHeaderLabel = (propertyName, icon) => {
      if (this.state.sortByField === propertyName) {
        return icon;
      }
      return null;
    };

    setOrder = sortByField => {
      if (this.state.sortByField === sortByField) {
        this.setState(prevState => ({ isAscending: !prevState.isAscending }));
      } else {
        this.setState({ sortByField });
      }
    };

    render () {
      const { t } = this.props;

      let orderedDataset =
        orderBy(this.props.faRecords, [this.state.sortByField], [this.state.isAscending? 'asc': 'desc']);
      let orderIcon = this.state.isAscending?
        (<i className="fa fa-sort-amount-asc ml-1" />): (<i className="fa fa-sort-amount-desc ml-1" />);

      return (
        <Collapse isOpen={!this.props.collapse}>
          <Card>
            <CardHeader className="px-4">
              {t('fa.list')}
              <div className="card-header-actions">
                <Button
                  color="link"
                  className="card-header-action"
                  onClick={this.props.close}>
                  <i className="fa fa-reply fa-rotate-90 fa-lg" />
                </Button>
              </div>
            </CardHeader>

            <CardBody>
              <LoadingMask loading={this.state.loading}>
                <Table className="nowrap" responsive hover>
                  <thead>
                  <tr className="text-center">
                    <th className="border-top-0">{t('fa.download')}</th>
                    <th className="border-top-0">
                      <a href="javascript:" className="text-dark" onClick={e => this.setOrder('testStartTimeStr')}>
                        {t('fa.occur_datetime')}{this.tableHeaderLabel('testStartTimeStr', orderIcon)}
                      </a>
                    </th>
                    <th className="border-top-0">
                      <a href="javascript:" className="text-dark" onClick={e => this.setOrder('product')}>
                        {t('common.product')}{this.tableHeaderLabel('product', orderIcon)}
                      </a>
                    </th>
                    {/*<th className="border-top-0">測試工站</th>*/}
                    {/*<th className="border-top-0">線別</th>*/}
                    <th className="border-top-0">
                      <a href="javascript:" className="text-dark" onClick={e => this.setOrder('symptomName')}>
                        {t('fa.symptom')}{this.tableHeaderLabel('symptomName', orderIcon)}
                      </a>
                    </th>
                    <th className="border-top-0">
                      <a href="javascript:" className="text-dark" onClick={e => this.setOrder('failureDesc')}>
                        {t('fa.symptom_note')}{this.tableHeaderLabel('failureDesc', orderIcon)}
                      </a>
                    </th>
                    <th className="border-top-0">
                      <a href="javascript:" className="text-dark" onClick={e => this.setOrder('rootCause')}>
                        {t('fa.root_cause')}{this.tableHeaderLabel('rootCause', orderIcon)}
                      </a>
                    </th>
                    <th className="border-top-0">
                      <a href="javascript:" className="text-dark" onClick={e => this.setOrder('riskType')}>
                        {t('fa.risk_type')}{this.tableHeaderLabel('riskType', orderIcon)}
                      </a>
                    </th>
                    <th className="border-top-0">
                      <a href="javascript:" className="text-dark" onClick={e => this.setOrder('createTimeStr')}>
                        {t('fa.create_time')}{this.tableHeaderLabel('createTimeStr', orderIcon)}
                      </a>
                    </th>
                    {/*<th className="border-top-0">{''}</th>*/}
                  </tr>
                  </thead>
                  <tbody className="border-bottom">
                  {orderedDataset.map((item, index) => {
                    return (
                      <tr key={index} className="text-center">
                        <td className="align-middle">
                          <Button
                            color="link"
                            className="card-header-action"
                            // onClick={this.caseDownload}
                            onClick={(e) => this.caseDownload(item.id)}
                          >
                            <i className="fa fa-download fa-lg" />
                          </Button>
                          {/* onClick={e => this.setState({ deleteItem: analysisSetData })}/> */}
                        </td>
                        <td className="align-middle">{item.testStartTimeStr}</td>
                        <td className="align-middle">{item.product}</td>
                        {/*<td className="align-middle">{item.station}</td>*/}
                        {/*<td className="align-middle">{item.line}</td>*/}
                        <td className="align-middle">
                          <Button
                            color="link"
                            onClick={e => this.props.commit(item)}>{item.symptomName}</Button>
                        </td>
                        <td className="align-middle">
                        <span className="text-truncate d-inline-block" style={{maxWidth: '200px'}}>
                          {item.failureDesc}
                        </span>
                        </td>
                        <td className="align-middle">
                        <span className="text-truncate d-inline-block" style={{maxWidth: '200px'}}>
                          {item.rootCause}
                        </span>
                        </td>
                        <td className="align-middle">{t(RISK_FACTOR_MAPPER[item.riskType])}</td>
                        <td className="align-middle">{item.createTimeStr}</td>
                      </tr>
                    );
                  })}
                  </tbody>
                </Table>
              </LoadingMask>
            </CardBody>
          </Card>
        </Collapse>
      );
    }

    caseDownload(caseId){
      let downloadURL = API_SERVICE_BASE_URL + "/fa/fa_caseExport?caseId=" + caseId;
      window.open(downloadURL);
    }
  }
);

class Layout extends Component {
  state = {
    loading: false,
    faRecords: null,
    faRecord: null,
    criteria: {}
  };

  render () {
    return (
      <LoadingMask loading={this.state.loading}>
        <QueryForm
          collapse={!!this.state.faRecords}
          commit={({criteria, faRecords}) => this.setState({ criteria, faRecords })} />
        {(this.state.faRecords)?
          <RecordList
            faRecords={this.state.faRecords}
            collapse={!!this.state.faRecord}
            close={() => { this.setState({ faRecords: null }) }}
            commit={faRecord => this.setState({ faRecord })} />: null}
        {(this.state.faRecord)?
          <FaEditForm
            criteria={this.state.criteria}
            faRecord={this.state.faRecord}
            close={() => {
              this.setState({
                faRecord: null,
                loading: true
              }, () => {
                fatalAnalysisQuery(this.state.criteria).then(faRecords => {
                  this.setState({ faRecords, loading: false });
                });
              })
            }} />: null}
      </LoadingMask>
    );
  }
}


export default Layout;
