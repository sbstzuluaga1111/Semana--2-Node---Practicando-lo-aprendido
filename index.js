const fs = require('fs');
const superagent = require('superagent');

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('No pude encontrar el archivo');
      resolve(data.toString().trim());
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('No se pudo escribir el archivo');
      resolve('Exito');
    });
  });
};

const getDogPics = async () => {
  try {
    const breedsData = await readFilePro(`${__dirname}/razas.txt`);
    const breeds = breedsData.split('\n').map((breed) => breed.trim());

    const imgPromises = breeds.map(async (breed) => {
      const res = await superagent.get(`https://dog.ceo/api/breed/${breed}/images/random`);
      return res.body.message;
    });

    const imgUrls = await Promise.all(imgPromises);

    await writeFilePro('razas-image.txt', imgUrls.join('\n'));
    console.log('Imágenes aleatorias de perros guardadas en el archivo');
  } catch (err) {
    console.error(err);
    throw err;
  }
  return 'Listos';
};

(async () => {
  try {
    console.log('1: Recibiendo fotos de perros');
    await getDogPics();
    console.log('3: Se obtuvo las fotos de perros');
  } catch (err) {
    console.log('ERROR (X_X)');
  }
})();
