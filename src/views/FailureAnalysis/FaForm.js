import React, {PureComponent} from 'react';
import {isEmpty, assign, uniqBy, filter, uniq, reduce} from 'lodash'
import {List, Map} from 'immutable';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Collapse,
  Form,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap';
import 'flatpickr/dist/themes/material_green.css';
import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/l10n";
import moment from 'moment';
import AttachmentCard from "../Coommon/AttachmentCard";
import filesize from 'filesize';
import {getProductLineStations, getTestSymptoms} from "../../action/defective-action";
import FaSnImport from "./FaSnImport";
import {BlockLabel, BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";
import {RISK_FACTOR_MAPPER} from "../../utils/constant-util";
import {
  createFailureAnalysisReport,
  getFaReferenceFiles,
  getFaReferenceTesting, updateFailureAnalysisReport
} from "../../action/failure-analysis-action";
import LoadingMask from "../Coommon/LoadingMask";
import FaSnReferenceList from "./FaSnReferenceList";
import {API_SERVICE_BASE_URL} from "../../utils/site-util";
import {withTranslation} from "react-i18next";
import withLoading from "../../utils/hoc/withLoading";
import withNotify from "../../utils/hoc/withNotify";
import FaSnReferenceQuery from "./FaSnReferenceQuery";

class CreateForm extends PureComponent {
  state = {
    faRecord: Map(),
    faImportCollapse: true,
    faReferenceCollapse: false,
    // selectedFatal: null,
    productInvalid: false,
    lineInvalid: false,
    stationInvalid: false,
    // trueSymptomInvalid: false,
    occurTimeInvalid: false,
    rootCauseInvalid: false,
    riskTypeInvalid: false,
    symptomCodeList: [],
    // dropdownSymptomCodeOpen: false,
    // trueSymptom: null,
    analysisFinishTime: null,
    occurTime: new Date(),
    riskType: null,
    attachments: List(),
    attachmentsInvalid: false,
    faReferences: [],
    productLineStations: {},
    //
    // dropdownProductOpen: false,
    product: null,
    //
    // dropdownLineOpen: false,
    line: null,
    //
    // dropdownStationOpen: false,
    station: null,
    // testSymptomLoading: false,
    testSymptoms: [],
    // dropdownTestSymptomOpen: false,
    testSymptom: null,
    testSymptomInvalid: false,
  };

  componentDidMount() {
    // this.setState({ loading: false });
    Promise.all([
      getProductLineStations(),
      getTestSymptoms()]).then(
        ([productLineStations, testSymptoms]) => {
          let product = this.state.faRecord.get('product');
          let line = this.state.faRecord.get('line');
          let station = this.state.faRecord.get('station');
          let testSymptom = this.state.faRecord.get('symptomName');
          product = Object.keys(productLineStations).indexOf(product) > -1? product: null;

          if (product) {
            line = Object.keys(productLineStations[product]).indexOf(line) > -1? line: null;

            if (line) {
              station = Object.keys(productLineStations[product][line]).indexOf(station) > -1? station: null;
            }
          }

          testSymptom = testSymptoms.indexOf(testSymptom) > -1? testSymptom: null;

          this.setState({
            productLineStations, testSymptoms, product, line, station, testSymptom,
          }, this.props.toggleLoading)
        });
  }

  render () {
    const { t, i18n } = this.props;
    const locale = i18n.language.split('-')[0];

    return (
      <Form className="form-horizontal" innerRef={ref => this.form = ref}>
        <Card>
          <Collapse isOpen={!this.state.faImportCollapse}>
            <FaSnImport
              fatalRecordSelectedCallback={item => {
                this.setState(prevState => ({
                  product: null,
                  line: null,
                  station: null,
                  testSymptom: null,
                  occurTime: moment(item.testStartTime).toDate(),
                  faReferences: uniqBy(prevState.faReferences.concat(item), 'testing_id')
                }), () => {
                  this.product.value = item.product;
                  this.line.value = item.line;
                  this.station.value = item.station;
                  this.testSymptom.value = item.failureSymptom;
                });
              }} />
          </Collapse>

          <CardHeader className="px-4">
            <span>{t('fa.caption.basic_information')}</span>
            <div className="card-header-actions">
              {this.functionBarRender()}
            </div>
          </CardHeader>
          <CardBody className="pr-5 border-bottom">

            <FormRow>
              <FormPropertyColumn md={2}>
                <BoldLabel>{t('common.client')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn md={4}>
                <Input
                  type="text" name="client" bsSize="sm"
                  defaultValue={this.state.faRecord.get('customer')}
                  innerRef={ref => this.client = ref} />
                {/*<span className="form-control-static">{this.props.item.sn}</span>*/}
              </FormValueColumn>
              <FormPropertyColumn md={1}>
                <BoldLabel>{t('common.product')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn md={5}>
                {this.productInputRender()}
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn md={2}>
                <BoldLabel>{t('common.line')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn md={4}>
                {this.lineInputRender()}
                {/*<Input type="text" name="line" bsSize="sm" innerRef={ref => this.line = ref} />*/}
                {/*<span className="form-control-static">{this.props.item.failStation}</span>*/}
              </FormValueColumn>
              <FormPropertyColumn md={1}>
                <BoldLabel>{t('defect.test_station')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn>
                {this.stationRender()}
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn md={2}>
                <BoldLabel>{t('fa.symptom')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn>
                {this.testSymptomRender()}
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn md={2}>
                <BoldLabel>{t('fa.symptom_note')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn>
                <Input
                  type="text" bsSize="sm" name="symptomDescription"
                  innerRef={ref => this.symptomDescription = ref} defaultValue={this.state.faRecord.get('failureDesc')} />
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn md={2}>
                <BoldLabel>{t('fa.occur_datetime')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn>
                <Flatpickr
                  className={`form-control form-control-sm bg-white ${this.state.occurTimeInvalid? 'border-danger': ''}`}
                  options={{
                    time_24hr: true,
                    enableTime: true,
                    // value: this.state.occurTime,
                    defaultDate: this.state.occurTime,
                    dateFormat: 'Y-m-d H:i',
                    locale,
                    minuteIncrement: 30
                  }}
                  name="occurTime"
                  value={this.state.occurTime}
                  onChange={date => this.setState({ occurTime: date[0] })} />
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn md={2}>
                <BoldLabel>{t('fa.analysis_complete_datetime')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn>
                <Flatpickr
                  className="form-control form-control-sm bg-white"
                  name="analysisFinishTime"
                  ref={ref => this.analysisFinishTime = ref}
                  options={{
                    time_24hr: true,
                    enableTime: true,
                    defaultDate: this.state.analysisFinishTime,
                    dateFormat: 'Y-m-d H:i',
                    locale,
                    minuteIncrement: 30
                  }}
                  onChange={date => this.setState({ analysisFinishTime: date[0] })} />
              </FormValueColumn>
            </FormRow>

            {this._extensionFieldRender()}

          </CardBody>

          <CardHeader className="px-4">{t('fa.caption.analysis_process')}</CardHeader>
          <CardBody className="pr-5 border-bottom">

            <FormRow>
              <FormPropertyColumn md={2}>
                <BoldLabel>{t('fa.root_cause')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn>
                <Input
                  type="text" name="rootCause" bsSize="sm"
                  defaultValue={this.state.faRecord.get('rootCause')}
                  innerRef={ref => this.rootCause = ref}
                  invalid={this.state.rootCauseInvalid} />
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn md={2}>
                <BoldLabel>{t('fa.risk_type')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn>
                <Input
                  type="select" bsSize="sm" name="riskType"
                  defaultValue={this.state.faRecord.get('riskType')}
                  innerRef={ref => this.riskType = ref}
                  invalid={this.state.riskTypeInvalid}
                >
                  <option value="">{t('common.choose')}</option>
                  {Object.keys(RISK_FACTOR_MAPPER).map(
                    code => (<option value={code} key={code}>{t(RISK_FACTOR_MAPPER[code])}</option>))}
                </Input>
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn md={2}>
                <BoldLabel>{t('fa.analysis_note')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn>
                <Input
                  type="textarea" bsSize="sm" rows="3" name="analysisDescription"
                  defaultValue={this.state.faRecord.get('analyzeDesc')}
                  innerRef={ref => this.analysisDescription = ref} />
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn md={2}>
                <BoldLabel>{t('fa.root_cause_note')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn>
                <Input
                  type="textarea" bsSize="sm" rows="3" name="rootCauseDescription"
                  defaultValue={this.state.faRecord.get('rootCauseDesc')}
                  innerRef={ref => this.rootCauseDescription = ref} />
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn md={2}>
                <BoldLabel>{t('fa.plan')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn>
                <Input
                  type="textarea" bsSize="sm" rows="3" name="plan"
                  defaultValue={this.state.faRecord.get('plan')}
                  innerRef={ref => this.plan = ref} />
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn md={2}>
                <BoldLabel>{t('fa.solution')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn>
                <Input
                  type="textarea" bsSize="sm" name="finalAction"
                  defaultValue={this.state.faRecord.get('action')}
                  innerRef={ref => this.finalAction = ref} rows="3"/>
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn md={2}>
                <BoldLabel>{t('fa.attachment')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn>
                <Button active color="link" className="text-dark" onClick={this.fileSelectTrigger}>
                  <i className="fa fa-upload fa-lg"/>
                </Button>
                <Input
                  type="file" className="d-none" multiple
                  innerRef={ref => this.attachments = ref}
                  onChange={this.fileSelectedHandler}
                />

                {this.attachmentsRender()}
              </FormValueColumn>
            </FormRow>

          </CardBody>
          <CardHeader className="px-4">
            <span>{t('fa.caption.defect_list')}</span>
            <div className="card-header-actions">
              <Button
                color="link"
                className="card-header-action"
                onClick={this.toggleFaReferenceCollapse}>
                <i className="icon-magnifier" />
              </Button>
            </div>
          </CardHeader>
          <CardBody className="px-5">

            <Collapse isOpen={!this.state.faReferenceCollapse}>
              <FaSnReferenceQuery
                testSymptoms={this.state.testSymptoms}
                fatalRecordSelectedCallback={items => {
                  this.setState(({faReferences}) => ({
                    faReferences: uniqBy(faReferences.concat(items), 'testing_id')
                  }));
                }}
              />
            </Collapse>
            {this.snReferenceRender()}
          </CardBody>
          <CardFooter className="text-right pr-5">
            <Button type="button" color="primary" size="sm" onClick={this.queryHandler}>
              <i className="fa fa-dot-circle-o mr-1" />{t('common.save')}
            </Button>
            {/*<Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>*/}
          </CardFooter>
        </Card>
      </Form>
    );
  };

  functionBarRender = () => {
    return (
      <Button
        color="link"
        className="card-header-action"
        onClick={() => this.setState({ faImportCollapse: !this.state.faImportCollapse })}>
        <i className="icon-magnifier" />
      </Button>
    );
  };

  productInputRender = () => {
    let optionList = Object.keys(this.state.productLineStations);
    return (
      <InputGroup>
        <Input
          type="select" bsSize="sm"
          defaultValue={this.state.faRecord.get('product')}
          onChange={e => {
            let value = e.target.value;
            this.setState(prevState => ({
              faRecord: prevState.faRecord.set('product', value),
              product: value
            }))
          }}>
          <option value="">{this.props.t('common.others')}</option>
          {optionList.map(item => {
            return (<option key={item}>{item}</option>);
          })}
        </Input>
        <InputGroupAddon addonType="append" className="w-50">
          {isEmpty(this.state.product)?
            <Input type="text" invalid={this.state.productInvalid} innerRef={ref => this.product = ref} bsSize="sm"/>:
            <Input
              type="text" innerRef={ref => this.product = ref}
              defaultValue={this.state.faRecord.get('product')} readOnly bsSize="sm"/>}
        </InputGroupAddon>
      </InputGroup>
    );
  };

  lineInputRender = () => {
    let optionList = Object.keys(this.state.productLineStations[this.state.product] || {});
    return (
      <InputGroup>
        <Input
          type="select" bsSize="sm"
          defaultValue={this.state.faRecord.get('line')}
          onChange={e => {
            let value = e.target.value;
            this.setState(prevState => ({
              faRecord: prevState.faRecord.set('line', value),
              line: value
            }))
          }}>
          <option value="">{this.props.t('common.others')}</option>
          {optionList.map(item => {
            return (<option key={item}>{item}</option>);
          })}
        </Input>
        <InputGroupAddon addonType="append" className="w-50">
          <Input
            type="text" bsSize="sm" readOnly={!isEmpty(this.state.line)}
            innerRef={ref => this.line = ref}
            defaultValue={this.state.faRecord.get('line')}
            invalid={this.state.lineInvalid}/>
        </InputGroupAddon>
      </InputGroup>
    );
  };

  stationRender = () => {
    let optionList = (this.state.productLineStations[this.state.product] || {})[this.state.line] || [];
    return (
      <InputGroup>
        <Input
          type="select" bsSize="sm"
          defaultValue={this.state.faRecord.get('station')}
          onChange={e => {
            let value = e.target.value;
            this.setState(prevState => ({
              faRecord: prevState.faRecord.set('station', value),
              station: value
            }))
          }}>
          <option value="">{this.props.t('common.others')}</option>
          {optionList.map(item => {
            return (<option key={item}>{item}</option>);
          })}
        </Input>
        <InputGroupAddon addonType="append" className="w-50">
          {isEmpty(this.state.station)?
            <Input type="text" invalid={this.state.stationInvalid} innerRef={ref => this.station = ref} bsSize="sm"/>:
            <Input
              type="text" innerRef={ref => this.station = ref}
              defaultValue={this.state.faRecord.get('station')} readOnly bsSize="sm"/>}
        </InputGroupAddon>
      </InputGroup>
    );
  };

  testSymptomRender = () => {
    return (
      <InputGroup>
        <Input
          type="select" bsSize="sm"
          defaultValue={this.state.faRecord.get('testSymptom')}
          onChange={e => {
            let value = e.target.value;
            this.setState(prevState => ({
              faRecord: prevState.faRecord.set('testSymptom', value),
              testSymptom: value
            }))
          }}>
          <option value="">{this.props.t('common.others')}</option>
          {this.state.testSymptoms.map(item => {
            return (<option key={item}>{item}</option>);
          })}
        </Input>
        <InputGroupAddon addonType="append" className="w-50">
          {isEmpty(this.state.testSymptom)?
            <Input
              type="text" bsSize="sm"
              invalid={this.state.testSymptomInvalid} innerRef={ref => this.testSymptom = ref}/>:
            <Input
              type="text" innerRef={ref => this.testSymptom = ref}
              defaultValue={this.state.faRecord.get('testSymptom')} readOnly bsSize="sm"/>}
        </InputGroupAddon>
      </InputGroup>
    );
  };

  _extensionFieldRender = () => {
    return null;
  };

  snReferenceRender = () => {
    return (
      <FaSnReferenceList
        faReferences={this.state.faReferences}
        itemRemoveHandler={item => {
          // console.log('faReferences: ', this.state.faReferences);
          this.setState(({ faReferences }) => ({
            faReferences: faReferences.filter(ref => (ref.testing_id !== item.testing_id))
          }));
        }}
      />
    );
  };

  attachmentsRender = () => {
    return (
      <React.Fragment>
        {this.attachmentDividerRender()}
        {this.state.attachmentsInvalid? (
          <FormFeedback className="d-block">{this.props.t('common.attachment_tip')}</FormFeedback>
        ): null}

        {this.attachmentListRender()}
      </React.Fragment>
    );
  };

  attachmentDividerRender = () => {
    return (this.state.attachments.size === 0)? null: (<div className="border-bottom" />);
  };

  attachmentListRender = () => {
    return this.state.attachments.map((item, index) => {
      // console.log('file: ', item);
      const _index = index;
      const file = item.fileItem;
      return (
        <AttachmentCard
          key={item.key}
          className={`mt-2 mb-1 ${this.state.attachmentsInvalid? 'border-danger': ''}`}
          header={file.name}
          // smallText={filesize(file.size)}
        >
          <div className="d-block">
            <Input
              type="text" maximum="50" className="border-0 pl-0 attachment-note"
              placeholder={this.props.t('fa.attachment_note_tip')}
              innerRef={ref => this[`attachmentsNote_${item.key}`] = ref} />
          </div>
          <div className="d-block">
            {/*<Progress className={progress.style} color={progress.color} value={progress.value} />*/}
            <small className="text-muted">{filesize(file.size)}</small>
            <Button active tag="a" color="link" className="text-dark py-0" href={window.URL.createObjectURL(file)}>
              <i className="fa fa-cloud-download icons font-lg" />
            </Button>
            <Button active color="link" className="text-dark py-0" onClick={e => {
              this.setState(({ attachments }) => ({ attachments: attachments.splice(_index, 1) }));
            }}>
              <i className="fa fa-trash-o icons font-lg" />
            </Button>
          </div>
        </AttachmentCard>
      );
      // return <div key={id} className="d-block">{f.name}</div>
    });
  };

  toggleFaReferenceCollapse = () => {
    this.setState({ faReferenceCollapse: !this.state.faReferenceCollapse });
  };

  fileSelectTrigger = e => {
    this.attachments.click();
  };

  fileSelectedHandler = e => {
    let files = e.target.files;
    let fileItems = [];
    // console.log('fileSelectedHandler: ');
    for (let i = 0; i < files.length; i++) {
      fileItems.push({
        key: `${Date.now()}_${i}`,
        fileItem: files[i]
      });
    }

    this.setState(prevState => ({ attachments: prevState.attachments.concat(fileItems) }));
  };

  // symptomCodeMenuHandler = e => this.setState({ trueSymptom: e.target.value });

  queryHandler = () => {
    this.props.toggleLoading(true);
    let state = {
      productInvalid: isEmpty(this.product.value),
      lineInvalid: isEmpty(this.line.value),
      stationInvalid: isEmpty(this.station.value),
      testSymptomInvalid: isEmpty(this.testSymptom.value),
      occurTimeInvalid: !this.state.occurTime,
      rootCauseInvalid: isEmpty(this.rootCause.value),
      riskTypeInvalid: isEmpty(this.riskType.value),
      attachmentsInvalid: this.state.attachments.reduce((sum, item) => (sum + item.fileItem.size), 0) > (30 * 1024 * 1024)
    };

    this.setState(state);
    let valid = reduce(state, (valid, isInvalid) => (valid && !isInvalid), true);

    if (valid) {
      let formData = new FormData();
      !isEmpty(this.client.value) && formData.append('customer', this.client.value);
      formData.append('product', this.product.value);
      formData.append('line', this.line.value);
      formData.append('station', this.station.value);
      formData.append('symptomType', isEmpty(this.state.testSymptom)? "MANUAL": "EXISTING");
      formData.append('symptomName', this.testSymptom.value);
      !isEmpty(this.symptomDescription.value) && formData.append('failureDesc', this.symptomDescription.value);
      formData.append('testStartTimeStr', moment(this.state.occurTime).format('YYYY-MM-DD HH:mm'));
      this.state.analysisFinishTime && formData.append('analyzeFinishTimeStr', moment(this.state.analysisFinishTime).format('YYYY-MM-DD HH:mm'));
      !isEmpty(this.rootCause.value) && formData.append('rootCause', this.rootCause.value);
      !isEmpty(this.riskType.value) && formData.append('riskType', this.riskType.value);
      !isEmpty(this.analysisDescription.value) && formData.append('analyzeDesc', this.analysisDescription.value);
      !isEmpty(this.rootCauseDescription.value) && formData.append('rootCauseDesc', this.rootCauseDescription.value);
      !isEmpty(this.plan.value) && formData.append('plan', this.plan.value);
      !isEmpty(this.finalAction.value) && formData.append('action', this.finalAction.value);
      this.state.attachments.forEach(attachment => {
        // console.log('this[`attachmentsNote_${attachment.key}`].value: ', this[`attachmentsNote_${attachment.key}`].value);
        formData.append('refFileNotes', this[`attachmentsNote_${attachment.key}`].value || '');
        formData.append('refFiles', attachment.fileItem);
      });
      this.state.faReferences.forEach(refItem => {
        formData.append('snTestingId', refItem.testing_id);
        formData.append('snNumber', refItem.sn);
        formData.append('snTestStartTime', refItem.testStartTime);
        formData.append('snFactory', refItem.factory);
        formData.append('snProduct', refItem.product);
        formData.append('snFloor', refItem.floor);
        formData.append('snLine', refItem.line);
        formData.append('snStation', refItem.station);
        formData.append('snMachine', refItem.machine);
        formData.append('snFailureSymptom', refItem.failureSymptom);
        formData.append('snFailureDesc', refItem.failureDesc || '');
        // formData.append('snAction', 'create');
      });

      createFailureAnalysisReport(formData).then(data => {
        this.props.history.push('/fa/query');
      }).catch(error => {
        this.props.pushNotification(this.props.t('message.system.error'));
      });
    } else {
      this.props.toggleLoading(false);
      this.props.pushNotification(this.props.t('message.system.form_incomplete'));
    }
  };
}

class EditForm extends CreateForm {
  constructor(props) {
    super(props);
    this.state = assign(this.state, {
      faReferenceCollapse: true,
      faRecord: Map(props.faRecord),
      analysisFinishTime: props.faRecord.analyzeFinishTimeStr? moment(props.faRecord.analyzeFinishTimeStr).toDate(): null,
      occurTime: moment(props.faRecord.testStartTimeStr).toDate(),
      myLoading: true,
      // savedReferenceTesting: [],
      savedReferenceFiles: List(),
      delReferenceTestings: [],
      delReferenceFiles: []
    });
  }

  componentDidMount() {
    super.componentDidMount();

    let id = this.state.faRecord.get('id');
    Promise.all([
      getFaReferenceTesting(id),
      getFaReferenceFiles(id),
    ]).then(([savedReferenceTesting, savedReferenceFiles]) => {
      let faReferences = uniqBy(savedReferenceTesting.concat(this.state.faReferences), 'testing_id');
      this.setState({
        faReferences,
        savedReferenceFiles: List(savedReferenceFiles),
        myLoading: false });
    })
  }

  functionBarRender = () => {
    return (
      <Button
        color="link"
        className="card-header-action"
        onClick={this.props.close}
      >
        <i className="fa fa-reply fa-rotate-90 fa-lg" />
      </Button>
    );
  };

  productInputRender = () => {
    return (<BlockLabel>{this.state.faRecord.get('product')}</BlockLabel>)
  };

  stationRender = () => {
    return (<BlockLabel>{this.state.faRecord.get('station')}</BlockLabel>);
  };

  testSymptomRender = () => {
    return (<BlockLabel>{this.state.faRecord.get('symptomName')}</BlockLabel>);
  };

  _extensionFieldRender = () => {
    return (
      <FormRow>
        <FormPropertyColumn md={2}>
          <BoldLabel>{this.props.t('fa.create_time')}</BoldLabel>
        </FormPropertyColumn>
        <FormValueColumn>
          <BlockLabel>
            {moment(this.state.faRecord.get('createTimeStr')).format('YYYY-MM-DD HH:mm')}
            ({this.state.faRecord.get('createUsername')})
          </BlockLabel>
        </FormValueColumn>
      </FormRow>
    );
  };

  snReferenceRender = () => {
    return (
      <LoadingMask loading={this.state.myLoading}>
        {/*<FaSnReferenceList*/}
        {/*  faReferences={this.state.savedReferenceTesting}*/}
        {/*  itemRemoveHandler={item => {*/}
        {/*    // console.log('faReferences: ', this.state.faReferences);*/}
        {/*    this.setState(({ faReferences }) => ({*/}
        {/*      faReferences: faReferences.filter(ref => (ref.id !== item.id))*/}
        {/*    }));*/}
        {/*  }}*/}
        {/*/>*/}
        <FaSnReferenceList
          faReferences={this.state.faReferences}
          itemRemoveHandler={item => {
            this.setState(({ faReferences, delReferenceTestings }) => ({
              faReferences: filter(faReferences, ref => (ref.testing_id !== item.testing_id )),
              delReferenceTestings: item.id? uniq(delReferenceTestings.concat(item.id)): undefined
            }));
          }}
        />
      </LoadingMask>
    );
  };

  attachmentsRender = () => {
    return (
      <React.Fragment>
        {this.attachmentDividerRender()}
        {this.saveAttachmentListRender()}
        {this.attachmentListRender()}
      </React.Fragment>
    );
  };

  attachmentDividerRender = () => {
    return (this.state.attachments.size + this.state.savedReferenceFiles.size === 0)?
      null:
      (<div className="border-bottom" />);
  };

  saveAttachmentListRender = () => {
    return this.state.savedReferenceFiles.map((item, i) => {
      // console.log('file: ', item);
      let _index = i;
      let key = item.id;
      // const file = item.fileItem;
      return (
        <AttachmentCard
          key={key}
          className={`mt-2 mb-1 ${this.state.attachmentsInvalid? 'border-danger': ''}`}
          header={item.originalFileName}
          // smallText={filesize(file.size)}
        >
          <div className="d-block">
            <span className="text-muted my-2">
              {item.description || `(${this.props.t('fa.attachment_note_none')})`}
            </span>

          </div>
          <div className="d-block">
            <small className="text-muted">{filesize(item.sizeInBytes)}</small>
            <Button
              active tag="a" color="link" className="text-dark py-0"
              href={`${API_SERVICE_BASE_URL}/fa/${this.state.faRecord.get('id')}/references/objects/${item.id}`}>
              <i className="fa fa-cloud-download icons font-lg" />
            </Button>
            <Button active color="link" className="text-dark py-0" onClick={e => {
              this.setState(({ savedReferenceFiles, delReferenceFiles }) => ({
                savedReferenceFiles: savedReferenceFiles.splice(_index, 1),
                delReferenceFiles: delReferenceFiles.concat(item.id)
              }));
            }}>
              <i className="fa fa-trash-o icons font-lg" />
            </Button>
          </div>
        </AttachmentCard>
      );
      // return <div key={id} className="d-block">{f.name}</div>
    });
  };

  queryHandler = () => {
    this.props.toggleLoading(true);
    let state = {
      // productInvalid: isEmpty(this.product.value),
      lineInvalid: isEmpty(this.line.value),
      // stationInvalid: isEmpty(this.station.value),
      // testSymptomInvalid: isEmpty(this.testSymptom.value),
      occurTimeInvalid: !this.state.occurTime,
      rootCauseInvalid: isEmpty(this.rootCause.value),
      riskTypeInvalid: isEmpty(this.riskType.value),
      attachmentsInvalid: (
        this.state.attachments.reduce((sum, item) => (sum + item.fileItem.size), 0) +
        this.state.savedReferenceFiles.reduce((sum, item) => (sum + item.sizeInBytes), 0)
      ) > (30 * 1024 * 1024)
    };

    this.setState(state);
    let valid = reduce(state, (valid, isInvalid) => (valid && !isInvalid), true);

    if (valid) {

      let id = this.state.faRecord.get('id');
      let formData = new FormData();
      // formData.append('id', this.state.faRecord.get('id'));
      !isEmpty(this.client.value) && formData.append('customer', this.client.value);
      // !isEmpty(this.product.value) && formData.append('product', this.product.value);
      formData.append('line', this.line.value);
      // !isEmpty(this.station.value) && formData.append('station', this.station.value);
      // formData.append('symptomType', this.state.testSymptom? "EXISTING": "MANUAL");
      // !isEmpty(this.testSymptom.value) && formData.append('symptomName', this.testSymptom.value);
      !isEmpty(this.symptomDescription.value) && formData.append('failureDesc', this.symptomDescription.value);
      formData.append('testStartTimeStr', moment(this.state.occurTime).format('YYYY-MM-DD HH:mm'));
      this.state.analysisFinishTime && formData.append('analyzeFinishTimeStr', moment(this.state.analysisFinishTime).format('YYYY-MM-DD HH:mm'));
      formData.append('rootCause', this.rootCause.value);
      formData.append('riskType', this.riskType.value);
      !isEmpty(this.analysisDescription.value) && formData.append('analyzeDesc', this.analysisDescription.value);
      !isEmpty(this.rootCauseDescription.value) && formData.append('rootCauseDesc', this.rootCauseDescription.value);
      !isEmpty(this.plan.value) && formData.append('plan', this.plan.value);
      !isEmpty(this.finalAction.value) && formData.append('action', this.finalAction.value);
      this.state.attachments.forEach(attachment => {
        // console.log('this[`attachmentsNote_${attachment.key}`].value: ', this[`attachmentsNote_${attachment.key}`].value);
        formData.append('refFileNotes', this[`attachmentsNote_${attachment.key}`].value || '');
        formData.append('refFiles', attachment.fileItem);
      });
      this.state.delReferenceFiles.forEach(item => formData.append('refFileDel', item));
      // append only new selected reference testing, that id field is not exist
      filter(this.state.faReferences, item => !item.id).forEach(refItem => {
        formData.append('snTestingId', refItem.testing_id);
        formData.append('snNumber', refItem.sn);
        formData.append('snTestStartTime', refItem.testStartTime);
        formData.append('snFactory', refItem.factory);
        formData.append('snProduct', refItem.product);
        formData.append('snFloor', refItem.floor);
        formData.append('snLine', refItem.line);
        formData.append('snStation', refItem.station);
        formData.append('snMachine', refItem.machine);
        formData.append('snFailureSymptom', refItem.failureSymptom);
        formData.append('snFailureDesc', refItem.failureDesc || '');
        // formData.append('snAction', 'create');
      });
      this.state.delReferenceTestings.forEach(item => formData.append('snDel', item));

      updateFailureAnalysisReport(id, formData).then(data => {
        this.props.close();
      }).catch(error => {
        this.props.pushNotification(this.props.t('message.system.error'));
      });
    } else {
      this.props.toggleLoading(false);
      this.props.pushNotification(this.props.t('message.system.form_incomplete'));
    }

  };
}

const FaCreateForm = withTranslation()(withLoading(withNotify(CreateForm), true));
const FaEditForm = withTranslation()(withLoading(withNotify(EditForm), true));

export {
  FaCreateForm, FaEditForm
};
