import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssueList, IsseusFilter, FilterButton, Pages, PageButton } from './styles';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  }

  state = {
    repository: {},
    issues: [],
    Allissues: [],
    loading: true,
    page: 1,
  };

  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          //per_page: 5,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      Allissues: issues.data,
      loading: false,
    });

    let index = 1;
    this.state.Allissues.forEach(i => {
      if(index <= 5) {
        this.setState({ issues: [...this.state.issues, i] });
        index++;
      }
    });
  }

  handleFilterIssues = async (filter) => {
    const { repository } = this.state;

    this.setState({ loading: true });

    const [repo, issues] = await Promise.all([
      api.get(`/repos/${repository.full_name}`),
      api.get(`/repos/${repository.full_name}/issues`, {
        params: {
          state: filter,
        },
      }),
    ]);

    this.setState({
      repository: repo.data,
      Allissues: issues.data,
      loading: false,
      page: 1,
    });

    let index = 1;
    this.state.Allissues.forEach(i => {
      if(index <= 5) {
        this.setState({ issues: [...this.state.issues, i] });
        index++;
      }
    });
  };

  handlePageNext = () => {
    this.setState({ page: this.state.page + 1 });

    let index = 0;
    let newIssues = [];

    const startPage = this.state.page * 5;
    const endPage = (this.state.page * 5) + 5;

    this.state.Allissues.forEach(issue => {
      if(index >= startPage && index < endPage) {
        newIssues.push(issue);
      }
      index++;
    });

    this.setState({
      issues: newIssues,
    });
  };

  handlePagePrevious = () => {
    this.setState({ page: this.state.page - 1 });

    let index = 0;
    let newIssues = [];

    const startPage = ((this.state.page - 1) * 5) - 5;
    const endPage = ((this.state.page - 1) * 5);

    this.state.Allissues.forEach(issue => {
      debugger;
      if(index >= startPage && index < endPage) {
        newIssues.push(issue);
      }
      index++;
    });

    this.setState({
      issues: newIssues,
    });
  };

  render() {
    const { repository, issues, loading } = this.state;

    if(loading) {
      return <Loading>Carregando</Loading>
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login}/>
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <IsseusFilter>
          <FilterButton onClick={() => this.handleFilterIssues('open')}>Issues open</FilterButton>
          <FilterButton onClick={() => this.handleFilterIssues('all')}>Issues all</FilterButton>
          <FilterButton onClick={() => this.handleFilterIssues('closed')}>Issues closed</FilterButton>
        </IsseusFilter>

        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login}/>
              <div>
                <strong>
                <a href={issue.html_url}>{issue.title}</a>
                {issue.labels.map(label => (
                  <span key={String(label.id)}>{label.name}</span>
                ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>

        <Pages>
          {
            this.state.page === 1
            ?
              <PageButton disabled onClick={this.handlePagePrevious}>Pagina anterior</PageButton>
            :
              <PageButton onClick={this.handlePagePrevious}>Pagina anterior</PageButton>
          }
          <h3>{this.state.page}</h3>
          {
            this.state.page < 6
          ?
            <PageButton onClick={this.handlePageNext}>Próxima pagina</PageButton>
          :
            <PageButton disabled onClick={this.handlePageNext}>Próxima pagina</PageButton>
        }
        </Pages>
      </Container>
    );
  }
}
