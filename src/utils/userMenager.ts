import shortid from 'shortid';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

interface User {
  id: string;
  username: string;
  oldUsername: string[];
  money: number;
  gold: number;
  highestMoney: number;
  phone: string;
  quiz: {
    match: number,
    win: number,
    lose: number,
    streak: number,
    lastStreak: number,
  },
  // adventure: {
  //   power: number,
  //   coin: number,
  //   exp: number,
  //   level: number,
  //   health: number,
  //   match: number,
  //   win: number,
  //   streak: number,
  //   lastStreak: number,
  // },
}

class UserManager {
  private _user: User[] = [];

  constructor(userData: any) {
    if (Array.isArray(userData?.users)) {
      this._user = userData.users;
    }
  }

  getCurrentMoney({ id }: { id: string | undefined }) {
    const user = this._user.find((a) => a.id === id);
    if (!user) return { status: false, message: 'User not found', messageInd: 'User tidak ditemukan.' };

    return { status: true, money: user.money };
  }

  addMoney({ id, amount = 0 }: { id: string | undefined; amount: number }) {
    const user = this._user.find((a) => a.id === id);
    if (!user) {
      return 'User not found';
    }
    user.money += amount;

    // Update the highestMoney in the user's data
    if (!user.highestMoney || user.money > user.highestMoney) {
      user.highestMoney = user.money;
    }
    return user.money;
  }

  regist({ username, phone }: { username: string | undefined; phone: string | undefined | null }) {
    if (!username || !phone) {
      return { status: false, message: 'Username or phone number is invalid!' };
    }

    if (this._user.find((a) => a.username === username)) {
      return { status: false, message: 'User already exists!' };
    }

    const id = shortid.generate();
    const newUser: User = { id, username, oldUsername: [], money: 5, highestMoney: 5, gold: 0, phone, quiz: { match: 0, win: 0, lose: 0, streak: 0, lastStreak: 0 },  };
    this._user.push(newUser);

    return { status: true, message: 'User registered successfully!', data: newUser };
  }

  editUser({ id, username, phone }: { id: string; username: string; phone: string }) {
    const user = this._user.find((a) => a.id === id);
    if (!user) {
      return 'User not found';
    }

    if (username) {
      user.username = username;
    }

    if (phone) {
      user.phone = phone;
    }

    return user;
  }

  removeUser({ id }: { id: string }) {
    const userIndex = this._user.findIndex((a) => a.id === id);
    if (userIndex === -1) {
      return { status: false, message: 'User not found' };
    }
    const removedUser = this._user.splice(userIndex, 1);
    return removedUser[0];
  }

  setMoney({ id, amount }: { id: string; amount: number }) {
    const user = this._user.find((a) => a.id === id);
    if (typeof amount !== "number" || amount < 0) return { status: false, message: 'Invalid amount' };

    if (!user) {
      return { status: false, message: 'User not found' };
    }
    user.money = amount;

    // Update the highestMoney in the user's data
    if (!user.highestMoney || amount > user.highestMoney) {
      user.highestMoney = amount;
    }
    return user.money;
  }

  updateUsername({ id, username }: { id: string | undefined; username: string }) {
    const user = this._user.find((a) => a.id === id);
    if (!user) return { status: false, message: 'User not found', messageInd: 'Akun tidak ditemukan.' };
    if (!username) return { status: false, message: 'New name is required', messageInd: 'Nama baru wajib di isi.' };
    if (this._user.find((a) => a.username === username)) return { status: false, message: 'Username already used.', messageInd: 'Nama sudah digunakan.' };
    const oldName = user?.username;
    user.oldUsername.push(oldName);
    user.username = username;
    return { status: true, newName: user.username, oldName };
  }

  getList() {
    const list = this._user.map((user) => ({
      nama: user.username,
      money: user.money,
      highestMoney: user.highestMoney,
      phone: user.phone,
    }));
    return list;
  }

  searchUsersByUsername(name: string) {
    const similarUsers = this._user.filter((user) =>
      user.username.toLowerCase().includes(name.toLowerCase())
    );
    return similarUsers;
  }

  searchUserByUsername(username: string) {
    const user = this._user.find((user) => user.username.toLowerCase() === username.toLowerCase());
    if (user) {
      return { status: true, data: user };
    } else {
      return { status: false, message: { status: false, message: 'User not found' } };
    }
  }

  searchUserById(id: string) {
    const user = this._user.find((user) => user.id === id);
    if (user) {
      return { status: true, data: user };
    } else {
      return { status: false, message: { status: false, message: 'User not found' } };
    }
  }

  searchUserByPhone(phone: string | null | undefined) {
    const user = this._user.find((user) => user.phone === phone);
    if (user) {
      return { status: true, data: user };
    } else {
      return { status: false, message: 'User not found' };
    }
  }

  highestMoney({ id }: { id: string }) {
    const user = this._user.find((a) => a.id === id);
    if (!user) {
      return 'User not found';
    }
    return `Saldo tertinggi pengguna ${user.username}: ${user.highestMoney}`;
  }

  subtractMoney({ id, amount }: { id: string; amount: number }) {
    const user = this._user.find((a) => a.id === id);
    if (!Number.isInteger(amount) || amount < 0) return 'Invalid amount';
    if (!user) {
      return 'User not found';
    }
    if (user.money < amount) {
      return 'Saldo tidak mencukupi';
    }
    user.money -= amount;
    return user.money;
  }

  addTransaction({ id, description, amount }: { id: string; description: string; amount: number }) {
    const user = this._user.find((a) => a.id === id);
    if (!user) {
      return 'User not found';
    }
    user.money += amount;
    return user.money;
  }

  getHighestMoneyUsers() {
    const sortedUsers = this._user.slice().sort((a, b) => b.highestMoney - a.highestMoney);
    return sortedUsers;
  }

  searchUser(query: string) {
    const searchResult = this._user.filter((user) =>
      user.username.toLowerCase().includes(query.toLowerCase()) || user.id === query
    );
    return searchResult;
  }

  validateUserData({ username, money }: { username: string; money: number }) {
    if (typeof username !== 'string' || username.length < 1) {
      return 'Invalid username';
    }
    if (typeof money !== 'number' || money < 0) {
      return 'Invalid money amount';
    }
    return true;
  }

  clearUserData() {
    this._user = [];
  }

  exportUserData(destination?: string) {
    try {
      const dataFilePath = path.resolve(__dirname, destination || '../../lib/database/user.json');
      writeFileSync(dataFilePath, JSON.stringify({ users: this._user }, null, 2), 'utf8');
      return 'User data exported successfully';
    } catch (error) {
      console.error('Error exporting user data:', error);
      return 'Error exporting user data';
    }
  }

  calculateTotalBalance() {
    const totalBalance = this._user.reduce((total, user) => total + user.money, 0);
    return `Total balance of all users: ${totalBalance}`;
  }

  addQuizWin({ id, amount }: { id: string | undefined, amount: number }) {
    const user = this._user.find((a) => a.id === id);
    if (!user) {
      return { status: false, message: 'User not found', messageInd: 'User tidak ditemukan.' };
    }
    user.quiz.win += amount;
    return { status: true, data: user.quiz.win };
  }

  addQuizLose({ id, amount }: { id: string | undefined, amount: number }) {
    const user = this._user.find((a) => a.id === id);
    if (!user) {
      return { status: false, message: 'User not found', messageInd: 'User tidak ditemukan.' };
    }
    user.quiz.lose += amount;
    return { status: true, data: user.quiz.lose };
  }

  addQuizStreak({ id, isWin, amount }: { id: string | undefined, isWin: boolean, amount: number }) {
    const user = this._user.find((a) => a.id === id);
    if (!user) {
      return { status: false, message: 'User not found', messageInd: 'User tidak ditemukan.' };
    }

    if (isWin) {
      if (user.quiz.streak + amount > user.quiz.lastStreak) {
        user.quiz.lastStreak = user.quiz.streak + amount;
      }

      user.quiz.streak += amount;
    } else {

      user.quiz.streak = 0;
    }

    return { status: true, data: user.quiz };
  }

  setQuizMatch({ id, match }: { id: string | undefined, match: number | undefined }) {
    if (!match || typeof match != "number") return { status: false, message: 'Invalid match', messageInd: 'Match tidak valid.' };
    const user = this._user.find((a) => a.id === id);
    if (!user) {
      return { status: false, message: 'User not found', messageInd: 'User tidak ditemukan.' };
    }
    user.quiz.match = match;
    return { status: true, data: user.quiz };
  }


  getLeaderboardHighestMoney() {
    const sortedUsers = this._user.slice().sort((a, b) => b.highestMoney - a.highestMoney);
    return sortedUsers;
  }

  getLeaderboardMoney() {
    const sortedUsers = this._user.slice().sort((a, b) => b.money - a.money);
    return sortedUsers;
  }

  getLeaderboardStreakQuiz() {
    const sortedUsers = this._user.slice().sort((a, b) => b.quiz.lastStreak - a.quiz.lastStreak);
    return sortedUsers;
  }

  getLeaderboardWinQuiz() {
    const sortedUsers = this._user.slice().sort((a, b) => b.quiz.win - a.quiz.win);
    return sortedUsers;
  }

  getLeaderboardLoseQuiz() {
    const sortedUsers = this._user.slice().sort((a, b) => b.quiz.lose - a.quiz.lose);
    return sortedUsers;
  }

  getLeaderboardMatchQuiz() {
    const sortedUsers = this._user.slice().sort((a, b) => b.quiz.match - a.quiz.match);
    return sortedUsers;
  }

  

}

export default UserManager;
