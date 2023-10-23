import axios from "axios";

export const family100 = async () => {
  const {data} = await axios.get("https://raw.caliph.my.id/family100.json");
  if (data.status !== 200)
    throw { status: data.status, success: false, message: data.statusText };
  const js = await data.json();
  const random = js[Math.floor(Math.random() * js.length)];
  return { status: data.status, creator: "Caliph", data: random };
};

export const siapaKahAku = async () => {
  const {data} = await axios.get("https://raw.caliph.my.id/siapakahaku.json");
  if (data.status !== 200)
    throw { status: data.status, success: false, message: data.statusText };
  const js = await data.json();
  const random = js[Math.floor(Math.random() * js.length)];
  return { status: data.status, creator: "Caliph", data: random };
};

export const cakLontong = async () => {
  try {
    const { data } = await axios.get('https://raw.githubusercontent.com/BochilTeam/database/master/games/caklontong.json');
    let json = data[Math.floor(Math.random() * data.length)];
    return { status: true, data: json };
  } catch (err: any) {
    return { status: false, message: err.message };
  }
}