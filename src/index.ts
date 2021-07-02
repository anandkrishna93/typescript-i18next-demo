import i18next from "i18next";
import i18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import i18nextHttpBackend from "i18next-http-backend";

const dateTimeFormat = (format: string, hourFormat: string): any => {
  switch (format) {
    case "LongDateTime":
      return {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: hourFormat === "hour12" ? true : false,
      };
    case "ShortDateTime":
      return {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: hourFormat === "hour12" ? true : false,
      };
    case "Date":
      return {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
    case "Time":
      return {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: hourFormat === "hour12" ? true : false,
      };
    case "ShortTime":
      return {
        hour: "numeric",
        minute: "numeric",
        hour12: hourFormat === "hour12" ? true : false,
      };
  }
};

export function init(selector: string) {
  const el = document.querySelector(selector)!;

  let template = document.createElement("template");

  async function load() {
    const response = await fetch("/src/locales/locale.config.json");
    const localeConfigs = await response.json();

    localeConfigs.interpolation = {
      escapeValue: false,
      format: (value: any, rawFormat: string, lng: string) => {
        const [type, ...rest] = rawFormat
          .split(",")
          .map((v: string) => v.trim());
        switch (type) {
          case "UPPERCASE":
            return value.toUpperCase();
          case "NUMBER":
            return Intl.NumberFormat(lng).format(value);
          case "DATETIME":
            return Intl.DateTimeFormat(
              lng,
              dateTimeFormat(rest[0], rest[1])
            ).format(value);
          case "PRICE":
            return Intl.NumberFormat(lng, {
              style: "currency",
              currency: rest[0],
            }).format(value);
        }
      },
    };
    await i18next
      .use(i18nextHttpBackend)
      .use(i18nextBrowserLanguageDetector)
      .init(localeConfigs, function(err, t) {
        // console.log(err)
        // init set content
        window.document.dir = i18next.dir(navigator.language);
        updateContent();
      });
  }

  load();

  function updateContent() {
    document!.getElementById("headingId")!.innerHTML = i18next.t("heading");

    document!.getElementById("apptitle")!.innerHTML = i18next.t("title");

    document!.getElementById("author")!.innerHTML = i18next.t("author", {
      value: "Anand Krishna",
    });

    document!.getElementById(
      "numberFormat"
    )!.innerHTML = i18next.t("common:Number", { value: 1234567890 });

    const date = new Date();
    document!.getElementById("dateTime")!.innerHTML = i18next.t(
      `{{ value, DATETIME, ShortDateTime, hour24 }}`,
      {
        value: date,
      }
    );

    document!.getElementById("dateId")!.innerHTML = i18next.t(
      "{{ value, DATETIME, Date }}",
      {
        value: date,
      }
    );

    document!.getElementById("timeId")!.innerHTML = i18next.t(
      "{{ value, DATETIME, Time, hour24 }}",
      {
        value: date,
      }
    );

    document!.getElementById(
      "currencyFormat"
    )!.innerHTML = i18next.t("common:Price", { value: 1000.01 });

    document!.getElementById("btnSave")!.innerHTML = i18next.t(
      "common:button.save"
    );

    document!.getElementById("btnCancel")!.innerHTML = i18next.t(
      "common:button.cancel"
    );

    document!.getElementById("btnDelete")!.innerHTML = i18next.t(
      "common:button.delete"
    );

    document!.getElementById(
      "info"
    )!.innerHTML = `<b style='color: #f00;'>Detected user language:</b> [ ${i18next.language} ] <br/> <b style='color: #f00;'>Loaded languages:</b> [ ${i18next.languages} ]`;
  }

  template.innerHTML = `
        <style>
            .flex-col {
                flex-direction: column;
            }
            .flex-row {
                flex-direction: row;
            }
            .flex {
                display: flex;
            }
            .customInput {
                width: 250px;
                height: 35px;
                padding: 5px 20px;
                margin: 10px 0px;
                border-radius: 4px;
            }
            .plr20 {
                padding: 0px 20px;
            }
        </style>

        <div class="flex flex-col">
            <h1 id="headingId" style="padding: 0px 20px; text-align: center;"></h1>

            <div class="flex-col plr20" style="background-color: #ffd7d7;">
                <p id="apptitle" style="font-weight: 700;"></p>
                <p id="author" style="font-weight: 700;"></p>
                <p id="numberFormat" style="font-weight: 700;"></p>
                <p id="dateTime" style="font-weight: 700;"></p>
                <p id="dateId" style="font-weight: 700;"></p>
                <p id="timeId" style="font-weight: 700;"></p>
                <p id="currencyFormat" style="font-weight: 700;"></p>
                <p id="info" style="font-weight: 700;"></p>

                <div style="padding: 20px;">
                    <button type="button" id="btnSave"></button>
                    <button type="button" id="btnCancel"></button>
                    <button type="button" id="btnDelete"></button>
                </div>
            </div>
        </div>`;
  el.appendChild(template.content.cloneNode(true));
}
