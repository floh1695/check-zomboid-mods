import axios from 'axios';
import fs from 'fs/promises';

const checkModAvailability = async (modId: string) => {
  const url = `https://steamcommunity.com/sharedfiles/filedetails/?id=${modId}`;
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      const data: string = response.data;
      const badPage = data.includes('There was a problem accessing the item.  Please try again.')

      if (badPage) {
        console.log(`Mod ID: ${modId} - Error Page`);
      }
      else {
        // console.log(`Mod ID: ${modId} - Available`);
      }
    } else if (response.status === 404) {
      console.log(`Mod ID: ${modId} - Unavailable (404 Not Found)`);
    } else {
      console.log(`Mod ID: ${modId} - Error: ${response.status}`);
    }
  } catch (error) {
    console.error(`Mod ID: ${modId} - Error: ${error}`);
  }
}

const checkModAvailabilityList = async (modIds: Array<string>) => {
  for (const modId of modIds) {
    checkModAvailability(modId);
  }
}

const getModIds = async (path: string): Promise<Array<string>> => {
  const pathStats = await fs.stat(path);
  if (!pathStats.isFile) throw new Error(`There is no file to read at '${path}'. Please add a file with line separated mod ids`);

  const buffer = await fs.readFile(path);
  const contents = buffer
    .toString()
    .split(/[\r\n]+/gm)
    .filter(x => x !== '');

  return contents;
}

const main = async () => {
  const modIds = await getModIds('inputs.txt');

  checkModAvailabilityList(modIds);
};

main();
