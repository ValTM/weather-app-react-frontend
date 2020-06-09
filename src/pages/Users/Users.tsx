import React, { Component } from 'react';
import AxiosWrapper from '../../utils/AxiosWrapper';
import { backendEndpoints } from '../../utils/CommonConstants';
import BasicButton from '../../components/BasicButton';
import './Users.css';

type UsersInfo = {
  username: string;
  isAdmin?: boolean
}

interface IUsersState {
  users: UsersInfo[],
  message?: string
}

/**
 * A page for user management. It displays a simple table with a delete button for each user, that the admin can utilize
 */
export default class Users extends Component<{}, IUsersState> {
  private aw: AxiosWrapper;

  constructor(params: any) {
    super(params);
    this.aw = AxiosWrapper.getInstance();
    this.state = {
      users: []
    };
    this.deleteUser = this.deleteUser.bind(this);
  }

  componentDidMount() {
    this.updateUsersList();
  }

  /**
   * Fetches users information from the backend
   */
  private async updateUsersList() {
    const result = await this.aw.request('GET', backendEndpoints.USERS);
    this.setState({ users: result });
  }

  /**
   * Triesto delete a user by username
   * @param username
   */
  private async deleteUser(username: string) {
    try {
      await this.aw.request('DELETE', `${backendEndpoints.USERS}/${username}`);
      this.setState({ message: `Successfully deleted user ${username}` });
      await this.updateUsersList();
      this.forceUpdate(this.clearMessage)
    } catch (e) {
      console.log(e.response);
      this.setState({ message: `Error when requesting login info: ${e.response?.data.error}` });
    }
  }

  /**
   * Our error messages don't stay forever on the screen, rather just 3 seconds
   */
  private clearMessage() {
    setTimeout(() => this.setState({ message: '' }), 3000);
  }

  /**
   * Render a table with a delete button for each username. The button is disabled for the admin user(s)
   */
  render() {
    const tbodyRows = this.state.users.map((user, index) =>
      <tr key={index}>
        <td>{user.username}</td>
        <td>
          <BasicButton disabled={user.isAdmin} label="Delete" clickHandler={() => this.deleteUser(user.username)}/>
        </td>
      </tr>
    );
    return (
      <div className="users">
        <div>{this.state.message}</div>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tbodyRows}
          </tbody>
        </table>
      </div>
    );
  }
}

