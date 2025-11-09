🌦 What the Model Does:

The model is trained on the Jena Climate Dataset, which contains several years of recorded weather measurements (every 10 minutes) from a weather station in Jena, Germany.

The choses temperature is (T in °C) as the target variable to predict.

So the model is:

Predicting the temperature (in °C) based on real meteorological measurements.

The temperature value it outputs is what the weather station would have recorded at that moment.

The model learned:

- How temperature correlates with humidity
- How pressure affects temperature
- How wind affects heat transfer
- And many other physical relationships

Instead of writing physics equations manually, the neural network learned the mapping from thousands of examples.

What Each Input Field Means:

These boxes are simply weather sensor readings used to estimate the temperature:
| Feature Name | Meaning                                               | Units    | Typical Range          |
| ------------ | ----------------------------------------------------- | -------- | ---------------------- |
| **p**        | Air pressure                                          | mbar     | ~900–1050              |
| **Tpot**     | Potential temperature (converted to dry-air baseline) | Kelvin   | ~280–315 K             |
| **Tdew**     | Dew point temperature                                 | °C       | ~-10 to 20             |
| **rh**       | Relative humidity                                     | %        | 0–100                  |
| **VPmax**    | Maximum water vapor pressure                          | mbar     | depends on temperature |
| **VPact**    | Actual vapor pressure                                 | mbar     | depends on humidity    |
| **VPdef**    | Vapor pressure deficit (dryness of air)               | mbar     | 0–25                   |
| **sh**       | Specific humidity                                     | g/kg     | 0–20                   |
| **H2OC**     | Water vapor concentration                             | mmol/mol | ~5–25                  |
| **rho**      | Air density                                           | g/m³     | ~1.1–1.3               |
| **wv**       | Wind speed                                            | m/s      | 0–20                   |
| **max. wv**  | Maximum wind gust                                     | m/s      | 0–30                   |
| **wd**       | Wind direction                                        | degrees  | 0–360                  |


How to Use It:

If you don’t have real weather sensor data, use values from a weather app.

Example — Sunny warm day:

| Feature | Example Input                             |
| ------- | ----------------------------------------- |
| p       | 800                                       |
| Tpot    | 100                                       |
| Tdew    | 5                                         |
| rh      | 40                                        |
| wv      | 30                                        |
| wd      | 50                                        |
| others  | leave 0 if unsure (model will still work) |

next, Click Predict Temperature

You should see something around 25-35°C depending on the inputs.
