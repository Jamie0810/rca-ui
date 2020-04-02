
const urlPath = window.location.pathname.split('/').filter(path => {
  return path.length > 0;
});

const titleMapper = {
  'dtsa-lx': 'DTSA-L10',
  'ipbd-lx-printer': 'IPBD-L10-Printer',
  'ipbd-lx-monitor': 'IPBD-L10-Monitor',
  'ipbd-lvi-printer': 'IPBD-L6-Printer',
  'ipcd-lx': 'IPCD-L10',
  'cartridge-nesta': 'Cartridge-Nesta',
  'cartridge-lava': 'Cartridge-Lava',
  'cartridge-zippy': 'Cartridge-Ziggy',
  'dev': 'development'
};

const flag = (urlPath.length === 3);

const SITE_TITLE = flag && titleMapper[urlPath[1]]? `${titleMapper[urlPath[1]]}`: `${process.env.REACT_APP_SITE_TITLE}`;
const SITE_CODE = flag? `_${urlPath[1]}_`: `${process.env.REACT_APP_SITE_CODE}`;
const API_SERVICE_BASE_URL = flag? `${process.env.REACT_APP_REMOTE_API_DOMAIN}/${urlPath[0]}/${urlPath[1]}/api`: `${process.env.REACT_APP_REMOTE_API_DOMAIN}`;

const PATHS = {
  index: { path: '/' },
  home: { path: '/home' },
  login: { path: '/login' },
  register: { path: '/register' },
  page_404: { path: '/404' },
  page_500: { path: '/500' },
  //顯微鏡
  wyj: { path: '/wyj' },
  wyj_dashboard: { path: '/wyjDashBoard' },
  wyj_matrix: { path: '/xwj/matrix/:id' },
  //放大鏡
  fdj: { path: '/fdj' },
  fdj_defect: { path: '/fdj/defective' },
  fdj_validation: { path: '/fdj/validation' },
  fdj_validation_create: { path: '/fdj/validation/create' },
  // FA案例
  fa: { path: '/fa' },
  fa_create: { path: '/fa/create' },
  fa_list: { path: '/fa/query' },
  // 顯微鏡
  xwj: { path: '/xwj' },
  xwj_dataset_create: { path: '/xwj/dataset/create' },
  xwj_dataset_query: { path: '/xwj/dataset/query' },
  xwj_dataset_list: { path: '/xwj/dataset/list' },
  xwj_dataset_edit: { path: '/xwj/dataset/list/:id/edit' },
  xwj_dataset_reveal: { path: '/xwj/dataset/list/:id' },
  // 顯微鏡-分析集
  xwj_analysis_query: { path: '/xwj/analysis/query' },
  xwj_analysis_list: { path: '/xwj/analysis/list' },
  xwj_analysis_create: { path: '/xwj/analysis/create' },
  xwj_analysis_edit: { path: '/xwj/analysis/list/:id/edit' },
  xwj_analysis_reveal: { path: '/xwj/analysis/list/:id' },
  //設定
  configuration: { path: '/configuration' },
  configuration_code: { path: '/configuration/mapper' },
  // 新產品導入
  configuration_product: { path: '/configuration/products' },
  configuration_product_create: { path: '/configuration/products/create' },
  configuration_product_edit: { path: '/configuration/products/:id/edit' },
  configuration_product_reveal: { path: '/configuration/products/:id' },
  // 系統管理
  platform: { path: '/platform' },
  platform_users: { path: '/platform/users' },
  platform_user_create: { path: '/platform/users/create' },
  platform_user_edit: { path: '/platform/users/:account/edit' },
  platform_roles: { path: '/platform/roles' },
  platform_role_create: { path: '/platform/roles/create' },
  platform_role_edit: { path: '/platform/roles/:id/edit' },
};

export {SITE_TITLE, SITE_CODE, API_SERVICE_BASE_URL, PATHS}
