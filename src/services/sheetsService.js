// src/services/sheetsService.js
import Papa from 'papaparse';

const SHEET_CSV_URL = import.meta.env.VITE_SHEET_CSV_URL;

export const fetchPricingData = () => {
  return new Promise((resolve, reject) => {
    const urlSinCache = `${SHEET_CSV_URL}&t=${new Date().getTime()}`;

    Papa.parse(urlSinCache, {
      download: true,
      header: true,
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

const transformData = (rows) => {
  const data = {};

  rows.forEach(row => {
    const { 
      idioma_id, idioma_nombre, color, matricula, 
      modalidad_id, modalidad_nombre, activo, duracion, formatos, horarios, 
      plan_id, plan_nombre, es_por_hora,
      cuotas_cantidad, primera_cuota_regular, cuota_monto_regular,
      en_promocion, etiqueta_promo, primera_cuota_promo, cuota_monto_promo
    } = row;

 
    const valActivo = activo?.toString().trim().toUpperCase();
    const estaActivo = valActivo === undefined || valActivo === '' || 
                       valActivo === 'TRUE' || valActivo === 'VERDADERO';
                       
    if (!estaActivo) return;


    const keyIdioma = idioma_nombre || idioma_id;

    if (!data[keyIdioma]) {
      data[keyIdioma] = {
        id: idioma_id,
        nombre: idioma_nombre, 
        colorTema: color || '#e8702a', 
        matricula: Number(matricula) || 0, 
        modalidades: {}
      };
    }

    if (!data[keyIdioma].modalidades[modalidad_id]) {
      data[keyIdioma].modalidades[modalidad_id] = {
        nombre: modalidad_nombre,
        duracion: duracion || '',
        formatos: new Set(),
        horarios: new Set(),
        planes: []
      };
    }

    // Filtro de Formatos
    if (modalidad_id === 'estandar' || modalidad_id === 'intensivo') {
      data[keyIdioma].modalidades[modalidad_id].formatos.add('Presencial / Híbrido');
      data[keyIdioma].modalidades[modalidad_id].formatos.add('Virtual');
    } else if (formatos) {
      formatos.split(',').forEach(f => {
        if (f.trim()) data[keyIdioma].modalidades[modalidad_id].formatos.add(f.trim());
      });
    }

    // Lector de Horarios 
    if (horarios) {
      const horariosLimpios = horarios.replace(/\r?\n/g, '|'); 
      horariosLimpios.split('|').forEach(h => {
        if (h.trim()) data[keyIdioma].modalidades[modalidad_id].horarios.add(h.trim());
      });
    }

    // Registro del Plan
    if (plan_id && plan_nombre) {
      data[keyIdioma].modalidades[modalidad_id].planes.push({
        id: plan_id,
        nombre: plan_nombre,
        precio: Number(cuota_monto_regular) || 0, 
        esPorHora: es_por_hora?.toString().toUpperCase() === 'TRUE' || es_por_hora?.toString().toUpperCase() === 'VERDADERO',
        formatosAplica: formatos || '', 
        enPromocion: en_promocion?.toString().toUpperCase() === 'TRUE' || en_promocion?.toString().toUpperCase() === 'VERDADERO',
        etiquetaPromo: etiqueta_promo || '',
        cuotasCantidad: Number(cuotas_cantidad) || 1,
        primeraCuotaRegular: Number(primera_cuota_regular) || 0,
        cuotaMontoRegular: Number(cuota_monto_regular) || 0,
        primeraCuotaPromo: Number(primera_cuota_promo) || 0,
        cuotaMontoPromo: Number(cuota_monto_promo) || 0
      });
    }
  });


  Object.values(data).forEach(idioma => {
    Object.values(idioma.modalidades).forEach(mod => {
      mod.formatos = Array.from(mod.formatos);
      mod.horarios = Array.from(mod.horarios);
    });
  });

  return data;
};