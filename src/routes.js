import React from 'react';
import i18next from 'i18next';
import {assign} from 'lodash';
import {PATHS} from "./utils/site-util";
import withTracking from "./utils/hoc/withTracking";
// import {UserCreate, UserEdit} from "./views/Platform/UserForm";
// import Roles from "./views/Platform/Roles";
// import {RoleCreate, RoleEdit} from "./views/Platform/RoleForm";

// const Breadcrumbs = React.lazy(() => import('./views/Base/Breadcrumbs'));
// const Cards = React.lazy(() => import('./views/Base/Cards'));
// const Carousels = React.lazy(() => import('./views/Base/Carousels'));
// const Collapses = React.lazy(() => import('./views/Base/Collapses'));
// const Dropdowns = React.lazy(() => import('./views/Base/Dropdowns'));
// const Forms = React.lazy(() => import('./views/Base/Forms'));
// const Jumbotrons = React.lazy(() => import('./views/Base/Jumbotrons'));
// const ListGroups = React.lazy(() => import('./views/Base/ListGroups'));
// const Navbars = React.lazy(() => import('./views/Base/Navbars'));
// const Navs = React.lazy(() => import('./views/Base/Navs'));
// const Paginations = React.lazy(() => import('./views/Base/Paginations'));
// const Popovers = React.lazy(() => import('./views/Base/Popovers'));
// const ProgressBar = React.lazy(() => import('./views/Base/ProgressBar'));
// const Switches = React.lazy(() => import('./views/Base/Switches'));
// const Tables = React.lazy(() => import('./views/Base/Tables'));
// const Tabs = React.lazy(() => import('./views/Base/Tabs'));
// const Tooltips = React.lazy(() => import('./views/Base/Tooltips'));
// const BrandButtons = React.lazy(() => import('./views/Buttons/BrandButtons'));
// const ButtonDropdowns = React.lazy(() => import('./views/Buttons/ButtonDropdowns'));
// const ButtonGroups = React.lazy(() => import('./views/Buttons/ButtonGroups'));
// const Buttons = React.lazy(() => import('./views/Buttons/Buttons'));
// const Charts = React.lazy(() => import('./views/Charts'));
// const Dashboard = React.lazy(() => import('./views/Dashboard'));
// const CoreUIIcons = React.lazy(() => import('./views/Icons/CoreUIIcons'));
// const Flags = React.lazy(() => import('./views/Icons/Flags'));
// const FontAwesome = React.lazy(() => import('./views/Icons/FontAwesome'));
// const SimpleLineIcons = React.lazy(() => import('./views/Icons/SimpleLineIcons'));
// const Alerts = React.lazy(() => import('./views/Notifications/Alerts'));
// const Badges = React.lazy(() => import('./views/Notifications/Badges'));
// const Modals = React.lazy(() => import('./views/Notifications/Modals'));
// const Colors = React.lazy(() => import('./views/Theme/Colors'));
// const Typography = React.lazy(() => import('./views/Theme/Typography'));
// const Widgets = React.lazy(() => import('./views/Widgets/Widgets'));
// const Users = React.lazy(() => import('./views/Users/Users'));
// const User = React.lazy(() => import('./views/Users/User'));
const Home = React.lazy(() => import('./views/Defective/Home'));
// const DefectiveIndex = React.lazy(() => import('./views/Defective/Index'));
const ValidationQuery = React.lazy(() => import('./views/Validation/ValidationTasks'));
const ValidationCreate = React.lazy(() => import('./views/Validation/ValidationTaskCreate'));
const DefectiveQuery = React.lazy(() => import('./views/Defective/Layout'));
const FaCreateForm = React.lazy(() => import('./views/FailureAnalysis/FaCreateForm'));
const FaRevealLayout = React.lazy(() => import('./views/FailureAnalysis/FaRevealLayout'));
const XwjDatasetCreateForm = React.lazy(() => import('./views/XWJ/XwjDatasetCreate'));
const XwjDatasetEditForm = React.lazy(() => import('./views/XWJ/XwjDatasetEdit'));
const XwjDatasetQuery = React.lazy(() => import('./views/XWJ/XwjDatasetQuery'));
const XwjDatasetList = React.lazy(() => import('./views/XWJ/XwjDataset'));
const XwjDatasetReveal = React.lazy(() => import('./views/XWJ/XwjDatasetReveal'));
const XwjAnalysis = React.lazy(() => import('./views/XWJ/XwjAnalysis'));
const XwjAnalysisList = React.lazy(() => import('./views/XWJ/XwjAnalysisList'));
const XwjAnalysisCreate = React.lazy(() => import('./views/XWJ/XwjAnalysisCreate'));
const XwjAnalysisEdit = React.lazy(() => import('./views/XWJ/XwjAnalysisEdit'));
const XwjAnalysisPool = React.lazy(() => import('./views/XWJ/XwjAnalysisPool'));
const CodeMapper = React.lazy(() => import('./views/Config/CodeMapper'));
const Products = React.lazy(() => import('./views/Config/Products'));
const ProductCreate = React.lazy(() => import('./views/Config/ProductCreate'));
const ProductEdit = React.lazy(() => import('./views/Config/ProductEdit'));
const ProductReveal = React.lazy(() => import('./views/Config/ProductReveal'));
const Users = React.lazy(() => import('./views/Platform/Users'));
const UserCreate = React.lazy(() => import('./views/Platform/UserCreate'));
const UserEdit = React.lazy(() => import('./views/Platform/UserEdit'));
const Roles = React.lazy(() => import('./views/Platform/Roles'));
const RoleCreate = React.lazy(() => import('./views/Platform/RoleCreate'));
const RoleEdit = React.lazy(() => import('./views/Platform/RoleEdit'));
// const FaSnList = React.lazy(() => import('./views/RCA/FailureAnalysis/Create/List'));
// const FaEdit = React.lazy(() => import('./views/RCA/FailureAnalysis/Edit'));
// const FaEditForm = React.lazy(() => import('./views/RCA/FailureAnalysis/Edit/Form'));
// console.log(i18next);
// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config

const _routes = [
  { exact: true, key: 'home', component: withTracking(Home, 'home') },
  //顯微鏡
  // { exact: true, key: 'wyj', component: withTracking(WyjQuery, 'wyj') },
  //放大鏡
  { exact: true, key: 'fdj', component: withTracking(DefectiveQuery, 'fdj') },
  { exact: true, key: 'fdj_defect', component: withTracking(DefectiveQuery, 'fdj_defect') },
  { exact: true, key: 'fdj_validation', component: withTracking(ValidationQuery, 'fdj_validation') },
  { exact: true, key: 'fdj_validation_create', component: withTracking(ValidationCreate, 'fdj_validation_create') },
  // FA案例
  { exact: true, key: 'fa', component: withTracking(FaRevealLayout, 'fa') },
  { exact: true, key: 'fa_create', component: withTracking(FaCreateForm, 'fa_create') },
  { exact: true, key: 'fa_list', component: withTracking(FaRevealLayout, 'fa_list') },
  // 顯微鏡
  { exact: true, key: 'xwj', component: withTracking(XwjDatasetQuery, 'xwj')},
  { exact: true, key: 'xwj_dataset_create', component: withTracking(XwjDatasetCreateForm, 'xwj_dataset_create') },
  { exact: true, key: 'xwj_dataset_query', component: withTracking(XwjDatasetQuery, 'xwj_dataset_query') },
  { exact: true, key: 'xwj_dataset_list', component: withTracking(XwjDatasetList, 'xwj_dataset_list') },
  { exact: true, key: 'xwj_dataset_edit', component: withTracking(XwjDatasetEditForm, 'xwj_dataset_edit') },
  { exact: true, key: 'xwj_dataset_reveal', component: withTracking(XwjDatasetReveal, 'xwj_dataset_reveal') },
// 顯微鏡-分析集
  { exact: true, key: 'xwj_analysis_query', component: withTracking(XwjAnalysis, 'xwj_analysis_query') },
  { exact: true, key: 'xwj_analysis_list', component: withTracking(XwjAnalysisList, 'xwj_analysis_list') },
  { exact: true, key: 'xwj_analysis_create', component: withTracking(XwjAnalysisCreate, 'xwj_analysis_create') },
  { exact: true, key: 'xwj_analysis_edit', component: withTracking(XwjAnalysisEdit, 'xwj_analysis_edit') },
  { exact: true, key: 'xwj_analysis_reveal', component: withTracking(XwjAnalysisPool, 'xwj_analysis_reveal') },
//設定
  { exact: true, key: 'configuration', component: withTracking(CodeMapper, 'configuration') },
  { exact: true, key: 'configuration_code', component: withTracking(CodeMapper, 'configuration_code') },
// 新產品導入
  { exact: true, key: 'configuration_product', component: withTracking(Products, 'configuration_product') },
  { exact: true, key: 'configuration_product_create', component: withTracking(ProductCreate, 'configuration_product_create') },
  { exact: true, key: 'configuration_product_edit', component: withTracking(ProductEdit, 'configuration_product_edit') },
  { exact: true, key: 'configuration_product_reveal', component: withTracking(ProductReveal, 'configuration_product_reveal') },
// 系統管理
  { exact: true, key: 'platform', component: withTracking(Users, 'platform') },
  { exact: true, key: 'platform_users', component: withTracking(Users, 'platform_users') },
  { exact: true, key: 'platform_user_create', component: withTracking(UserCreate, 'platform_user_create') },
  { exact: true, key: 'platform_user_edit', component: withTracking(UserEdit, 'platform_user_edit') },
  { exact: true, key: 'platform_roles', component: withTracking(Roles, 'platform_roles') },
  { exact: true, key: 'platform_role_create', component: withTracking(RoleCreate, 'platform_role_create') },
  { exact: true, key: 'platform_role_edit', component: withTracking(RoleEdit, 'platform_role_edit') },
];

const routes = () => {
  return _routes.map(({key, exact, component}) => {
    let route = { path: PATHS[key].path, name: i18next.t(`menu.${key}`) };
    return assign(route, {exact, component});
  })
};

export { routes };
