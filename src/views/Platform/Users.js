import React, {useEffect, useState} from "react";
import {Button, Card, CardBody, CardHeader, Input, Table} from "reactstrap";
import {useTranslation} from "react-i18next";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn, PlainColumn} from "../Layout";
import {getRoles, getUsers} from "../../action/user-action";
import {withRouter} from "react-router-dom";
import withLoading from "../../utils/hoc/withLoading";
import {isEmpty} from "lodash";

const UserList = withRouter((props) => {
  const { t } = useTranslation();

  return (
    <Table className="nowrap mt-3" responsive hover>
      <thead>
      <tr className="text-center">
        <th className="border-top-0">{t('common.serial')}</th>
        <th className="border-top-0">{t('common.account')}</th>
        <th className="border-top-0">{t('common.name')}</th>
        <th className="border-top-0">{t('common.status')}</th>
        <th className="border-top-0">{t('common.role')}</th>
        <th className="border-top-0">{t('common.note')}</th>
        <th className="border-top-0">{t('platform.users.last_login_time')}</th>
        <th className="border-top-0">{t('common.modify_time')}</th>
      </tr>
      </thead>
      <tbody>
      {props.users.map((user, index) => (
        <tr key={user.account}>
          <td className="align-middle text-center">{index + 1}</td>
          <td className="align-middle text-center">
            <Button color="link" onClick={e => props.history.push(`/platform/users/${user.account}/edit`)}>
              {user.account}
            </Button>
          </td>
          <td className="align-middle text-center">{user.name}</td>
          <td className="align-middle text-center">{t((user.enable === 1)? 'common.activate': 'common.suspend')}</td>
          <td className="align-middle text-center">{user.roleName}</td>
          <td className="align-middle text-center">{user.remark}</td>
          <td className="align-middle text-center">{user.lastLoginTime}</td>
          <td className="align-middle text-center">{user.modifyTime}</td>
        </tr>
      ))}
      </tbody>
    </Table>
  );
});

export default withLoading(function (props) {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const { t } = useTranslation();
  const accountInput = React.createRef();
  const nameInput = React.createRef();
  const roleInput = React.createRef();
  const statusInput = React.createRef();

  const fetchUser = e => {
    props.toggleLoading(true);
    const criteria = {
      account: isEmpty(accountInput.current.value)? undefined: accountInput.current.value,
      name: isEmpty(nameInput.current.value)? undefined: nameInput.current.value,
      roleId: isEmpty(roleInput.current.value)? undefined: roleInput.current.value,
      enable: isEmpty(statusInput.current.value)? undefined: statusInput.current.value
    };
    getUsers(criteria)
      .then(setUsers)
      .finally(props.toggleLoading);
  };

  useEffect(() => {
    props.toggleLoading(true);
    getRoles()
      .then(setRoles)
      .finally(props.toggleLoading);
  }, []);

  return (
    <Card>
      <CardHeader className="px-4">
        <span>{t('platform.users.query')}</span>
        <div className="card-header-actions">
          <Button
            color="link"
            className="card-header-action"
            onClick={e => props.history.push('/platform/users/create')}>
            <i className="fa fa-plus fa-lg" />
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <FormRow>
          <FormPropertyColumn md={4}>
            <BoldLabel>{t('common.account')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={4}>
            <Input bsSize="sm" innerRef={accountInput} />
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={4}>
            <BoldLabel>{t('common.name')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={4}>
            <Input bsSize="sm" innerRef={nameInput} />
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={4}>
            <BoldLabel>{t('common.role')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={4}>
            <Input type="select" bsSize="sm" innerRef={roleInput}>
              <option value="">{t('common.choose')}</option>
              {roles.map(({id, name}) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </Input>
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={4}>
            <BoldLabel>{t('common.status')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={4}>
            <Input type="select" bsSize="sm" innerRef={statusInput}>
              <option value="">{t('common.choose')}</option>
              <option value="1">{t('common.activate')}</option>
              <option value="0">{t('common.suspend')}</option>
            </Input>
          </FormValueColumn>
          <PlainColumn>
            <Button type="button" size="sm" color="primary" onClick={fetchUser}>
              <i className="icon-magnifier mr-1"/>{t('common.search')}
            </Button>
          </PlainColumn>
        </FormRow>

        <UserList users={users}/>
      </CardBody>
    </Card>
  );
});
