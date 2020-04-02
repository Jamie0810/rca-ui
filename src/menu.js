import i18next from "i18next";

export default [
  {
    key: 'wyj',
    anchor: true,
    icon: 'fa fa-binoculars',
    attributes: {
      target: '_blank',
    }
  },
  {
    key: 'fdj',
    icon: 'cui-magnifying-glass',
    children: [
      {
        key: 'fdj_defect',
        anchor: true,
      },
      {
        key: 'fdj_validation',
        anchor: true,
      }
    ],
  },
  {
    key: 'fa',
    icon: 'cui-task',
    children: [
      {
        key: 'fa_create',
        anchor: true,
      },
      {
        key: 'fa_list',
        anchor: true,
      },
    ],
  },
  {
    key: 'xwj',
    icon: 'cui-graph',
    children: [
      {
        key: 'xwj_dataset_create',
        anchor: true,
      },
      {
        key: 'xwj_dataset_list',
        anchor: true,
      },
      {
        key: 'xwj_analysis_create',
        anchor: true,
      },
      {
        key: 'xwj_analysis_list',
        anchor: true,
      },
    ],
  },
  {
    key: 'configuration',
    icon: 'cui-wrench',
    children: [
      {
        key: 'configuration_code',
        anchor: true,
      },
      {
        key: 'configuration_product',
        anchor: true,
      },
    ],
  },
  {
    key: 'platform',
    icon: 'cui-settings',
    children: [
      {
        key: 'platform_users',
        anchor: true,
      },
      {
        key: 'platform_roles',
        anchor: true,
      }
    ]
  }
];
