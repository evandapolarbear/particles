import React from 'react';
import { render } from 'react-dom';
import Icon from './.';

var ss = document.createElement("link");
ss.type = "text/css";
ss.rel = "stylesheet";
ss.href =  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css";
document.getElementsByTagName("head")[0].appendChild(ss);

const root = document.getElementById('root');

render(<Icon icon="files" />, root);
