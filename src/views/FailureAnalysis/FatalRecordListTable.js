import React, {PureComponent} from 'react';
import {Table} from 'reactstrap';
// import FatalRecordTable from "./FatalRecordListTable";

class FatalRecordTable extends PureComponent {
  render () {
    // if (!this.props.fatalRecords) {
    //   return (<div className="text-center"><i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" /></div>);
    // }

    const SelectorCaption = this.props.SelectorCaption;
    const SelectorComponent = this.props.SelectorComponent;

    return (
      <Table className="nowrap" responsive hover>
        <thead>
        <tr className="text-center">
          <th className="border-top-0"><SelectorCaption /></th>
          <th className="border-top-0">測試時間</th>
          <th className="border-top-0">SN</th>
          <th className="border-top-0">測試工站</th>
          <th className="border-top-0">測試設備</th>
          <th className="border-top-0">不良徵狀</th>
          <th className="border-top-0">失敗描述</th>
          {/*<th className="border-top-0">{''}</th>*/}
        </tr>
        </thead>
        <tbody className="border-bottom">
        {this.props.fatalRecords.map((item, index) => {
          return (
            <tr key={index} className="text-center">
              <td className="align-middle"><SelectorComponent item={item} name="fatal_record" /></td>
              <td className="align-middle">{item.testStartTime}</td>
              <td className="align-middle">{item.sn}</td>
              <td className="align-middle">{item.station}</td>
              <td className="align-middle">{item.machine}</td>
              <td className="align-middle">{item.failureSymptom}</td>
              <td className="align-middle">{item.failure_desc}</td>
              {/*<td className="align-middle">{item.failureSymptom.map((item, index) => <div key={index} className="d-block">{item}</div>)}</td>*/}
              {/*<td className="align-middle">{item.failTime}</td>*/}
              {/*<td className="align-middle">*/}
              {/*<Button outline size="sm" color="primary" disabled={this.state.loading} onClick={e => {*/}
              {/*this.failureImportHandler(index, item);*/}
              {/*}}>*/}
              {/*<i className="fa icon-plus"/> 新增*/}
              {/*</Button>*/}
              {/*</td>*/}
            </tr>
          );
        })}
        </tbody>
      </Table>
    );
  };
}

class FatalRecordTableViewer extends PureComponent {
  // state = {
  //   selectedItem: null
  // };

  SelectorCaption = (props) => {
    return null;
  };

  SelectorComponent = (props) => {
    return null;
  };

  render () {
    return (
      <FatalRecordTable
        SelectorCaption={this.SelectorCaption}
        SelectorComponent={this.SelectorComponent}
        caption {...this.props} />
    );
  }
}

class FatalRecordRadioTable extends FatalRecordTableViewer {
  state = {
    selectedItem: null
  };

  item = () => {
    return this.state.selectedItem;
  };

  // SelectorCaption = (props) => {
  //   return null;
  // };

  SelectorComponent = (props) => {
    return (
      <div>
        <input type="radio" name={props.name} onClick={() => this.setState({ selectedItem: props.item})} />{props.label}
      </div>
    );
  };
}

class FatalRecordCheckboxTable extends FatalRecordTableViewer {
  state = {
    selectedItem: []
  };

  item = () => {
    // console.log('this.state.selectedItem: ', this.state.selectedItem);
    return this.state.selectedItem;
  };

  SelectorComponent = (props) => {
    return (
      <input type="checkbox" name={props.name} onClick={() => this.setState(prevState => {
        // console.log('props.item: ', props.item);
        // console.log('prevState.selectedItem: ', prevState.selectedItem);
        let selectedItem = prevState.selectedItem.filter(stateItem => {
          return (stateItem !== props.item);
        });

        if (selectedItem.length === prevState.selectedItem.length) {
          selectedItem.push(props.item);
        }

        // console.log('selectedItem: ', selectedItem);
        return { selectedItem };
      })} />
    );
  };
}

export {FatalRecordTableViewer, FatalRecordRadioTable, FatalRecordCheckboxTable};
