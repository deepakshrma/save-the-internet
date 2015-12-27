/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-core/polyfill';
import path from 'path';
import fs from 'fs';
import express from 'express';
import MG from 'mailgun-js';
import BodyParser from 'body-parser'
import React from 'react';
import ReactDOM from 'react-dom/server';
import Router from './routes';
import Html from './components/Html';
import assets from './assets';
import { port } from './config';

const server = global.server = express();
const  defaultMessage = "To,\nRS Sharma,\nChairman, TRAI \nCC:Vinod Kotwal, Advisor (F&EA), TRAI\n\nDear Sir,\nOn the outset, I would request you not to publish my email address on the TRAI website. Thank you for this Consultation Paper on Differential Pricing for Data Services; this issue is key to securing net neutrality in India. I am thankful that the TRAI has both highlighted the need for preventing discriminatory practices in this paper, and looked into the issue of making the Internet available to all. Both Internet access and Net Neutrality are important, and we shouldn’t be choosing between the two. Instead we should strive for increasing connectivity which complies with Net Neutrality, ensuring meaningful Internet access for all Indians. I would like to point out that some of the questions on price discrimination, raised in this consultation, had already been raised in the consultation on regulation of OTT services, to which over 12 lakh Indians had sent responses. Those answers should be considered by the TRAI in this consultation paper on Differential Pricing for Data services. The TRAI should bring in rules to prevent Net Neutrality violations such as differential pricing - especially the practice of “Zero Rating”. I hope the TRAI considers my answers. \nIn the meantime I request that it:\n\ta. Ensures that violations of Net Neutrality are paused until a clear policy is finalized\n\tb. Takes into consideration the submissions made to questions 14 and 15 in the previous Consultation on OTT Services for this current consultation process\n\nThanking you";
var api_key = 'key-3bmflcan86si8nwsc-dkwg43s8qv9ul6';
var domain = 'app27208831.mailgun.org';
var mailgun = MG({apiKey: api_key, domain: domain});


//
// Register Node.js middleware
// -----------------------------------------------------------------------------
server.use(express.static(path.join(__dirname, 'public')));
// parse application/x-www-form-urlencoded
server.use(BodyParser.urlencoded({ extended: false }))
server.use(BodyParser.json())

//
// Register API middleware
// -----------------------------------------------------------------------------
server.use('/api/content', require('./api/content'));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
server.get('*', async (req, res, next) => {
  try {
    let statusCode = 200;
    const data = { title: '', description: '', css: '', body: '', entry: assets.main.js };
    const css = [];
    const context = {
      insertCss: styles => css.push(styles._getCss()),
      onSetTitle: value => data.title = value,
      onSetMeta: (key, value) => data[key] = value,
      onPageNotFound: () => statusCode = 404,
    };

    await Router.dispatch({ path: req.path, query: req.query, context }, (state, component) => {
      data.body = ReactDOM.renderToString(component);
      data.css = css.join('');
    });

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(statusCode).send('<!doctype html>\n' + html);
  } catch (err) {
    next(err);
  }
});
server.post('/sendMessageToTrai', async (req, res, next) => {
    console.info("Data Received ::", req.body);
    if (!req.body.userName) {
        return res.status(404).send({error: 'Invalid request! missing userName'});
    } else {
        var userName = req.body.userName,
            userEmail = req.body.userEmail,
            message = req.body.message,
            selected = req.body.selected
        var data = {
            from: userName + '<' + userEmail + '>',
            to: 'advisorfea1@trai.gov.in',
            bcc: 'trai@email.savetheinternet.in',
            subject: (selected == 'destroy') ? 'Enforce Free Internet' : 'Save Net neutrality. We want net neutrality',
            text: message || defaultMessage
        };
        mailgun.messages().send(data, function (error, body) {
            console.info(error, body);
            if (error) {
                console.error(error);
                return res.status(500).send({error: 'Server Error!!'});
            } else {
                return res.status(200).send({data: 'Thank you for supporting us! \n More Info visit: ' +
                '\n\thttp://www.savetheinternet.com/net-neutrality-what-you-need-know-now ' +
                '\n\thttps://www.aclu.org/feature/what-net-neutrality' +
                '\n\thttp://economictimes.indiatimes.com/tech/internet/net-neutrality-microsoft-snubs-facebooks-plan/articleshow/50317628.cms'});
            }
        });
    }
});
//
// Launch the server
// -----------------------------------------------------------------------------
server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://localhost:${port}/`);
});
