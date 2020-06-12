"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagVersion = void 0;
const child_process_1 = require("child_process");
exports.tagVersion = () => {
    child_process_1.exec('git rev-list --tags --max-count=1', (err, rev, stderr) => {
        if (err) {
            console.log('\x1b[33m%s\x1b[0m', 'Could not find any revisions because: ');
            console.log('\x1b[31m%s\x1b[0m', stderr);
            return '';
        }
        child_process_1.exec(`git describe --tags ${rev}`, (err, tag, stderr) => {
            if (err) {
                console.log(`On rev ${rev}`);
                console.log('\x1b[33m%s\x1b[0m', 'Could not find any tags because: ');
                console.log('\x1b[31m%s\x1b[0m', stderr);
                return '';
            }
            console.log('\x1b[32m%s\x1b[0m', `Found tag: ${tag}`);
            return tag;
        });
    });
    return '';
};
