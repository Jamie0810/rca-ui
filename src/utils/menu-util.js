import {assign, mapValues, keyBy, keys, pick} from 'lodash';
import menu from '../menu';
import i18next from "i18next";
import {PATHS} from "./site-util";

const menuGenerator = (config, items) => {
  // console.log('items: ', items);
  if (!items || items.length === 0)
    return false;

  return items
    .filter(item => !!config[item.key])
    .reduce((entries, item) => {
      // console.log('entries: ', entries);
      let children = menuGenerator(config, item.children);
      // console.log('item: ', item);
      if (!children && !item.anchor) {
        return entries;
      }

      let props = ['authority'];
      entries.push(
        assign({
          url: (item.anchor)? config[item.key].path: undefined,
          name: i18next.t(`menu.${item.key}`)
        }, item, pick(config[item.key], props), {children})
      );

      // console.log('entries: ', entries);

      return entries;
    }, []);
  // console.log('_items: ', _items);
  // return _items;
};

const getMenu = (permission) => {
  // console.log('permission: ', permission);
  let _permission = {};
  let _paths = PATHS;
  if (permission) {
    let _permission = keyBy(permission, 'key');
    // console.log('_permissions: ', _permissions);
    _paths = pick(_paths, keys(_permission));
  }
  _paths = mapValues(
    _paths,
    (value, key) => assign({
      path: value.path
    }, _permission[key]));
  // console.log('_paths: ', _paths);
  // console.log('menu: ', menu);

  return menuGenerator(_paths, menu);
  // console.log('_menu: ', _menu);
  // return _menu;

};

const getMenuAnchors = (items = menu) => {
  return items.reduce((entries, {anchor, key, children = []}) => {
    if (anchor) {
      entries.push({ key, name: i18next.t(`menu.${key}`) })
    }
    return entries.concat(getMenuAnchors(children));
  }, []);
};

export { getMenu, getMenuAnchors };
