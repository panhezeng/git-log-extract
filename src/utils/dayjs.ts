import dayjsType, * as dayjsAllType from "dayjs";
// 如果不 import ide 点不出 对应的方法， 这里只是给 ts 用，编译时会被 webpack 去掉， 实际加载是后面 await import 懒加载
/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
import updateLocaleType from "dayjs/plugin/updateLocale";
import weekdayType from "dayjs/plugin/weekday";
import relativeTimeType from "dayjs/plugin/relativeTime";
import durationType from "dayjs/plugin/duration";
import dayjsCalendarType from "dayjs/plugin/calendar";
/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */

export default async function () {
  const dayjsModule: any = await import(
    /* webpackChunkName: "dayjs" */ "dayjs"
  );
  const updateLocaleModule: any = await import(
    /* webpackChunkName: "dayjsUpdateLocale" */ "dayjs/plugin/updateLocale"
  );
  const zhCnModule: any = await import(
    /* webpackChunkName: "dayjsLocaleZhCn" */ "dayjs/locale/zh-cn"
  );
  const dayjs = dayjsModule.default as typeof dayjsType & typeof dayjsAllType;
  dayjs.extend(updateLocaleModule.default);

  const localizedFormatModule: any = await import(
    /* webpackChunkName: "dayjsLocalizedFormat" */ "dayjs/plugin/localizedFormat"
  );
  dayjs.extend(localizedFormatModule.default);

  const weekdayModule: any = await import(
    /* webpackChunkName: "dayjsWeekday" */ "dayjs/plugin/weekday"
  );
  dayjs.extend(weekdayModule.default);

  const relativeTimeModule: any = await import(
    /* webpackChunkName: "dayjsRelativeTime" */ "dayjs/plugin/relativeTime"
  );
  dayjs.extend(relativeTimeModule.default);

  const durationModule: any = await import(
    /* webpackChunkName: "dayjsDuration" */ "dayjs/plugin/duration"
  );
  dayjs.extend(durationModule.default);

  const calendarModule: any = await import(
    /* webpackChunkName: "dayjsCalendar" */ "dayjs/plugin/calendar"
  );
  dayjs.extend(calendarModule.default);

  dayjs.locale(zhCnModule.default);
  dayjs.updateLocale("zh-cn", {
    weekdaysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    meridiem(hour: any, minute: any) {
      if (hour < 9) {
        return "早上";
      } else if (hour < 11 && minute < 30) {
        return "上午";
      } else if (hour < 13 && minute < 30) {
        return "中午";
      } else if (hour < 18) {
        return "下午";
      } else {
        return "晚上";
      }
    },
    calendar: {
      lastDay: "[昨天]",
      sameDay: "A h:mm",
      lastWeek: "ddd",
      lastMonth: "l",
      sameElse: "L",
    },
  });

  return dayjs;
}
