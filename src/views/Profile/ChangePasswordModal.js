import {Alert, FormFeedback, Input} from "reactstrap";
import React from "react";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";
import {withTranslation} from "react-i18next";
import ConfirmModal from "../Coommon/ConfirmModal";
import {reduce} from "lodash";
import withLoading from "../../utils/hoc/withLoading";
import {changePassword} from "../../action/profile-action";
import withNotify from "../../utils/hoc/withNotify";

export default withTranslation()(withNotify(withLoading(
  class extends React.PureComponent {
    state = {
      password_invalid: false,
      password_confirm_invalid: false,
      message: null
    };

    confirm = e => {
      let state = {
        password_confirm_invalid: this.password_new.value !== this.password_confirm.value
      };

      this.setState(state);
      let valid = reduce(state, (valid, isInvalid) => (valid && !isInvalid), true);

      if (valid) {
        this.props.toggleLoading(true);
        const data = {
          originalPassword: this.password_original.value,
          newPassword: this.password_new.value
        };
        changePassword(data)
          .then(res => {
            this.props.pushNotification(
              this.props.t('message.profile.reset_password_success'), {level: 'success'});
            this.props.toggle();
          })
          .catch(({code, message}) => {
            let message_code = 'message.profile.reset_password_failed';
            if (code === 301) {
              message_code = 'message.profile.password_incorrect';
            }
            this.setState({message: this.props.t(message_code)});
          })
          .finally(() => this.props.toggleLoading);
      }
    };

    cancel = e => {
      this.props.toggle();
    };

    render() {
      const { t } = this.props;
      return (
        <ConfirmModal
          caption={t('common.change_password')} confirm={this.confirm} cancel={this.cancel} isOpen={this.props.isOpen}>
          <Alert color="danger" className="text-center" isOpen={!!this.state.message}>{this.state.message}</Alert>
          <FormRow>
            <FormPropertyColumn md={4}>
              <BoldLabel>{t('profile.password_original')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <Input type="password" innerRef={ref => this.password_original = ref} bsSize="sm" />
              <FormFeedback>{this.state.password_invalid}</FormFeedback>
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={4}>
              <BoldLabel>{t('profile.password_new')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <Input type="password" innerRef={ref => this.password_new = ref} bsSize="sm" />
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={4}>
              <BoldLabel>{t('profile.password_confirm')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <Input type="password" innerRef={ref => this.password_confirm = ref} invalid={this.state.password_confirm_invalid} bsSize="sm" />
              <FormFeedback>{t('message.profile.password_confirm')}</FormFeedback>
            </FormValueColumn>
          </FormRow>
        </ConfirmModal>
      );
    }
  }
)));
