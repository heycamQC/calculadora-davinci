// src/services/sheetsService.js
import Papa from 'papaparse';

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT6Omq3fpy10yeYWVhnXJa_AezIVDahPqAPFR-En60vVtFe73tBbD_cAVDuLsATsOjEQLRuV3siovpK/pub?output=csv";

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
      modalidad_id, modalidad_nombre, duracion, formatos, horarios, 
      plan_id, plan_nombre, es_por_hora,
      cuotas_cantidad, primera_cuota_regular, cuota_monto_regular,
      en_promocion, etiqueta_promo, primera_cuota_promo, cuota_monto_promo
    } = row;

    if (!data[idioma_id]) {
      data[idioma_id] = {
        nombre: idioma_nombre, colorTema: color, matricula: Number(matricula), modalidades: {}
      };
    }

    if (!data[idioma_id].modalidades[modalidad_id]) {
      data[idioma_id].modalidades[modalidad_id] = {
        nombre: modalidad_nombre,
        duracion: duracion,
        formatos: new Set(),
        horarios: new Set(),
        planes: []
      };
    }

    // Filtro de Formatos (Mantenemos la lógica limpia)
    if (modalidad_id === 'estandar' || modalidad_id === 'intensivo') {
      data[idioma_id].modalidades[modalidad_id].formatos.add('Presencial / Híbrido');
      data[idioma_id].modalidades[modalidad_id].formatos.add('Virtual');
    } else if (formatos) {
      formatos.split(',').forEach(f => {
        if (f.trim()) data[idioma_id].modalidades[modalidad_id].formatos.add(f.trim());
      });
    }

    // 🛠️ LECTOR DE HORARIOS 
    // Lee saltos de línea (Enter en la celda) y barras verticales (|) 
    if (horarios) {
      const horariosLimpios = horarios.replace(/\r?\n/g, '|'); 
      horariosLimpios.split('|').forEach(h => {
        if (h.trim()) data[idioma_id].modalidades[modalidad_id].horarios.add(h.trim());
      });
    }

    if (plan_id && plan_nombre) {
      data[idioma_id].modalidades[modalidad_id].planes.push({
        id: plan_id,
        nombre: plan_nombre,
        precio: Number(cuota_monto_regular) || 0, 
        esPorHora: es_por_hora?.toLowerCase() === 'true' || es_por_hora?.toLowerCase() === 'verdadero',
        formatosAplica: formatos || '', 
        enPromocion: en_promocion?.toUpperCase() === 'TRUE',
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