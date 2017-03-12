#!/usr/bin/env node

const request = require('superagent');
const cheerio = require('cheerio');
const colors = require('colors');
const exec = require('child_process').exec;
const getNodePage = (url) => {
    return new Promise((resolve, reject) => {
        request.get(url)
            .end((err, res) => {
                if (err) {
                    reject(err);
                }

                resolve(res.text);
            });
    });
} // get request promise
const execPromise = (cmd) => {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, res) => {
            if (err) {
                reject(err);
            }

            resolve(res);
        });
    });
};

const url = 'https://nodejs.org/en/';

const currVersion = getNodePage(url).then((html) => {
    const $ = cheerio.load(html);
    const downloadBtn = $($('.home-downloadbutton')[1]);
    const version = downloadBtn.attr('data-version');

    return version;
})
const myNodeVersion = execPromise('node -v');

Promise.all([currVersion, myNodeVersion]).then((results) => {
    const [currNodeVersion, myNodeVersion] = results;

    if (currNodeVersion.trim() !== myNodeVersion.trim()) {
        console.log('ATTENTION: your node version is out of date'.red);
        console.log('YOUR VERSION'.red + ' : ' + myNodeVersion.red);
        console.log('LATEST VERSION'.green + ' : ' + currNodeVersion.green);
    }
    else {
        console.log('NODE UP TO DATE'.green);
    }
});
