import React, { Component } from 'react';
import AxiosWrapper from '../../utils/AxiosWrapper';
import { bckEndpoints } from '../../utils/CommonConstants';
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

  private async updateUsersList() {
    const result = await this.aw.request('GET', bckEndpoints.USERS);
    this.setState({ users: result });
  }

  private async deleteUser(username: string) {
    try {
      await this.aw.request('DELETE', `${bckEndpoints.USERS}/${username}`);
      this.setState({ message: `Successfully deleted user ${username}` });
      await this.updateUsersList();
      this.forceUpdate(this.clearMessage)
    } catch (e) {
      console.log(e.response);
      this.setState({ message: `Error when requesting login info: ${e.response?.data.error}` });
    }
  }

  private clearMessage() {
    setTimeout(() => this.setState({ message: '' }), 3000);
  }

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

