import dayjs from "dayjs";

export const generateVerificationCode = (length = 6) => {
  const timestamp = dayjs().valueOf();
  const randomNum = Math.floor(Math.random() * 1000000);
  const combined = timestamp + randomNum;
  const code = combined.toString().slice(-length);
  return code;
};
