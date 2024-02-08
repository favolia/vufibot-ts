export const setting: any = {
    bot_name: "Vufi",
    session_name: "vufi_session",
    socket_config: {
        logger_level: "silent",
        browser: 'Safari',
        browser_version: '1.0.0'
    },
    owner: [
        {
            name: 'Defavolia',
            number: '628875090455@s.whatsapp.net',
            instagram: 'instagram.com/defavolia'
        },
        {
            name: 'Fade',
            number: '6289529753080@s.whatsapp.net',
            instagram: 'instagram.com/fadlyad_'
        },
        {
            name: 'Tdx.',
            number: '6282132447288@s.whatsapp.net',
            instagram: 'instagram.com/faridadriannn'
        },
    ],
    accountSetting: {
      max_user_per_group: 50,
      max_user_per_group_unlimited: false,
      max_username_length: 10,
      min_username_length: 3,
    },
    gameSetting: {
      quiz: {
        cakLontongPoint: 30.25,
        tebakLirikPoint: 5
      } 
    }
}

export const menuData = [
  {
    type: 'General',
    menus: [
      {
          name: 'menu',
          role: 'User',
          description: 'Menampilkan menu'
      },
      {
          name: 'ss',
          role: 'User',
          description: 'screenshot website'
      },
      {
          name: 'ai',
          role: 'User',
          description: 'Ai text'
      },
      {
          name: 'img',
          role: 'User',
          description: 'Ai Gambar dari text'
      },
      {
          name: 'ht',
          role: 'User',
          description: 'hidetag'
      },
    ]
  },
  {
    type: 'Quiz',
    menus: [
      {
        name: 'caklontong',
        role: 'User',
        description: `Quiz cak lontong diluar nalar (+${setting.gameSetting.quiz.cakLontongPoint} 💵)`
      },
      {
        name: 'tebaklirik',
        role: 'User',
        description: `Quiz tebak lirik (+${setting.gameSetting.quiz.tebakLirikPoint} 💵)`
      }
    ]
  },
  {
    type: 'Account',
    menus: [
      {
        name: 'regist',
        role: 'User',
        description: 'Buat akun minigame ke bot'
      },
      {
        name: 'akun',
        role: 'User',
        description: 'Menampilkan informasi akun'
      },
      {
        name: 'gantinama',
        role: 'User',
        description: 'Ganti nama akun'
      },
    ]
  },
  {
    type: 'Admin',
    menus: [
      {
        name: 'bye',
        role: 'Admin',
        description: 'Keluarkan bot dari grup'
      },
    ]
  },
  {
    type: 'Owner',
    menus: [
      {
          name: 'owner',
          role: 'User',
          description: 'Info tentang owner'
      },
  
      {
          name: 'ev',
          role: 'Owner',
          description: 'Evaluate'
      },
      {
          name: 'exec',
          role: 'Owner',
          description: 'Execute bash command'
      }
    ]
  },

]

export const formatMenu = (menuData: any) => {
  let formattedMenu = '';

  menuData.forEach((menuType: any) => {
    formattedMenu += `*[${menuType.type}]*\n\n`;

    menuType.menus.forEach((menuItem: any) => {
      formattedMenu += `*.${menuItem.name}*\nAccess: _${menuItem.role}_\n_${menuItem.description}_\n\n`;
    });

    formattedMenu += '\n';
  });

  return formattedMenu;
};

export const accountInfoText = (
{ id, username, money, highestMoney, quizWin, quizLose, gold, quizStreak } :
{ id: string | undefined, username: string | undefined, money: number | undefined, highestMoney: number | undefined, quizWin: number | undefined, quizLose: number | undefined, gold: number | undefined, quizStreak: number | undefined }
) => {
  return `*Info akun ${username}📌*

👤 *${username}*
💵 ${money}
💰 ${highestMoney}

*Quiz:*
✅ ${quizWin}
❌ ${quizLose}
🔗 ${quizStreak}

*Adventure:*
🥊 0
🪙 ${gold}
⚔️ 0
🏹 0
⛏️ 0
🍖 0

id: ${id}`
}