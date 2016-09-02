import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Button, ButtonToolbar } from 'react-bootstrap';
import SectionHeader from '../components/Dashboard/SectionHeader';
import BlankState from '../components/Dashboard/BlankState';

import * as actions from '../actions';
import { Error, LoadingPanel, TableAction } from '../components/Dashboard';
import { RoleDeleteDialog, RoleDialog, RolesTable } from '../components/Roles';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    applications: state.applications,
    role: state.role,
    roles: state.roles,
    permissions: state.permissions
  });

  static actionsToProps = {
    ...actions.applicationActions,
    ...actions.connectionActions,
    ...actions.roleActions,
    ...actions.permissionActions
  }

  static propTypes = {
    children: PropTypes.object,
    role: PropTypes.object.isRequired,
    roles: PropTypes.object.isRequired,
    applications: PropTypes.object.isRequired,
    permissions: PropTypes.object.isRequired,
    fetchPermissions: PropTypes.func.isRequired,
    fetchApplications: PropTypes.func.isRequired,
    fetchRoles: PropTypes.func.isRequired,
    createRole: PropTypes.func.isRequired,
    editRole: PropTypes.func.isRequired,
    saveRole: PropTypes.func.isRequired,
    clearRole: PropTypes.func.isRequired,
    requestDeleteRole: PropTypes.func.isRequired,
    cancelDeleteRole: PropTypes.func.isRequired,
    deleteRole: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchApplications();
    this.props.fetchPermissions();
    this.props.fetchRoles();
  }

  renderRoleActions = (role) => (
    <div>
      <TableAction id={`edit-${role._id}`} type="default" title="Edit Role" icon="266"
        onClick={this.props.editRole} args={[ role ]} disabled={this.props.roles.get('loading') || false}
      />
      <span> </span>
      <TableAction id={`delete-${role._id}`} type="success" title="Delete Role" icon="263"
        onClick={this.props.requestDeleteRole} args={[ role ]} disabled={this.props.roles.get('loading') || false}
      />
    </div>
  )

  renderBody(records, loading) {
    return (
      <div>
        <RolesTable
          applications={this.props.applications}
          roles={this.props.roles.get('records')}
          loading={loading}
          renderActions={this.renderRoleActions}
        />
      </div>
    );
  }

  render() {
    const { error, loading, records } = this.props.roles.toJS();

    return (
      !loading && !error && !records.length ?
        <BlankState
          title="Roles"
          iconCode="292"
          description="Create and manage Roles (collection of Permissions) for your applications which can then be added to Groups."
        >
          <a href="https://auth0.com/docs/extensions/authorization-extension" target="_blank" className="btn btn-transparent btn-md">
            Read more
          </a>
          <Button bsStyle="success" onClick={this.props.createRole} disabled={this.props.roles.loading}>
            <i className="icon icon-budicon-473"></i> Create your first role
          </Button>
        </BlankState>
        :
        <div>
          <RoleDialog applications={this.props.applications} permissions={this.props.permissions} role={this.props.role} onSave={this.props.saveRole} onClose={this.props.clearRole} />
          <RoleDeleteDialog role={this.props.role} onCancel={this.props.cancelDeleteRole} onConfirm={this.props.deleteRole} />

          <SectionHeader title="Roles" description="Create and manage Roles (collection of Permissions) for your applications which can then be added to Groups.">
            <Button bsStyle="success" onClick={this.props.createRole} disabled={loading}>
              <i className="icon icon-budicon-337"></i> Create Role
            </Button>
          </SectionHeader>

          <div className="row">
            <div className="col-xs-12">
              <Error message={error} />
              <LoadingPanel show={loading}>
                {this.renderBody(records, loading)}
              </LoadingPanel>
            </div>
          </div>
        </div>
    );
  }
});
