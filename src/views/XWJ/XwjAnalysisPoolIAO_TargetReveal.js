import React from "react";
import {Button, Label, Pagination, PaginationItem, PaginationLink, Table} from 'reactstrap'
import { getAnalysisPoolData } from '../../action/analysis-pool-action'
import {padStart} from "lodash";
import {convertArrayToCSV} from "convert-array-to-csv";
import {withTranslation} from "react-i18next";

class XwjAnalysisPoolIAO_TargetReveal extends React.PureComponent {
  state = {
    pool: null,
    currentPage: 0,
    recordLength: 10,
    maxPaginationLength: 10,
  };

  componentDidMount () {
    this.fetchPagingPoolData(1);
  }

  render() {
    if (this.state.currentPage === 0) {
      return null;
    }

    const { t } = this.props;
    let {currentPage, recordLength, pool} = this.state;
    let recordNumber = ((currentPage - 1) * recordLength) + 1;
    let PaginationComponent = this.paginationGenerator();

    return (
      <div className="position-relative" ref={ref => this.root = ref}>
        <div className="position-absolute" style={{ top: '1em', right: '2em' }}>
          <Button
            color="link"
            onClick={this.fetchAllDataPool}
            className="card-header-action">
            <i className="fa fa-download fa-lg" />
          </Button>
        </div>
        <Label className="my-3">
          {t('common.records_template', {
            records: pool.totalElements,
            fields: pool.head_name.length
          })}
        </Label>
        {PaginationComponent}
        <Table responsive striped className="nowrap">
          <thead>
          <tr>
            <th className="border-top-0">{t('common.serial')}</th>
            {this.state.pool.head_name.map(head => {
              return (<th key={head} className="border-top-0">{head}</th>);
            })}
          </tr>
          </thead>
          <tbody>
          {this.state.pool.row_data.map((row, index) => {
            return (
              <tr key={index}>
                <td>{index + recordNumber}</td>
                {row.map((cell, index) => {
                  return (<td key={index}>{cell}</td>);
                })}
              </tr>
            );
          })}
          </tbody>
        </Table>
        {PaginationComponent}
      </div>
    );
  };

  paginationGenerator = () => {
    let {currentPage, pool, maxPaginationLength} = this.state;
    let paginationStart = parseInt((currentPage - 1) / maxPaginationLength) * maxPaginationLength + 1;
    let paginationLength = pool.totalPages >= (paginationStart + maxPaginationLength - 1)?
      maxPaginationLength: pool.totalPages % maxPaginationLength;
    return (
      <Pagination aria-label="Page navigation example">
        <PaginationItem>
          <PaginationLink
            previous
            disabled={(1 === currentPage)}
            onClick={this.pageBackward} />
        </PaginationItem>
        {(Array(paginationLength).fill(null)).map((item, index) => {
          let page = paginationStart + index;
          let isCurrent = (currentPage === page);
          return (
            <PaginationItem key={page}>
              <PaginationLink
                className={isCurrent? 'bg-secondary': undefined}
                disabled={isCurrent}
                onClick={(e) => this.fetchPagingPoolData(page)}>{padStart(page, 2, '0')}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationLink
            next
            disabled={(currentPage === pool.totalPages)}
            onClick={this.pageForward} />
        </PaginationItem>
      </Pagination>
    );
  };

  pageBackward = e => {
    let page = (this.state.currentPage - this.state.maxPaginationLength) > 0?
      (this.state.currentPage - this.state.maxPaginationLength): 1;
    this.fetchPagingPoolData(page);
  };

  pageForward = e => {
    let page = (this.state.currentPage + this.state.maxPaginationLength) <= this.state.pool.totalPages?
      (this.state.currentPage + this.state.maxPaginationLength): this.state.pool.totalPages;
    this.fetchPagingPoolData(page);
  };

  fetchPagingPoolData = (pageNum) => {
    if (pageNum !== this.state.currentPage) {
      this.props.toggleLoading(true);
      getAnalysisPoolData(
        this.props.analysisPoolInfo.id,
        pageNum,
        this.state.recordLength,
      ).then(pool => this.setState({
        currentPage: pageNum,
        pool
      }, this.props.toggleLoading));
    }
  };

  fetchAllDataPool = () => {
    getAnalysisPoolData(this.props.analysisPoolInfo.id, 1, this.state.pool.totalElements).then(poolData => {
      // let csvData = [poolData.head_name].concat(poolData.row_data);
      const csv = convertArrayToCSV(poolData.row_data, {
        header: poolData.head_name,
        // separator: ';'
      });
      // console.log(csv);
      let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      let filename = `${this.props.analysisPoolInfo.name}.csv`;
      if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
      } else {
        let link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          let url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", filename);
          link.style.visibility = 'hidden';
          this.root.appendChild(link);
          link.click();
          this.root.removeChild(link);
        }
      }
    });
  };
}

export default withTranslation()(XwjAnalysisPoolIAO_TargetReveal);
