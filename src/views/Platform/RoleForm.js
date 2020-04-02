import React, {useEffect, useImperativeHandle, useRef, useState} from "react";
import {Collapse, FormGroup, Input} from "reactstrap";
import {FieldLayout} from "./Layout";
// import {getEntries} from "../../action/user-action";
import CardHeader from "reactstrap/es/CardHeader";
import {find, padStart, concat, map, sum} from "lodash";
import CardBody from "reactstrap/es/CardBody";
import {useTranslation, withTranslation} from "react-i18next";
import {getMenu} from "../../utils/menu-util";

const NameField = React.forwardRef(function ({t, invalid, value}, forwardRef) {
  return (
    <FieldLayout caption={t('common.name')}>
      <Input type="text" bsSize="sm" invalid={!!invalid} innerRef={forwardRef} defaultValue={value} />
    </FieldLayout>
  );
});

const NoteField = React.forwardRef(function ({t, invalid, value}, forwardRef) {
  return (
    <FieldLayout caption={t('common.note')}>
      <Input type="text" bsSize="sm" invalid={!!invalid} innerRef={forwardRef} defaultValue={value} />
    </FieldLayout>
  );
});

// const PermissionEntry = withTranslation(undefined, { withRef: true })(
//   class extends React.PureComponent {
//     state = {
//       isOpen: false
//     };
//
//     ref = React.createRef();
//     restRefs = [React.createRef(), React.createRef(), React.createRef()];
//     // isTail = (this.props.entry.child.length === 0);
//
//     get value() {
//       let { key, name, url, children = [] } = this.props.entry;
//
//       if (!children) {
//         let _rChecked = this.ref.current.checked;
//         // console.log(`id: ${key}: `, this.ref.current.checked);
//         let authority = [this.ref].concat(this.restRefs).reduce((dAuth, checkRef, index) => {
//           // console.log('key: ', key, 'dAuth: ', dAuth, 'pow: ', Math.pow(2, index), (_rChecked && checkRef.current.checked)? 1: 0);
//           return dAuth + (Math.pow(2, index) * ((_rChecked && checkRef.current.checked)? 1: 0));
//           // console.log(res);
//           // return res;
//         }, 0);
//         return { key, authority };
//       }
//
//       return this.ref.current.value;
//       // console.log('PermissionEntry: ', a);
//       // return a;
//     }
//
//     render() {
//       const { t, value } = this.props;
//       const { key, name, url, children = [] } = this.props.entry;
//       console.log('this.props.entry: ', this.props.entry);
//       let { authority = 0 } = value;
//       console.log('authority: ', authority);
//       let isTail = !children;
//       let [_cRef, _uRef, _dRef] = this.restRefs;
//       let [_d, _u, _c, _r] = padStart(Number(authority).toString(2), 4).substr(-4).split('').map(x => (x === '1'));
//       console.log('_r: ', _r);
//
//       if (isTail) {
//         return (
//           <CardHeader className="bg-white border-0 pb-0">
//             <FormGroup check>
//               <Input type="checkbox" innerRef={this.ref} defaultChecked={_r} onClick={e => this.setState({ isOpen: e.target.checked })} />
//               <span>{name}</span>
//             </FormGroup>
//             <Collapse isOpen={this.state.isOpen}>
//               <FormGroup check inline className="pl-4">
//                 <Input type="checkbox" innerRef={_cRef} defaultChecked={_c} />
//                 <span className="mr-3">{t('common.permission_create')}</span>
//                 <Input type="checkbox" innerRef={_uRef} defaultChecked={_u} />
//                 <span className="mr-3">{t('common.permission_update')}</span>
//                 <Input type="checkbox" innerRef={_dRef} defaultChecked={_d} />
//                 <span className="mr-3">{t('common.permission_delete')}</span>
//               </FormGroup>
//             </Collapse>
//           </CardHeader>
//         );
//       }
//
//       return (
//         <React.Fragment>
//           <CardHeader className="bg-white">
//             <i className="fa fa-angle-down mr-3" />
//             <span>{name}</span>
//           </CardHeader>
//           <CardBody className="py-0 pr-0">
//             <PermissionEntries ref={this.ref} entries={children} t={t} value={value} />
//           </CardBody>
//         </React.Fragment>
//       );
//     }
//   }
// );

const PermissionBranchEntry = React.forwardRef(function({entry: {key, name, children}, permission}, forwardRef) {
  // const myPermission = find(permission, {key});
  const ref = useRef();
  const isFail = (!children);

  React.useImperativeHandle(forwardRef, () => ({
    get value() {
      if (isFail)
        return [];

      let newPermission = ref.current.value;
      let authority = map(newPermission, 'authority').reduce((authority, x) => (x | authority), 0);
      if (authority > 0)
        newPermission.push({key, authority});
      return newPermission;
    }
  }));

  if (isFail)
    return null;

  return (
    <React.Fragment>
      <CardHeader className="bg-white">
        <i className="fa fa-angle-down mr-3" />
        <span>{name}</span>
      </CardHeader>
      <CardBody className="py-0 pr-0">
        <PermissionEntries ref={ref} entries={children} permission={permission} />
      </CardBody>
    </React.Fragment>
  );
});

const PermissionLeafEntry = React.forwardRef(function({entry: {key, name, children}, permission}, forwardRef) {
  const myPermission = find(permission, {key}) || {key, authority: 0};
  const { authority } = myPermission;
  const { t } = useTranslation();
  const [_rRef, _cRef, _uRef, _dRef] = [useRef(), useRef(), useRef(), useRef()];
  const [_rCk, _cCk, _uCk, _dCk] = Array(4).fill(false).map((x, index) => Boolean(Math.pow(2, index) & authority));
  const refs = [_rRef, _cRef, _uRef, _dRef];
  const [open, setOpen] = useState(_rCk);
  const rPermissionCheckHandler = e => {
    let isChecked = e.target.checked;
    _cRef.current.checked = isChecked;
    _uRef.current.checked = isChecked;
    _dRef.current.checked = isChecked;
    setOpen(isChecked);
  };

  React.useImperativeHandle(forwardRef, () => ({
    get value() {
      let authority = refs.reduce((authority, ref, index) => ((ref.current.checked? Math.pow(2, index): 0) | authority), 0);
      return (_rRef.current.checked && authority > 0)? {key, authority}: [];
    }
  }));

  return (
    <CardHeader className="bg-white border-0 pb-0">
      <FormGroup check>
        <Input type="checkbox" innerRef={_rRef} defaultChecked={_rCk} onClick={rPermissionCheckHandler} />
        <span>{name}</span>
      </FormGroup>
      <Collapse isOpen={open}>
        <FormGroup check inline className="pl-4">
          <Input type="checkbox" innerRef={_cRef} defaultChecked={_cCk} />
          <span className="mr-3">{t('common.permission_create')}</span>
          <Input type="checkbox" innerRef={_uRef} defaultChecked={_uCk} />
          <span className="mr-3">{t('common.permission_update')}</span>
          <Input type="checkbox" innerRef={_dRef} defaultChecked={_dCk} />
          <span className="mr-3">{t('common.permission_delete')}</span>
        </FormGroup>
      </Collapse>
    </CardHeader>
  );
});

const PermissionEntries = React.forwardRef(function({entries, permission}, forwardRef) {
  const _refs = Array.from(entries, x => React.createRef());

  React.useImperativeHandle(forwardRef, () => ({
    get value() {
      // console.log('PermissionEntries: ', this._refs);
      return concat(..._refs.map(ref => ref.current.value));
    }
  }));

  return (
    <React.Fragment>
      {
        entries.map((entry, index) => {
          let EntryComponent = (entry.children)? PermissionBranchEntry: PermissionLeafEntry;
          let props = {entry, permission};

          return <EntryComponent key={entry.key} ref={_refs[index]} {...props} />
        })
      }
    </React.Fragment>
  );
});

// class _PermissionEntries extends React.PureComponent {
//   constructor(props) {
//     super(props);
//     this._refs = Array.from(props.entries, x => React.createRef());
//     // console.log('PermissionEntries: ', this._refs);
//   }
//
//   get value() {
//     // console.log('PermissionEntries: ', this._refs);
//     return concat(...this._refs.map(ref => ref.current.value));
//   }
//
//   render() {
//     let {entries, value} = this.props;
//     // console.log('value: ', value);
//
//     return (
//       <React.Fragment>
//         {
//           entries.map((entry, index) => {
//             let props = {entry, permission: find(value, {key: entry.key})};
//             if (entry.children) {
//               return (<PermissionBranchEntry key={entry.key} ref={this._refs[index]} {...props} />)
//             }
//             return (<PermissionLeafEntry key={entry.key} ref={this._refs[index]} {...props} />)
//           })
//         }
//       </React.Fragment>
//     );
//   }
// }

const PermissionField = withTranslation(undefined, { withRef: true })(
  class extends React.PureComponent {

    ref = React.createRef();

    get value() {
      return this.ref.current.value;
    }

    render() {
      if (!this.props.value) {
        return null;
      }

      const { t } = this.props;
      return (
        <FieldLayout caption={t('common.permission')}>
          <PermissionEntries ref={this.ref} permission={this.props.value} entries={getMenu()} />
        </FieldLayout>
      );
    }
  }
);

export {NameField, NoteField, PermissionField}
