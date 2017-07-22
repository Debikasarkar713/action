import {css} from 'aphrodite-local-styles/no-important';
import PropTypes from 'prop-types';
import React from 'react';
import {createFragmentContainer} from 'react-relay';
import withSubscriptions from 'universal/decorators/withSubscriptions.js/withSubscriptions';
import ProviderRow from 'universal/modules/teamDashboard/components/ProviderRow/ProviderRow';
import withStyles from 'universal/styles/withStyles';
import {GITHUB, SLACK} from 'universal/utils/constants';
import ui from 'universal/styles/ui';
import Panel from 'universal/components/Panel/Panel';
import ProviderAddedSubscription from 'universal/subscriptions/ProviderAddedSubscription';
import ProviderRemovedSubscription from 'universal/subscriptions/ProviderRemovedSubscription';
import GitHubRepoAddedSubscription from 'universal/subscriptions/GitHubRepoAddedSubscription';
import GitHubRepoRemovedSubscription from 'universal/subscriptions/GitHubRepoRemovedSubscription';
import IntegrationLeftSubscription from 'universal/subscriptions/IntegrationLeftSubscription';

const ProviderList = (props) => {
  const {jwt, viewer, styles, teamId} = props;
  const {providerMap} = viewer;
  return (
    <div className={css(styles.providerList)}>
      <Panel hasHeader={false}>
        <ProviderRow name={GITHUB} providerDetails={providerMap[GITHUB]} jwt={jwt} teamId={teamId} />
        <ProviderRow name={SLACK} providerDetails={providerMap[SLACK]} jwt={jwt} teamId={teamId} />
      </Panel>
    </div>
  );
};

ProviderList.propTypes = {
  jwt: PropTypes.string,
  viewer: PropTypes.object.isRequired,
  styles: PropTypes.object,
  teamId: PropTypes.string
};

const styleThunk = () => ({
  providerList: {
    maxWidth: ui.settingsPanelMaxWidth,
    width: '100%'
  }
});

const subscriptionThunk = ({teamId, viewer: {id}}) => {
  return [
    ProviderRemovedSubscription(teamId, id),
    ProviderAddedSubscription(teamId, id),
    GitHubRepoAddedSubscription(teamId, id),
    GitHubRepoRemovedSubscription(teamId, id),
    // if they're the last ones to leave, it'll remove the repo
    IntegrationLeftSubscription(GITHUB, teamId, id)
  ];
};

export default createFragmentContainer(
  withSubscriptions(subscriptionThunk)(withStyles(styleThunk)(ProviderList)),
  graphql`
    fragment ProviderList_viewer on User {
      id
      providerMap(teamId: $teamId) {
        GitHubIntegration {
          ...ProviderRow_providerDetails
        }
        SlackIntegration {
          ...ProviderRow_providerDetails
        }
      }

    }
  `
);