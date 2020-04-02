import React, { Component } from 'react';
import { Navbar, Button } from 'reactstrap';
import { SITE_TITLE } from "../../utils/site-util";
import {useTranslation} from "react-i18next";
import {withRouter} from "react-router-dom";

export default withRouter(({history, ...props}) => {

  const { t } = useTranslation();

  return (
    <Navbar className="wyj-header">
          <span>
            <Button
              className="btn mb-2 fa fa-arrow-left"
              onClick={e => history.goBack()}>
              {/* <i className="fa fa-arrow-circle-o-left h4"></i> */}
              {/* <span>回查詢頁</span> */}
            </Button>
            <label className="h2 font-weight-bold mt-1 ml-3">{t('common.wyj')} WYJ 2.0 {SITE_TITLE}</label>
          </span>
    </Navbar>
  );
})

// class WyjCaption extends Component {
//
//   render () {
//     const { t } = this.props;
//
//     return (
//         <Navbar className="wyj-header">
//           <span>
//             <Button
//               className="btn mb-2 fa fa-arrow-left"
//               onClick={this.backToQueryForm}>
//               {/* <i className="fa fa-arrow-circle-o-left h4"></i> */}
//               {/* <span>回查詢頁</span> */}
//             </Button>
//             <label className="h2 font-weight-bold mt-1 ml-3">{t('common.wyj')} WYJ 2.0 {SITE_TITLE}</label>
//           </span>
//         </Navbar>
//     );
//   }
//
//   backToQueryForm = e => {
//     this.props.history.push({
//       pathname: '/wyj',
//       // prevCriteria: this.props.criteria
//     });
//   }
// }
//
// export default withTranslation()(WyjCaption);
