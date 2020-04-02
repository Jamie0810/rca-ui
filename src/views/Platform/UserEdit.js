import {withTranslation} from "react-i18next";
import withNotify from "../../utils/hoc/withNotify";
import withLoading from "../../utils/hoc/withLoading";
import React from "react";
import {createUser, getUser, updateUser} from "../../action/user-action";
import {Button, Card} from "reactstrap";
import CardHeader from "reactstrap/es/CardHeader";
import CardBody from "reactstrap/es/CardBody";
import {BlockLabel} from "../Layout";
import CardFooter from "reactstrap/es/CardFooter";
import {isEmpty, reduce} from "lodash";
import {
  AccountField,
  ChangePasswordModal,
  DepartmentField,
  EmailField, FieldLayout,
  NameField,
  NoteField, RoleField,
  StatusField
} from "./UserForm";

export default withTranslation()(withNotify(withLoading(
  class extends React.PureComponent {
    state = {
      nameInvalid: false,
      toggleChangePasswordModal: false
    };

    account = this.props.match.params.account;

    // accountRef = React.createRef();
    nameRef = React.createRef();
    departmentRef = React.createRef();
    emailRef = React.createRef();
    noteRef = React.createRef();
    statusRef = React.createRef();
    roleRef = React.createRef();

    componentDidMount() {
      getUser(this.account)
        .then(data => this.setState(data))
        .catch(error => {
          if (404 === error.code) {
            this.props.toggleLoading(this.props.t('message.system.data_not_found'));
          }
        })
        .finally(this.props.toggleLoading);
    }

    render() {
      const { t } = this.props;

      return (
        <Card>
          <ChangePasswordModal {...this.props} account={this.account}
                               isOpen={this.state.toggleChangePasswordModal} toggle={this.toggle} />
          <CardHeader className="px-4">
            {t('common.edit')}
            <div className="card-header-actions">
              <Button color="link" className="card-header-action mx-1" onClick={this.toggle}>
                <i className="fa fa-key fa-lg" />
              </Button>
              <Button color="link" className="card-header-action mx-1" onClick={e => this.props.history.goBack()}>
                <i className="fa fa-close fa-lg" />
              </Button>
            </div>
          </CardHeader>
          <CardBody className="pr-5">
            {/*帳號*/}
            <AccountField {...this.props}>
              <BlockLabel>{this.state.account}</BlockLabel>
            </AccountField>
            {/*名稱*/}
            <NameField {...this.props} ref={this.nameRef} value={this.state.name} invalid={this.state.nameInvalid} />
            {/*組織*/}
            <DepartmentField {...this.props} ref={this.departmentRef} value={this.state.org} />
            {/*email*/}
            <EmailField {...this.props} ref={this.emailRef} value={this.state.email} />
            {/*註記*/}
            <NoteField {...this.props} ref={this.noteRef} value={this.state.remark} />
            {/*啟用狀態*/}
            <StatusField {...this.props} ref={this.statusRef}
                         value={this.state.enable} suspend_time={this.state.disableModifyTime} />
            {/*建立時間*/}
            <FieldLayout caption={t('common.create_time')}>
              <BlockLabel>{this.state.createTime}</BlockLabel>
            </FieldLayout>
            {/*最後異動時間*/}
            <FieldLayout caption={t('common.modify_time')}>
              <BlockLabel>{this.state.modifyTime}</BlockLabel>
            </FieldLayout>
            {/*suspend time*/}
            <RoleField {...this.props} ref={this.roleRef} value={this.state.roles} />
          </CardBody>
          <CardFooter className="text-right pr-5">
            <Button type="button" color="primary" size="sm" onClick={this.submitHandler}>
              <i className="fa fa-dot-circle-o mr-1" />{t('common.save')}
            </Button>
          </CardFooter>
        </Card>
      );
    }

    toggle = isOpen => this.setState({ toggleChangePasswordModal: !!isOpen });

    submitHandler = e => {
      // console.log(this.roleRef.current.value);
      let state = {
        nameInvalid: isEmpty(this.nameRef.current.value)
      };
      this.setState(state);
      let valid = reduce(state, (valid, isInvalid) => (valid && !isInvalid), true);

      if (valid) {
        this.props.toggleLoading(true);
        const data = {
          name: this.nameRef.current.value,
          org: this.departmentRef.current.value,
          email: this.emailRef.current.value,
          remark: this.noteRef.current.value,
          enable: this.statusRef.current.value,
          role: this.roleRef.current.value.length > 0? this.roleRef.current.value.join(','): undefined
        };

        updateUser(this.account, data)
          .then(res => this.props.history.push('/platform/users'));
      }
    };
  }, true)));
