import React from "react";
import {
  XwjAnalysisPoolIAO_Panel,
  XwjAnalysisPoolIAO_PanelBody,
  XwjAnalysisPoolIAO_PanelHeader
} from "../XWJ/XwjAnalysisPoolIAO_Panel";
import { Button, Table, Input, FormFeedback } from "reactstrap";
import {getStationFilterList, uploadStationFilterList, uploadTestStationFile} from "../../action/product-action";
import { map } from "highcharts";
import {API_SERVICE_BASE_URL} from '../../utils/site-util';
import AttachmentCard from "../Coommon/AttachmentCard";
import filesize from 'filesize';
import {withTranslation} from "react-i18next";
class Product_StatisticTestStation extends React.PureComponent{
  state = {
    blackList:[],
    whiteList: [],
    attachment: null,
    attachmentInvalid: false
  };

  componentDidMount() {
    let params = { product: this.props.product.product };
    getStationFilterList(this.props.product.id, params).then(statisticData => {
      if (statisticData){
        this.setState({ 
          blackList: statisticData.blackList || [],
          whiteList: statisticData.whiteList || []
        }, this.props.toggleLoading)
      }
    })
  }

  render() {
    const { t } = this.props;

    return (
      <XwjAnalysisPoolIAO_Panel>
        <XwjAnalysisPoolIAO_PanelHeader caption={t('product.data_filter.crucial_test_station_caption')}>
          <Button
            color="dark"
            size="sm"
            className="btn-ghost-dark py-1 px-2 mx-1 shadow-none"
            onClick={this.fileSelectTrigger}>
            <i className="fa fa-upload fa-lg" />
          </Button>
          <Input
            type="file" className="d-none"
            innerRef={ref => this.attachment = ref}
            onChange={this.fileSelectedHandler}/>
          <Button
            color="dark"
            size="sm"
            className="btn-ghost-dark py-1 px-2 mx-1 shadow-none"
            onClick={(e) => this.fileDownload()}>
            <i className="fa fa-download fa-lg" />
          </Button>
        </XwjAnalysisPoolIAO_PanelHeader>
        <XwjAnalysisPoolIAO_PanelBody>
          <Table responsive striped>
            <thead>
              <tr>
                <th className="border-top-0">{t('product.data_filter.list_type')}</th>
                <th className="border-top-0">{t('common.crucial_test_station')}</th>
              </tr>
            </thead>
            <tbody>
              {map(this.state.blackList, item => {
                return (
                  <tr key={item}>
                    <td>{t('common.blacklist')}</td>
                    <td>{item}</td>
                  </tr>
                );
              })}
              {map(this.state.whiteList, item => {
                return (
                  <tr key={item}>
                    <td>{t('common.whitelist')}</td>
                    <td>{item}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </XwjAnalysisPoolIAO_PanelBody>
        {this.attachmentRender()}
        <div className="border-top text-right pt-2 pr-5">
          <Button type="button" color="primary" size="sm" onClick={this.saveTestStation}>
            <i className="fa fa-dot-circle-o mr-1" />{t('common.save')}
          </Button>
        </div>
      </XwjAnalysisPoolIAO_Panel>
    );
  }

  saveTestStation = () => {
    let fileItem = this.state.attachment;
    this.setState({
      attachmentInvalid: fileItem.size > (30 * 1024 * 1024)
    }, () => {
      if (!this.state.attachmentInvalid){
        let formData = new FormData();
        // formData.append('id', this.props.product.id);
        formData.append('product', this.props.product.product);
        formData.append('listType', 1);
        formData.append('file', fileItem);
        uploadStationFilterList(this.props.product.id, formData)
          .then(code => {
            if (code === 422){
              this.props.pushNotification(this.props.t('message.product.statistic_config_upload_fail'));
            } else {
              this.props.pushNotification(this.props.t('message.system.save_succeed'), {level: 'success'});
            }
          })
      }
    })
  };

  attachmentRender = () => {
    return (
      <React.Fragment>
        {this.state.attachmentInvalid? (
          <FormFeedback className="d-block">{this.props.t('common.attachment_tip')}</FormFeedback>
        ): null}
        {this.attachmentListRender()}
      </React.Fragment>
    );
  };

  attachmentListRender = () => {
    if (!this.state.attachment) {
      return null;
    }
    return (
      <AttachmentCard
        className={`mt-2 mb-1 ${this.state.attachmentInvalid? 'border-danger': ''}`}
        header={this.state.attachment.name} >
        <div className="d-block">
          <small className="text-muted">{filesize(this.state.attachment.size)}</small>
          <Button 
            active tag="a" color="link" className="text-dark py-0" 
            href={window.URL.createObjectURL(this.state.attachment)}>
            <i className="fa fa-cloud-download icons font-lg" />
          </Button>
          <Button active color="link" className="text-dark py-0" onClick={e => {
            this.setState({ attachment: null });
          }}>
            <i className="fa fa-trash-o icons font-lg" />
          </Button>
        </div>
      </AttachmentCard>
    );
  };

  fileSelectTrigger = e => {
    this.attachment.click();
  };

  fileSelectedHandler = e => {
    let files = e.target.files;
    let attachment = files[0];
    this.setState({ attachment });
  };

  fileDownload(){
    let downloadURL = API_SERVICE_BASE_URL +
      `/products/${this.props.product.id}/etl/filters/station/download?product=${this.props.product.product}`;
    window.open(downloadURL);
  }
}

export default withTranslation()(Product_StatisticTestStation);
