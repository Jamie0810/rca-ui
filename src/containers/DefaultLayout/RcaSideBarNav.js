import React, {PureComponent, useEffect, useState} from 'react';
import {AppSidebarNav} from '@coreui/react';
import {getPermission} from "../../action/profile-action";
import {getMenu} from "../../utils/menu-util";
import {getCookie} from "../../utils/cookie-util";
// import {withTranslation} from "react-i18next";

function RcaSideBarNav(props) {
  // console.log('profile: ', getCookie('profile'));
  const {superuser, permission} = getCookie('profile');
  const [items, setItems] = useState([]);
  //get menu tree
  useEffect(() => {
    setItems(getMenu(superuser? undefined: permission))
  }, [props.lang]);

  let navConfig = {items};

  return (
    <AppSidebarNav navConfig={navConfig} {...props} />
  );
}

export default RcaSideBarNav;
