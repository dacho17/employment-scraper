const path = require('path');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');

const fileNameGenerator = (time, index) => {
    if (!time) return 'file.log';

    let year = time.getFullYear();
    let month = pad(time.getMonth() + 1);
    let day = pad(time.getDate());
    return `${year}_${month}_${day}_file_${index}.log`;
}

var accessLogStream = rfs.createStream(fileNameGenerator, {
    interval: '1d',
    size: '10M',
    path: path.join(__dirname, '../logs'),
    compress: 'gzip'
});

morgan.token('thread-id', function (req, res) { return process.pid });

module.exports = morgan(':date[iso] Thread [ :thread-id ] :response-time ms :method :status :url :remote-user', {
    stream: accessLogStream
});
