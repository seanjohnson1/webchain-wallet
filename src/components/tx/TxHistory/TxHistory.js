// @flow
import React from 'react';
import withStyles from 'react-jss';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { Card } from 'emerald-js-ui';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '@emeraldplatform/ui/lib/theme';
import { searchTransactions, filterTransactions } from '../../../store/wallet/history/selectors';
import Header from './Header';
import TxList from './List';

const styles2 = {
  container: {
    padding: '30px 30px 20px',
  },
};

type Props = {
  accountId: string,
  transactions: any,
  accounts: any
}

type State = {
  txFilter: string,
  displayedTransactions: Object
}

class TransactionsHistory extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      txFilter: 'ALL',
      displayedTransactions: this.props.transactions,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line
    if (nextProps.transactions) {
      this.setState({
        ...this.state,
        displayedTransactions: filterTransactions(this.state.txFilter, this.props.accountId, nextProps.transactions, this.props.accounts),
      });
    }
  }

  onSearchChange = (e) => {
    return this.setState({
      displayedTransactions: searchTransactions(e.target.value, this.props.transactions),
    });
  }

  onTxFilterChange = (event, value) => {
    const { accountId, transactions, accounts } = this.props;
    this.setState({
      txFilter: value,
      displayedTransactions: filterTransactions(value, accountId, transactions, accounts),
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme} >
        <Card>
          <div className={ classes.container } style={{border: `1px solid ${this.props.muiTheme.palette.borderColor}`}}>
            <Header
              onTxFilterChange={this.onTxFilterChange}
              txFilterValue={this.state.txFilter}
              onSearchChange={this.onSearchChange}
            />
            <TxList transactions={ this.state.displayedTransactions } accountId={ this.props.accountId }/>
          </div>
        </Card>
      </MuiThemeProvider>
    );
  }
}

const StyledTransactionsHistory = withStyles(styles2)(TransactionsHistory);

export default connect(
  (state, ownProps) => {
    const transactionsAccounts = state.wallet.history.get('trackedTransactions', new List());
    const txs = ownProps.transactions || transactionsAccounts;
    return {
      transactions: txs.sortBy((tx) => tx.get('timestamp')).reverse(),
      accounts: state.accounts.get('accounts', new List()),
      accountId: ownProps.accountId,
    };
  },
  (dispatch, ownProps) => ({
  })
)(muiThemeable()(StyledTransactionsHistory));
