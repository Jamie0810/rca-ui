import {withTranslation} from "react-i18next";
import withLoading from "../../utils/hoc/withLoading";
import React from "react";
import {Button, Card, CardBody, CardFooter, CardHeader, Input} from "reactstrap";
import {isEmpty, reduce} from "lodash";
import {AccountField, DepartmentField, EmailField, NameField, NoteField, RoleField, StatusField} from "./UserForm";
import {createUser} from "../../action/user-action";

export default withTranslation()(withLoading(
  class extends React.PureComponent {
    state = {
      accountInvalid: false,
      nameInvalid: false
    };

    accountRef = React.createRef();
    nameRef = React.createRef();
    departmentRef = React.createRef();
    emailRef = React.createRef();
    noteRef = React.createRef();
    statusRef = React.createRef();
    roleRef = React.createRef();

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
            {/*帳號*/}
            <AccountField {...this.props}>
              <Input type="text" bsSize="sm" invalid={this.state.accountInvalid} innerRef={this.accountRef} />
            </AccountField>
            {/*名稱*/}
            <NameField {...this.props} ref={this.nameRef} invalid={this.state.nameInvalid} />
            {/*組織*/}
            <DepartmentField {...this.props} ref={this.departmentRef} />
            {/*email*/}
            <EmailField {...this.props} ref={this.emailRef} />
            {/*註記*/}
            <NoteField {...this.props} ref={this.noteRef} />
            {/*啟用狀態*/}
            <StatusField {...this.props} ref={this.statusRef} />
            {/*角色*/}
            <RoleField {...this.props} ref={this.roleRef} />
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
      // console.log(this.roleRef.current.value);
      let state = {
        accountInvalid: isEmpty(this.accountRef.current.value),
        nameInvalid: isEmpty(this.nameRef.current.value),
      };
      this.setState(state);
      let valid = reduce(state, (valid, isInvalid) => (valid && !isInvalid), true);

      if (valid) {
        this.props.toggleLoading(true);
        const data = {
          account: this.accountRef.current.value,
          name: this.nameRef.current.value,
          org: this.departmentRef.current.value,
          email: this.emailRef.current.value,
          remark: this.noteRef.current.value,
          enable: this.statusRef.current.value,
          role: this.roleRef.current.value.length > 0? this.roleRef.current.value.join(','): undefined
        };

        createUser(data)
          .then(res => this.props.history.push('/platform/users'));
      }
    };
  }));
