import React from "react";
import {
  XwjAnalysisPoolIAO_Panel,
  XwjAnalysisPoolIAO_PanelBody,
  XwjAnalysisPoolIAO_PanelHeader
} from "../XWJ/XwjAnalysisPoolIAO_Panel";
import { Table } from 'reactstrap';
import { getMaterialTransformData } from "../../action/product-action";
import {assign, concat, map} from "lodash";
import {withTranslation} from "react-i18next";

class Product_StatisticMaterialTransform extends React.PureComponent{
  state = {
    materialTransformData: []
  };

  componentDidMount() {
    getMaterialTransformData(this.props.product.id, { product: this.props.product.product })
      .then(materialTransformData => {
        materialTransformData = concat(...map(
          materialTransformData, ({part_sn_lengthList, part_name_blacklist, part_name_whitelist}) =>
            map(part_sn_lengthList, row => assign(row, {
                white_list: part_name_whitelist.join(','),
                black_list: part_name_blacklist.join(',')
              }
            ))));
        this.setState({ materialTransformData }, this.props.toggleLoading)
      });
  }

  render() {
    const { t } = this.props;

    return (
      <XwjAnalysisPoolIAO_Panel>
        <XwjAnalysisPoolIAO_PanelHeader caption={t('product.data_filter.material_code_conversion_caption')}/>
        <XwjAnalysisPoolIAO_PanelBody>
          <Table responsive striped>
            <thead>
              <tr>
                <th className="border-top-0">
                  {t('product.data_filter.material_code_conversion.whitelist')}</th>
                <th className="border-top-0">
                  {t('product.data_filter.material_code_conversion.blacklist')}</th>
                <th className="border-top-0">
                  {t('product.data_filter.material_code_conversion.length_of_part_sn')}</th>
                <th className="border-top-0">
                  {t('product.data_filter.material_code_conversion.vendor_code')}</th>
                <th className="border-top-0">
                  {t('product.data_filter.material_code_conversion.vendor_code_start_index')}</th>
                <th className="border-top-0">
                  {t('product.data_filter.material_code_conversion.vendor_code_end_index')}</th>
                <th className="border-top-0">
                  {t('product.data_filter.material_code_conversion.vendor_code_criteria')}</th>
                <th className="border-top-0">
                  {t('product.data_filter.material_code_conversion.date_code_start_index')}</th>
                <th className="border-top-0">
                  {t('product.data_filter.material_code_conversion.date_code_end_index')}</th>
              </tr>
            </thead>
            <tbody>
            {this.state.materialTransformData.map((row, index) => (
              <tr key={index} className="text-center">
                <td className="align-middle">{row.white_list}</td>
                <td className="align-middle">{row.black_list}</td>
                <td className="align-middle">{row.part_sn_length}</td>
                <td className="align-middle">{row.vendor_constant}</td>
                <td className="align-middle">{row.vendor_start_index}</td>
                <td className="align-middle">{row.vendor_end_index}</td>
                <td className="align-middle">{row.match_vendor_name.join(',')}</td>
                <td className="align-middle">{row.date_start_index}</td>
                <td className="align-middle">{row.date_end_index}</td>
              </tr>
            ))}
            </tbody>
          </Table>
        </XwjAnalysisPoolIAO_PanelBody>
      </XwjAnalysisPoolIAO_Panel>
    );
  }
}

export default withTranslation()(Product_StatisticMaterialTransform);
