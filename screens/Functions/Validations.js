import React from 'react';

const PassVal = pass => {
  const passReg =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,16}$)/;
  if (pass === '') {
    return false;
  } else if (passReg.test(pass)) {
    return true;
  } else {
    return false;
  }
};

const EmailVal = email => {
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (email === '') {
    return false;
  } else if (reg.test(email)) {
    return true;
  } else {
    return false;
  }
};

const OtpVal = otp => {
  if (otp === '') {
    return false;
  } else if (otp.length !== 6) {
    return false;
  } else {
    return true;
  }
};

const MobileVal = mobile => {
  if (mobile === '') {
    return false;
  } else if (mobile.length !== 10) {
    return false;
  } else {
    return true;
  }
};

const TextVal = text => {
  let regA = /\s{3,}/g;
  let Apass = regA.test(text);
  if (text != '' && text != ' ' && text != '  ' && Apass === false) {
    return true;
    console.log('About is incorrrect')
  } else {
    console.log('About is corrrect')
    return false;
  }
};

const isNumeric = val => {
  return /^-?\d+$/.test(val);
};

export {isNumeric, PassVal, EmailVal, OtpVal, MobileVal, TextVal};
