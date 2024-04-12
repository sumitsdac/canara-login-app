const randomGenerate = () => {
  let value = btoa(Math.random() * 1000000000);
  value = value.substring(0, 6);
  return value;
};

export const GenerateCaptcha = () => {
  let captchaValue = randomGenerate();
  const fonts = ["cursive"];

  let html = captchaValue
    .split("")
    .map((char) => {
      const rotate = -20 + Math.trunc(Math.random() * 30);
      const font = Math.trunc(Math.random() * fonts.length);
      return `<span
        style="
        transform:rotate(${rotate}deg);
        font-family:${font[font]};
        "
       >${char} </span>`;
    })
    .join("");
  return { html, captchaValue };
};
