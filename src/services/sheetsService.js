import Papa from 'papaparse';

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSkXIiuFvjisJruRkuBbenUFUTV_ww6m6F8ZKsVP9RBb6-DX3loVrw-EZxcLvr5_eQhIQuSm1qcGtf-/pub?output=csv";

export const fetchPricingData = () => {
  return new Promise((resolve, reject) => {
    Papa.parse(SHEET_CSV_URL, {
      download: true,
      header: true, // Le dice a PapaParse que la primera fila tiene los nombres de las columnas
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const formattedData = transformData(results.data);
          resolve(formattedData);
        } catch (error) {
          reject("Error formateando los datos: " + error);
        }
      },
      error: (error) => {
        reject("Error conectando con Google Sheets: " + error);
      }
    });
  });
};

// Esta función convierte las filas de Excel en el objeto JSON de tu Versión 1
const transformData = (rows) => {
  const data = {};

  rows.forEach(row => {
    // 1. Extraemos los valores de la fila
    const { 
      idioma_id, idioma_nombre, color, matricula, 
      modalidad_id, modalidad_nombre, duracion, formatos, horarios, 
      plan_id, plan_nombre, plan_precio, es_por_hora 
    } = row;

    // 2. Construimos el Idioma si no existe
    if (!data[idioma_id]) {
      data[idioma_id] = {
        nombre: idioma_nombre,
        colorTema: color,
        matricula: Number(matricula),
        modalidades: {}
      };
    }

    // 3. Construimos la Modalidad si no existe
    if (!data[idioma_id].modalidades[modalidad_id]) {
      data[idioma_id].modalidades[modalidad_id] = {
        nombre: modalidad_nombre,
        duracion: duracion,
        // Convertimos los textos separados por comas/barras en arrays
        formatos: formatos.split(',').map(f => f.trim()),
        horarios: horarios.split('|').map(h => h.trim()),
        planes: []
      };
    }

    // 4. Agregamos el Plan a la modalidad correspondiente
    // Verificamos que haya un plan (por si hay filas incompletas)
    if (plan_id && plan_nombre) {
      data[idioma_id].modalidades[modalidad_id].planes.push({
        id: plan_id,
        nombre: plan_nombre,
        precio: Number(plan_precio),
        esPorHora: es_por_hora.toLowerCase() === 'true' || es_por_hora.toLowerCase() === 'verdadero'
      });
    }
  });

  return data;
};