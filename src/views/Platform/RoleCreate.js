import withLoading from "../../utils/hoc/withLoading";
import {withTranslation} from "react-i18next";
import React from "react";
import {Button, Card, CardFooter} from "reactstrap";
import CardHeader from "reactstrap/es/CardHeader";
import CardBody from "reactstrap/es/CardBody";
import {NameField, NoteField, PermissionField} from "./RoleForm";
import {isEmpty, reduce} from "lodash";
import {createRole} from "../../action/user-action";

export default withTranslation()(withLoading(
  class extends React.PureComponent {
    state = {
      nameInvalid: false
    };

    nameRef = React.createRef();
    noteRef = React.createRef();
    permissionRef = React.createRef();

    render() {
      const { t } = this.props;

      return (
        <Card>
          <CardHeader className="px-4">
            {t('common.create')}
            <div className="card-header-actions">
              <Button color="link" className="card-header-action" onClick={e => this.props.history.goBack()}>
                <i className="fa fa-close fa-lg" />
              </Button>
            </div>
          </CardHeader>
          <CardBody className="pr-5">
            {/*名稱*/}
            <NameField {...this.props} ref={this.nameRef} invalid={this.state.nameInvalid} />
            {/*註記*/}
            <NoteField {...this.props} ref={this.noteRef} />
            {/*權限群組*/}
            <PermissionField {...this.props} ref={this.permissionRef} value={[]} />
          </CardBody>
          <CardFooter className="text-right pr-5">
            <Button type="button" color="primary" size="sm" onClick={this.submitHandler}>
              <i className="fa fa-dot-circle-o mr-1" />{t('common.save')}
            </Button>
          </CardFooter>
        </Card>
      );
    }

    submitHandler = e => {
      let state = {
        nameInvalid: isEmpty(this.nameRef.current.value),
      };
      this.setState(state);
      let valid = reduce(state, (valid, isInvalid) => (valid && !isInvalid), true);

      if (valid) {
        console.log('RoleCreate submitHandler');
        this.props.toggleLoading(true);
        const data = {
          name: this.nameRef.current.value,
          remark: this.noteRef.current.value,
          permission: this.permissionRef.current.value
        };
        //
        console.log(data);
        createRole(data)
          .then(res => this.props.history.push('/platform/roles'));
      }
    };
  }
));
