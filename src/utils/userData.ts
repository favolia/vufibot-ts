import * as fs from 'fs';
import * as shortid from 'shortid';

// Define data type for users
interface User {
  id: string;
  username: string;
  money: number;
  highestMoney: number;
}

export class UserManager {
  private userData: User[];

  constructor(filePath?: string) {
    try {
      // Load user data from a JSON file
      const dataFilePath = filePath || '../../../lib/database/user.json';
      const userData = fs.readFileSync(dataFilePath, 'utf8');
      this.userData = JSON.parse(userData) as User[];
    } catch (error) {
      throw new Error("Couldn't read user data from file");
    }
  }

  /**
   * Get the current money of a user by their ID.
   * @param id User's ID.
   */
  getCurrentMoney(id: string) {
    const user = this.userData.find((a) => a.id === id);
    if (!user) {
      console.log('User not found');
      return;
    }
    console.log(user.money);
  }

  /**
   * Add money to a user's account by their ID.
   * @param id User's ID.
   * @param count Amount to add.
   */
  addMoney(id: string, count: number) {
    const user = this.userData.find((a) => a.id === id);
    if (!user) {
      console.log('User not found');
      return;
    }
    user.money += count;

    // Update the highestMoney in the user's data
    if (!user.highestMoney || user.money > user.highestMoney) {
      user.highestMoney = user.money;
    }
  }

  /**
   * Add a new user with a username and an optional initial money.
   * @param username Username of the new user.
   * @param money Initial money (default is 0).
   */
  addUser(username: string, money = 0) {
    if (this.userData.find((a) => a.username === username)) {
      console.log('User already exists');
      return;
    }

    const id = shortid.generate();
    this.userData.push({ id, username, money, highestMoney: money });
  }

  /**
   * Remove a user by their ID.
   * @param id User's ID.
   */
  removeUser(id: string) {
    const userIndex = this.userData.findIndex((a) => a.id === id);
    if (userIndex === -1) {
      console.log('User not found');
      return;
    }
    this.userData.splice(userIndex, 1);
  }

  /**
   * Set the money of a user by their ID.
   * @param id User's ID.
   * @param amount New money amount.
   */
  setMoney(id: string, amount: number) {
    const user = this.userData.find((a) => a.id === id);
    if (!user) {
      console.log('User not found');
      return;
    }
    user.money = amount;
  }

  /**
   * Edit the username of a user by their ID.
   * @param id User's ID.
   * @param newName New username.
   */
  editName(id: string, newName: string) {
    const user = this.userData.find((a) => a.id === id);
    if (!user) {
      console.log('User not found');
      return;
    }
    user.username = newName;
  }

  /**
   * Get information about all users (username and money).
   */
  getUsersInfo() {
    this.userData.forEach((user) => {
      console.log(`Username: ${user.username}, Money: ${user.money}`);
    });
  }

  /**
   * Search for users by username.
   * @param name Search query (username).
   */
  searchUserByName(name: string) {
    const similarUsers = this.userData.filter((user) => user.username.includes(name));
    similarUsers.forEach((user) => {
      console.log(`Username: ${user.username}, Money: ${user.money}`);
    });
  }

  /**
   * Get the highest money of a user by their ID.
   * @param id User's ID.
   */
  highestMoney(id: string) {
    const user = this.userData.find((a) => a.id === id);
    if (!user) {
      console.log('User not found');
      return;
    }
    console.log(user.highestMoney);
  }

  /**
   * Subtract money from a user's account by their ID.
   * @param id User's ID.
   * @param count Amount to subtract.
   */
  subtractMoney(id: string, count: number) {
    const user = this.userData.find((a) => a.id === id);
    if (!user) {
      console.log('User not found');
      return;
    }
    user.money -= count;
  }

  /**
   * Add a transaction (add or subtract money) to a user's account by their ID.
   * @param id User's ID.
   * @param description Description of the transaction.
   * @param amount Amount of the transaction.
   */
  addTransaction(id: string, description: string, amount: number) {
    const user = this.userData.find((a) => a.id === id);
    if (!user) {
      console.log('User not found');
      return;
    }
    user.money += amount;
  }

  /**
   * Get users with the highest money.
   */
  getHighestMoneyUsers() {
    const highestMoneyUsers = this.userData.filter((user) => user.money === user.highestMoney);
    highestMoneyUsers.forEach((user) => {
      console.log(`Username: ${user.username}, Money: ${user.money}`);
    });
  }

  /**
   * Search for users by a query (username or ID).
   * @param query Search query (username or ID).
   */
  searchUser(query: string) {
    const result = this.userData.filter((user) => user.username.includes(query) || user.id.includes(query));
    result.forEach((user) => {
      console.log(`Username: ${user.username}, ID: ${user.id}, Money: ${user.money}`);
    });
  }

  /**
   * Validate user data for a username and money.
   * @param data User data to validate (username and money).
   */
  validateUserData(data: { username: string; money: number }) {
    const { username, money } = data;
    if (!username || typeof money !== 'number') {
      console.log('Invalid user data');
      return;
    }
    console.log('User data is valid');
  }

  /**
   * Clear all user data.
   */
  clearUserData() {
    this.userData.length = 0;
  }

  /**
   * Export user data to a specified file path.
   * @param filePath The file path to export user data to.
   */
  exportUserData(filePath: string) {
    fs.writeFileSync(filePath, JSON.stringify(this.userData, null, 2), 'utf8');
  }

  /**
   * Calculate the total balance of all users.
   */
  calculateTotalBalance() {
    const totalBalance = this.userData.reduce((total, user) => total + user.money, 0);
    console.log(`Total balance of all users: ${totalBalance}`);
  }
}

