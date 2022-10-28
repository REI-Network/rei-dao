import * as fs from 'fs'
const path = require('path');

const validator = path.resolve(__dirname, '../src');

const jsonFileNames = fs.readdirSync(validator);

const jsonFileNameFilter = jsonFileName => {
  return jsonFileName !== '$template.json' && jsonFileName.endsWith('.json')
}
const arr = []

jsonFileNames
  .filter(jsonFileNameFilter)
  .forEach(jsonFileName => {
    // @ts-ignore
   const content = fs.readFileSync(`${validator}/${jsonFileName}`,'utf-8').toString()
    arr.push(JSON.parse(content))
  })

const obj = {
  data: arr
}

const data = new Uint8Array(Buffer.from(JSON.stringify(obj)));

const dir = '../../../public/data/address/';

const dist = path.resolve(__dirname, '../../../public/data/address')

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist);
}

fs.writeFile(dist+'/address-tag-list.json', data, (err) => {
  if (err) throw err;
  console.log('The tag file has been saved!');
});

