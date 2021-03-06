import PropTypes from 'prop-types';
import React from 'react';
import DashNavList from 'universal/components/DashNavList/DashNavList';
import {connect} from 'react-redux';
import {cashay} from 'cashay';
import {withRouter} from 'react-router-dom';

const dashNavListQuery = `
query {
  teams @cached(type: "[Team]") {
    id
    isArchived
    isPaid
    name
    meetingId
  }
}
`;

const mapStateToProps = () => {
  const {teams} = cashay.query(dashNavListQuery, {
    op: 'dashNavListContainer',
    resolveCached: {
      teams: () => (doc) => !doc.isArchived
    },
    sort: {
      teams: (a, b) => a.name > b.name ? 1 : -1
    }
  }).data;
  return {
    teams
  };
};

const DashNavListContainer = (props) => {
  const {teams} = props;
  return <DashNavList teams={teams} />;
};

DashNavListContainer.propTypes = {
  teams: PropTypes.array
};

// withRouter is required to keep navlinks up to date
export default withRouter(connect(mapStateToProps)(DashNavListContainer));
