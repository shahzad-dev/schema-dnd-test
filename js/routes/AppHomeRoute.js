import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    bucket: () => Relay.QL`
      query {
        bucket
      }
    `,
  };
  static routeName = 'AppHomeRoute';
}
