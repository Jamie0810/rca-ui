import React from "react";
import CardHeader from "reactstrap/es/CardHeader";
import {useTranslation} from "react-i18next";
import Card from "reactstrap/es/Card";
import {Collapse} from "reactstrap";
import CardBody from "reactstrap/es/CardBody";

const _props = {
  entries: [
    {
      "key": "fdj",
      "order": "1",
      "child": [
        {
          "id": 1,
          "key": "fdj_add",
          "path": "xxx",
          "order": "1",
          "authority": "CRUD"
        },
        {
          "id": 2,
          "key": "fdj_update",
          "path": "ooo",
          "order": "2",
          "authority": "CRUD",
          "child": [
            {
              "id": 1,
              "key": "fdj_add",
              "path": "xxx",
              "order": "1",
              "authority": "CRUD"
            },
            {
              "id": 2,
              "key": "fdj_update",
              "path": "ooo",
              "order": "2",
              "authority": "CRUD"
            }
          ]
        }
      ]
    },
    {
      "key": "xwj",
      "order": "2",
      "child": [
        {
          "id":3,
          "key": "xwj_add",
          "path": "xxx",
          "order": "1",
          "authority": "CRUD"
        },
        {
          "id": 4,
          "key": "xwj_update",
          "path": "ooo",
          "order": "2",
          "authority": "CRUD"
        }
      ]
    }
  ]
};

function Entry(props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(true);
  const { key, name, url, children = [], authority, component } = props.entry;
  const item = component || (<span>{t(`menu.${key}`)}</span>);

  if (!children) {
    return (
      <div className="py-2 px-4">
        {item}
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="py-2 px-3 border-bottom" onClick={e => setIsOpen(!isOpen)}>
        {isOpen? (<i className="fa fa-angle-down mr-3" />): (<i className="fa fa-angle-right mr-3" />)}
        {item}
      </div>
      <Collapse isOpen={isOpen} entries={children}>
        <CardBody className="py-0 pr-0">
          <Entries entries={children}/>
        </CardBody>
      </Collapse>
    </React.Fragment>
  );
}

function Entries ({entries}) {
  return (
    <React.Fragment>
      {
        entries.map(entry => (
          <Entry key={entry.key} entry={entry}/>
        ))
      }
    </React.Fragment>
  );
}

export default function (props) {
  // console.log(props);
  // let { entries } = _props;

  return (
    <Card>
      <Entries {...props}/>
    </Card>
  );
}
