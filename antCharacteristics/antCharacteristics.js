$(document).ready(function () {
  // Назначение обработчика события нажатия кнопки
  $("#f_in_btn").on("click", function () {
    event.preventDefault(); // Отменяем стандартное поведение
    const antenna = {}; // Пустой объект антенны, тут будут собираться все ее характеристики

    // Получение частоты на которой работает антенна
    let freq_unit = $("#f_in_ant_freq_unit").val();
    antenna.freq_mhz = $("#f_in_ant_freq").val();
    if (freq_unit == "ghz") {
      antenna.freq_mhz = antenna.freq_mhz * 1e3;
    }
    let obj = calcLambda(antenna.freq_mhz); //расчет длины волны в метрах
    antenna.lambda_m = obj.lambda_m;
    $("#out_lambda").text(`${txt_lambda} ${obj.str}`); //установка длины волны

    //получение диаметра антенны
    antenna.diameter_m = $("#f_in_ant_diameter").val();
    obj = calcNearAndFarField(antenna.lambda_m, antenna.diameter_m); //расчет ближней и дальней зоны в метрах
    $("#out_ant_near_field").text(`${txt_near_field} \u2264 ${obj.nearField_m.toFixed(2)} м`);
    $("#out_ant_far_field").text(`${txt_far_field} \u2265 ${obj.farField_m.toFixed(2)} м`);
  });
  setTestConst(); //Установка текстовых констант
});

const txt_lambda = "Длина волны:";
const txt_near_field = "Реактивная ближняя зона:";
const txt_far_field = "Дальняя зона:";

function setTestConst() {
  $("#out_lambda").text(txt_lambda);
  $("#out_ant_near_field").text(txt_near_field);
  $("#out_ant_far_field").text(txt_far_field);
}

/**
 * @param {number} fr_mhz - Частота в мегагерцах.
 * @returns {Object} Объект, содержащий длину волны в метрах и отформатированную строку с единицей измерения.
 */
function calcLambda(fr_mhz) {
  const speed = 299.792458; //скорость света /E6
  let lambda = fr_mhz > 0 ? speed / fr_mhz : 0;
  const units = [
    { threshold: 1.0, factor: 1, suffix: " м" },
    { threshold: 0.1, factor: 10, suffix: " дм" },
    { threshold: 0.01, factor: 100, suffix: " см" },
    { threshold: 0, factor: 1000, suffix: " мм" },
  ];

  // Находим подходящую единицу измерения
  const unit = units.find((u) => lambda >= u.threshold);

  // Форматируем результат
  const scaledValue = (lambda * unit.factor).toFixed(3);
  const str = `${scaledValue} ${unit.suffix}`;

  return {
    lambda_m: lambda,
    str: str,
  };
}

/**
 * @param {number} lambda_m - Длина волны в метрах.
 * @param {number} diameter_m - Диаметр антенны в метрах.
 * @returns {Object} Объект, содержащий значения ближней и дальней зоны в метрах.
 */
function calcNearAndFarField(lambda_m, diameter_m) {
  result = {};
  if (diameter_m <= 0) {
    result.nearField_m = 0;
    result.farField_m = 0;
    return result;
  }
  let d2PerLambda = (diameter_m * diameter_m) / lambda_m;
  result.nearField_m = 0.62 * Math.sqrt(d2PerLambda * diameter_m);
  result.farField_m = 2.0 * d2PerLambda;
  return result;
}
