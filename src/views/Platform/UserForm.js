import {FormFeedback, FormGroup, Input, Label} from "reactstrap";
import React from "react";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";
import {isEmpty, xor, uniqBy, map, flatMap} from "lodash";
import {getRolesDetail, resetPassword} from "../../action/user-action";
import ConfirmModal from "../Coommon/ConfirmModal";
import {FieldLayout} from "./Layout";
import Tree from "./Tree";
import {getMenu} from "../../utils/menu-util";

const AccountField = function ({t, children}) {
  return (<FieldLayout caption={t('common.account')}>{children}</FieldLayout>);
};

const NameField = React.forwardRef(function ({t, invalid, value}, ref) {
  return (
    <FieldLayout caption={t('common.name')}>
      <Input type="text" bsSize="sm" invalid={invalid} innerRef={ref} defaultValue={value} />
    </FieldLayout>
  );
});

const DepartmentField = React.forwardRef(function ({t, invalid, value}, ref) {
  return (
    <FieldLayout caption={t('platform.users.department')}>
      <Input type="text" bsSize="sm" invalid={invalid} innerRef={ref} defaultValue={value} />
    </FieldLayout>
  );
});

const EmailField = React.forwardRef(function ({t, invalid, value}, ref) {
  return (
    <FieldLayout caption={t('common.email')}>
      <Input type="text" bsSize="sm" invalid={invalid} innerRef={ref} defaultValue={value} />
    </FieldLayout>
  );
});

const NoteField = React.forwardRef(function ({t, invalid, value}, ref) {
  return (
    <FieldLayout caption={t('common.note')}>
      <Input type="text" bsSize="sm" invalid={invalid} innerRef={ref} defaultValue={value} />
    </FieldLayout>
  );
});

const StatusField = React.forwardRef(function ({t, value = 1, suspend_time}, ref) {
  // console.log('value: ', value);
  const [status, setStatus] = React.useState(value);
  React.useImperativeHandle(ref, () => ({
    value: status
  }));
  React.useEffect(() => setStatus(value), [value]);
  // console.log('status: ', status);

  return (
    <FieldLayout caption={t('common.status')}>
      <FormGroup check>
        <Input type="radio" id="user.activate" checked={status === 1} onChange={e => setStatus(1)} />
        <Label htmlFor="user.activate">{t('common.activate')}</Label>
      </FormGroup>
      <FormGroup check>
        <Input type="radio" id="user.suspend" checked={status === 0} onChange={e => setStatus(0)} />
        <Label htmlFor="user.suspend">
          {t('platform.users.suspend')}({t('platform.users.suspend_datetime')}：{suspend_time || t('common.none')})
        </Label>
      </FormGroup>
    </FieldLayout>
  );
});

const RoleField = React.forwardRef(function ({t, value, toggleLoading}, ref) {
  const [roles, setRoles] = React.useState([]);
  const [checked, setChecked] = React.useState([]);

  React.useEffect(() => {
    toggleLoading(true);
    getRolesDetail()
      .then(setRoles)
      .finally(toggleLoading);
  }, []);

  React.useEffect(() => setChecked(map(value, 'id')), [value]);

  React.useImperativeHandle(ref, () => ({
    value: checked
  }));

  let permission = [].concat(...uniqBy(flatMap(roles.filter(r => (checked.indexOf(r.id) >= 0)), 'permission'), 'key'));
  let entries = getMenu(permission);

  return (
    <FieldLayout caption={t('common.role')}>
      {roles.map(role => (
        <FormGroup check key={role.id}>
          <Input type="checkbox" id={`role_${role.id}`} defaultChecked={checked.indexOf(role.id) >= 0}
                 onChange={e => setChecked(xor(checked, [role.id]))} />
          <Label htmlFor={`role_${role.id}`}>{role.name}</Label>
        </FormGroup>
      ))}
      <div className="mt-4 mb-2 border-bottom font-weight-bold font-sm">權限群組預覽</div>
      <div className="mb-2 pl-2">
        <Tree entries={entries}/>
      </div>
    </FieldLayout>
  );
});

const ChangePasswordModal = function (props) {
  const { t } = props;
  const [invalidMsg, setInvalidMsg] = React.useState();
  const nPwdRef = React.useRef();
  const cPwdRef = React.useRef();
  const resetPwdHandler = e => {
    if (isEmpty(nPwdRef.current.value) || isEmpty(cPwdRef.current.value) ||
      (nPwdRef.current.value !== cPwdRef.current.value)) {
      return setInvalidMsg(t('platform.users.confirm_password_tip'));
    }

    resetPassword(props.account, nPwdRef.current.value)
      .then(data => props.toggle(false))
      .catch(error => setInvalidMsg(t('platform.users.reset_password_failed_tip')));
  };

  return (
    <ConfirmModal caption={t('common.change_password')} confirm={resetPwdHandler}
                  cancel={e => props.toggle(false)} isOpen={props.isOpen}>
      <FormRow>
        <FormPropertyColumn md={4}>
          <BoldLabel>{t('profile.password_new')}</BoldLabel>
        </FormPropertyColumn>
        <FormValueColumn>
          <Input type="password" invalid={!!invalidMsg} innerRef={nPwdRef} bsSize="sm" />
        </FormValueColumn>
      </FormRow>

      <FormRow>
        <FormPropertyColumn md={4}>
          <BoldLabel>{t('profile.password_confirm')}</BoldLabel>
        </FormPropertyColumn>
        <FormValueColumn>
          <Input type="password" invalid={!!invalidMsg} innerRef={cPwdRef} bsSize="sm" />
          <FormFeedback className="help-block">{invalidMsg}</FormFeedback>
        </FormValueColumn>
      </FormRow>
    </ConfirmModal>
  );
};

export {
  FieldLayout, AccountField, NameField, DepartmentField,
  EmailField, NoteField, StatusField, RoleField, ChangePasswordModal
}
