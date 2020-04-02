import React, {Fragment, useEffect, useRef, useState} from "react";
import {getEntryTails, getRoles, getRolesDetail} from "../../action/user-action";
import {Button, Card, CardBody, CardHeader, Input, Popover, PopoverBody, Table} from "reactstrap";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";
import withLoading from "../../utils/hoc/withLoading";
import {useTranslation} from "react-i18next";
import {withRouter} from "react-router-dom";
import {isEmpty, some} from "lodash";
import DataModal from "../Coommon/DataModal";
import Tree from "./Tree";
import {getMenu, getMenuAnchors} from "../../utils/menu-util";

// const RoleEntryPopover = (props) => {
//   return (
//     <DataModal {...props} size="sm">
//       <Tree entries={props.entries}/>
//     </DataModal>
//   );
// };

const RoleList = withRouter(function (props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [entries, setEntries] = React.useState([]);

  return (
    <React.Fragment>
      <DataModal isOpen={isOpen} caption={t('common.permission')} toggle={e => setIsOpen(false)} size="sm">
        <Tree entries={entries}/>
      </DataModal>
      {/*<RoleEntryPopover isOpen={!!permission} entries={permission} caption={t('common.permission')} toggle={e => setPermissions(null)} />*/}
      <Table className="nowrap mt-3" responsive hover>
        <thead>
        <tr className="text-center">
          <th className="border-top-0">{t('common.serial')}</th>
          <th className="border-top-0">{t('common.name')}</th>
          <th className="border-top-0">{t('common.note')}</th>
          <th className="border-top-0">{t('common.reveal')}</th>
        </tr>
        </thead>
        <tbody>
        {props.roles.map((role, index) => (
          <tr key={role.id}>
            <td className="align-middle text-center">{index + 1}</td>
            <td className="align-middle text-center">
              <Button color="link" onClick={e => props.history.push(`/platform/roles/${role.id}/edit`)}>
                {role.name}
              </Button>
            </td>
            <td className="align-middle text-center">{role.remark}</td>
            <td className="align-middle text-center">
              <Button size="sm" className="fa fa-list mx-1"
                      onClick={e => {
                        let entries = getMenu(role.permission);
                        // console.log('entries: ', entries);
                        setEntries(entries);
                        setIsOpen(true);
                      }} />
              {/*<RoleEntryPopover role={role}/>*/}
            </td>
          </tr>
        ))}
        </tbody>
      </Table>
    </React.Fragment>
  );
});

// const isExist = (entries, keyword) => {
//   return entries.reduce((isHit, {key, child}) => {
//     return isHit || key === keyword || (child && isExist(child, keyword));
//   }, false);
// };

export default withLoading(function (props) {
  const { t } = useTranslation();
  const entries = getMenuAnchors();
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const entryRef = useRef();

  const roleFilter = key => {
    if (isEmpty(key)) {
      return setFilteredRoles(roles);
    }
    setFilteredRoles(roles.filter(role => some(role.permission, { key })));
  };

  useEffect(() => {
    getRolesDetail()
      .then(roles => {
        setRoles(roles);
        setFilteredRoles(roles);
      });

    // Promise.all([getEntryTails(), getRolesDetail()])
    //   .then(([entryTails, roles]) => {
    //     setEntries(entryTails);
    //     setRoles(roles);
    //     setFilteredRoles(roles);
    //   });
  }, []);

  return (
    <Card>
      <CardHeader className="px-4">
        <span>{t('platform.roles.query')}</span>
        <div className="card-header-actions">
          <Button
            color="link"
            className="card-header-action"
            onClick={e => props.history.push('/platform/roles/create')}>
            <i className="fa fa-plus fa-lg" />
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <FormRow>
          <FormPropertyColumn md={4}>
            <BoldLabel>{t('platform.roles.entry')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={4}>
            <Input type="select" bsSize="sm" innerRef={entryRef} onChange={e => roleFilter(e.currentTarget.value)}>
              <option value="">{t('common.choose')}</option>
              {entries.map(({key}) => (
                <option key={key} value={key}>{t(`menu.${key}`)}</option>
              ))}
            </Input>
          </FormValueColumn>
        </FormRow>

        <RoleList roles={filteredRoles} />
      </CardBody>
    </Card>
  );
}
);
