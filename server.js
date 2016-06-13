const config = require('./config.js');

const cp = require('child_process');
const bodyParser = require('body-parser');
const moment = require('moment');
const nodemailer = require('nodemailer');
const express = require('express');
const server = express();

server.set('view engine', 'pug');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
	extended: true
}));

config.targets.forEach((target) => {
	server.get(['/', target.name].join(''), renderHtml);
	server.post(['/', target.name].join(''), renderResponse);
});

server.get('/', function(req, res) {
	var items = [];
	config.targets.forEach(function(item) {
		items.push(item.name);
	});

	res.render('index', {
		items: items
	});
});

server
	.listen(process.env.PORT || config.port, process.env.IP || "0.0.0.0", function() {
		console.log("Server listening at", process.env.PWD, process.env.IP || "0.0.0.0", process.env.PORT || config.port);
	});

function renderHtml(req, res) {
	var items = [];
	config.targets.forEach(function(item) {
		items.push(item.name);
	});

	res.render('index', {
		name: req.path.substr(1),
		items: items
	});
}

function renderResponse(req, res) {
	var target = null;
	config.targets.forEach((item) => {
		if (req.path.substr(1) === item.name)
			target = item;
	});

	var command = [
		`mkdir -p ${target.path} && cd ${target.path}`,
		'rm -rf __keeplocal && mkdir __keeplocal'
	];

	target.keeplocal.forEach((file, index) => {
		command.push(`cp -f ${file} __keeplocal/l${index}.l`);
	});

	command.push('git reset --hard HEAD');
	command.push('git pull --rebase');
	command.push('git fetch');
	command.push(`git show ${req.body.version}`);
	command.push(`git checkout -f ${req.body.version}`);

	target.keeplocal.forEach((file, index) => {
		command.push(`mv ${file} __keeplocal/del${index}.l`);
		command.push(`mv __keeplocal/l${index}.l ${file}`);
	});

	if (target.writeTag) {
		command.push(`git tag -a ${moment().format('YYYY.MM.DD-HH.mm.ss.SSS')} -m '${moment().format('YYYY/MM/DD HH:mm:ss')}'`);
		command.push('git push --tags');
	}

	command.push(target.finalCommand);

	cp.exec(command.join(';'), (err, stdout, stderr) => {
		if (target.mail) {
			var transporter = nodemailer.createTransport(target.mail.smtpTransportOptions);
			var mailOptions = {
				from: target.mail.from,
				to: target.mail.to,
				subject: `${target.name} updated.`,
				text: `${command.join('<br/>')}<br/><br/>${stdout}`
			};
			transporter.sendMail(mailOptions, function(error, info) {
				res.send({
					'result': `${command.join('<br/>')}<br/><br/>${stdout}<br/><br/>${error || info.response}`
				});

				console.log(error || info.response);
			});
		} else {
			res.send({
				'result': `${command.join('<br/>')}<br/><br/>${stdout}`
			});
		}
	});
}
